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

process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

// Resolve a job's tempFilePath to the actual on-disk path (handles Windows
// host / Linux container path-separator differences) and report whether it
// still exists.
const resolveTempFile = async (tempFilePath) => {
    const cleanPath = tempFilePath.replace(/\\/g, "/");
    const tempFileName = path.basename(cleanPath);
    const resolvedTempPath = path.resolve("public/temp", tempFileName);

    let tempFileExists = false;
    try {
        await fs.promises.access(resolvedTempPath, fs.constants.F_OK);
        tempFileExists = true;
    } catch (err) {
        // Temporary file does not exist
    }

    return { resolvedTempPath, tempFileExists };
};

// Clean up the temp file only once a job has exhausted all its retry
// attempts, so a transient failure doesn't leave nothing left to retry with.
const cleanupTempFileOnFinalFailure = async (job, resolvedTempPath, blogId) => {
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
};

const blogImageWorker = new Worker("blog-image-processing", async (job) => {
    console.log(`Processing ${job.name} job`);

    switch (job.name) {
        case "blog-image-process": {
            /* First-time cover image for a freshly published blog — sets
               status/publishedAt too, since this runs as part of publish. */
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

            const { resolvedTempPath, tempFileExists } = await resolveTempFile(tempFilePath);

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
                const optimizedBuffer = await optimizeImage(resolvedTempPath);

                await s3.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: optimizedKey,
                        Body: optimizedBuffer,
                        ContentType: "image/webp",
                    })
                );

                await updateBlog(blog, {
                    coverImageUrl: fileUrl,
                    coverImageKey: optimizedKey,
                    status: status ?? "published",
                    publishedAt: new Date(),
                });

                await fs.promises.unlink(resolvedTempPath);
                console.log("Blog image processed, uploaded to S3, and temporary file deleted successfully");

                return {
                    blogId,
                    optimizedKey,
                    fileUrl,
                };
            } catch (error) {
                console.error(`Attempt ${job.attemptsMade + 1} of ${job.opts.attempts} failed:`, error);
                await cleanupTempFileOnFinalFailure(job, resolvedTempPath, blogId);
                throw error;
            } finally {
                await releaseLock(lockKey, job.id);
            }
        }

        case "blog-image-update-process": {
            /* Cover image replacement on an already-published/draft/archived
               blog (from EditBlog). Deliberately does NOT touch status or
               publishedAt — only the cover image and its S3 object change.
               Each update gets a fresh, job-id-scoped S3 key (rather than
               reusing the original deterministic key) so browsers/CDNs that
               cached the old coverImageUrl don't keep serving a stale image,
               and so a BullMQ retry re-uploads to the same key instead of
               leaking a new one on every attempt. */
            const { blogId, oldCoverImageKey, tempFilePath, originalFileName } = job.data;

            if (!blogId || !tempFilePath) {
                throw new Error("Job payload must include blogId and tempFilePath");
            }

            const blog = await findBlogByPk(blogId);
            if (!blog) {
                throw new Error(`Blog with id ${blogId} was not found while processing the image`);
            }

            const optimizedKey = `uploads/blogImage/blog-${blogId}-${job.id}.webp`;
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${optimizedKey}`;

            const { resolvedTempPath, tempFileExists } = await resolveTempFile(tempFilePath);

            if (blog.coverImageUrl === fileUrl && blog.coverImageKey === optimizedKey && !tempFileExists) {
                console.log(`Blog cover update already completed for blogId ${blogId}. No temp file found, marking job success.`);
                return { blogId, optimizedKey, fileUrl, alreadyProcessed: true };
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
                const optimizedBuffer = await optimizeImage(resolvedTempPath);

                // Remove the previous cover from S3 before the new one goes up.
                // Best-effort: a missing/already-gone old key shouldn't fail
                // the whole update — the new image is what actually matters.
                if (oldCoverImageKey) {
                    try {
                        await s3.send(
                            new DeleteObjectCommand({
                                Bucket: process.env.AWS_BUCKET_NAME,
                                Key: oldCoverImageKey,
                            })
                        );
                        console.log(`Old cover image ${oldCoverImageKey} deleted for blogId ${blogId}`);
                    } catch (delErr) {
                        console.warn(`Could not delete old cover image ${oldCoverImageKey} for blogId ${blogId}:`, delErr.message);
                    }
                }

                await s3.send(
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: optimizedKey,
                        Body: optimizedBuffer,
                        ContentType: "image/webp",
                    })
                );

                await updateBlog(blog, {
                    coverImageUrl: fileUrl,
                    coverImageKey: optimizedKey,
                });

                await fs.promises.unlink(resolvedTempPath);
                console.log("Blog cover image updated, old cover removed from S3, and temporary file deleted successfully");

                return { blogId, optimizedKey, fileUrl };
            } catch (error) {
                console.error(`Attempt ${job.attemptsMade + 1} of ${job.opts.attempts} failed:`, error);
                await cleanupTempFileOnFinalFailure(job, resolvedTempPath, blogId);
                throw error;
            } finally {
                await releaseLock(lockKey, job.id);
            }
        }

        default:
            throw new Error(`Unknown job type: ${job.name}`);
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

// Let BullMQ finish/checkpoint whatever job is currently in flight before the
// process exits — otherwise a mid-upload/mid-S3-write job gets hard-killed
// on every restart with no chance to release its lock or fail cleanly.
const shutdown = async (signal) => {
    console.log(`${signal} received: closing blog workers`);
    await Promise.all([blogImageWorker.close(), delBlogImageWorker.close()]);
    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

export { blogImageWorker, delBlogImageWorker };
