import "dotenv/config";
import path from "path";
import s3 from "../config/s3.js";
import redis from "../config/redis.js";
import { Worker } from "bullmq";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { findBlogByPk, updateBlog } from "../repository/blog.repository.js";
import { optimizeImage } from "../utils/optimizeImage.utils.js";
import { cacheKey } from "../cache/cacheKey.js";

const streamToBuffer = async (body) => {
    if (!body) {
        throw new Error("S3 object body is empty");
    }

    const chunks = [];
    for await (const chunk of body) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    return Buffer.concat(chunks);
};

const blogImageWorker = new Worker("blog-image-processing", async (job) => {
    console.log("Worker received job");

    const { blogId, originalImageKey, fileName } = job.data;

    if (!blogId || !originalImageKey) {
        throw new Error("Job payload must include blogId and originalImageKey");
    }

    const lockKey = cacheKey.blogImageLock(blogId);
    const lockAcquired = await redis.set(lockKey, job.id, "NX", "EX", 600);

    if (lockAcquired !== "OK") {
        throw new Error(`Blog image processing lock already held for blogId ${blogId}`);
    }

    try {
        console.log("originalImageKey:", originalImageKey);

        const originalImage = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: originalImageKey,
            })
        );

        const originalBuffer = await streamToBuffer(originalImage.Body);
        const optimizedBuffer = await optimizeImage(originalBuffer);

        const baseName = path.parse(fileName || originalImageKey.split("/").pop() || "blog-image").name;
        const optimizedKey = `uploads/blogImage/${Date.now()}-${baseName}.webp`;

        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: optimizedKey,
                Body: optimizedBuffer,
                ContentType: "image/webp",
            })
        );

        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${optimizedKey}`;
        const blog = await findBlogByPk(blogId);

        if (!blog) {
            throw new Error(`Blog with id ${blogId} was not found while processing the image`);
        }

        try {
            await updateBlog(blog, {
                coverImageUrl: fileUrl,
                coverImageKey: optimizedKey,
                status: "published",
                publishedAt: new Date(),
            });
        } catch (dbError) {
            try {
                await s3.send(
                    new DeleteObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: optimizedKey,
                    })
                );
            } catch (cleanupError) {
                console.error("Failed to clean up optimized image after DB update failure:", cleanupError);
            }
            throw dbError;
        }

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: originalImageKey,
            })
        );

        console.log("Blog image processed and original object deleted from S3 successfully");
        return {
            blogId,
            originalImageKey,
            optimizedKey,
            fileUrl,
        };
    } catch (error) {
        console.log(
            `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`
        );
        throw error;
    } finally {
        await redis.del(lockKey);
    }
}, {
    connection: redis,
}).on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
}).on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
});

const delBlogImageWorker = new Worker("del-blog-img-processing", async (job) => {
    console.log("Delete blog image worker job received!!");

    const { coverImageKey } = job.data;

    try {
        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: coverImageKey,
            })
        );

        console.log("Blog image was deleted successfully from s3 server");
    } catch (error) {
        console.log(
            `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`,
            error
        );

        throw error;
    }
}, {
    connection: redis,
}).on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
}).on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
});

export { blogImageWorker, delBlogImageWorker };