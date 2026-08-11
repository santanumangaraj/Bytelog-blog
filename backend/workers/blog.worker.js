import "dotenv/config";
import path from "path";
import fs from "fs";
import s3 from "../config/s3.js";
import redis from "../config/redis.js";
import { Worker } from "bullmq";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { findBlogByPk, updateBlog } from "../repository/blog.repository.js";
import { optimizeImage } from "../utils/optimizeImage.utils.js";
import { cacheKey } from "../cache/cacheKey.js";
import { releaseLock } from "../cache/redisLock.js";

const blogImageWorker = new Worker("blog-image-processing", async (job) => {
    console.log("Worker received job");

    const { blogId, status, tempFilePath, originalFileName } = job.data;

    console.log("Status from worker: ", status);
    if (!blogId || !tempFilePath) {
        throw new Error("Job payload must include blogId and tempFilePath");
    }

    const blog = await findBlogByPk(blogId);
    if (!blog) {
        throw new Error(`Blog with id ${blogId} was not found while processing the image`);
    }

    const optimizedKey = `uploads/blogImage/blog-${blogId}.webp`;
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${optimizedKey}`;

    // Extract base filename and resolve it relative to the local public/temp directory to handle Windows host/Linux container hybrids.
    const cleanPath = tempFilePath.replace(/\\/g, "/");
    const tempFileName = path.basename(cleanPath);
    const resolvedTempPath = path.resolve("public/temp", tempFileName);

    // Verify if temporary file exists on the local server
    let tempFileExists = false;
    try {
        await fs.promises.access(resolvedTempPath, fs.constants.F_OK);
        tempFileExists = true;
    } catch (err) {
        // Temporary file does not exist
    }

    // Idempotency: If database already contains S3 URL + Key and temp file is gone, mark job as completed.
    if (blog.coverImageUrl === fileUrl && blog.coverImageKey === optimizedKey && !tempFileExists) {
        console.log(`Blog image processing already completed for blogId ${blogId}. No temp file found, marking job success.`);
        return {
            blogId,
            optimizedKey,
            fileUrl,
            alreadyProcessed: true
        };
    }

    if (!tempFileExists) {
        throw new Error(`Temporary image file does not exist for blog ID ${blogId} at path: ${resolvedTempPath} (origin: ${tempFilePath})`);
    }

    const lockKey = cacheKey.blogImageLock(blogId);
    const lockAcquired = await redis.set(lockKey, job.id, "NX", "EX", 600);

    if (lockAcquired !== "OK") {
        throw new Error(`Blog image processing lock already held for blogId ${blogId}`);
    }

    try {
        // Compress/resize/optimize local image using Sharp
        const optimizedBuffer = await optimizeImage(resolvedTempPath);

        // Upload the optimized WebP buffer to AWS S3
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: optimizedKey,
                Body: optimizedBuffer,
                ContentType: "image/webp",
            })
        );

        // Update blog database record
        await updateBlog(blog, {
            coverImageUrl: fileUrl,
            coverImageKey: optimizedKey,
            status: status ?? "published",
            publishedAt: new Date(),
        });

        // Delete local temporary file
        await fs.promises.unlink(resolvedTempPath);
        console.log("Blog image processed, uploaded to S3, and temporary file deleted successfully");

        return {
            blogId,
            optimizedKey,
            fileUrl,
        };
    } catch (error) {
        console.error(`Attempt ${job.attemptsMade + 1} of ${job.opts.attempts} failed:`, error);

        // Clean up temp file only on the final failure to prevent storage leaks
        const maxAttempts = job.opts.attempts || 5;
        if (job.attemptsMade + 1 >= maxAttempts) {
            console.warn(`Job for blogId ${blogId} has failed all attempts. Cleaning up temporary file: ${resolvedTempPath}`);
            try {
                await fs.promises.unlink(resolvedTempPath);
            } catch (unlinkErr) {
                if (unlinkErr.code !== "ENOENT") {
                    console.error(`Failed to clean up temporary file ${resolvedTempPath} on final failure:`, unlinkErr);
                }
            }
        }

        throw error;
    } finally {
        await releaseLock(lockKey, job.id);
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