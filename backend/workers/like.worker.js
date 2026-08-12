import "dotenv/config"
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { findBlogLikeByPk, findOneBlogLike,destoryBlogLike, createBlogLike } from "../repository/like.repository.js";
import { decrementLikeCount, incrementLikeCount } from "../services/redisLike.service.js";
import { ApiError } from "../utils/ApiError.js";
import { findBlogByPk } from "../repository/blog.repository.js";

process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
    console.error("💥 Uncaught Exception:", err);
    process.exit(1);
});

// KNOWN LIMITATIONS (acceptable tradeoff at current scale, not fixed here):
// 1. concurrency: 20 gives no strict ordering guarantee for rapid like/unlike
//    toggles from the same user on the same blog — jobs can be picked up out
//    of order. A real fix needs per-entity serialization (single-concurrency
//    partition per blogId, or a distributed lock).
// 2. If a job exhausts all 5 retry attempts, the Redis like counter and the
//    `like` table can drift with no automatic reconciliation. A periodic job
//    comparing `redis.get(blog:{id}:likes)` against `countBlogLiked` would
//    close this gap; not implemented yet.
const toggleLikeWorker = new Worker("toggle-like-processing",async (job) => {
        console.log(`Processing ${job.name} job`);

        const { blogId, likedBy } = job.data;

        try {
            switch (job.name) {
                case "toggle-like-process":
                    try {
                        await createBlogLike({
                            blogId,
                            likedBy
                        });
                        await incrementLikeCount(blogId);
                        return {
                            action: "LIKED"
                        };
                    } catch (error) {
                        if (error.name === "SequelizeUniqueConstraintError") {
                            return {
                                action: "ALREADY_LIKED"
                            };
                        }
                        throw error;
                    }

                case "toggle-unlike-process":
                    const deletedRows = await destoryBlogLike({
                        blogId,
                        likedBy
                    });
                    if (deletedRows > 0) {
                        await decrementLikeCount(blogId);
                        return {
                            action: "UNLIKED"
                        };
                    }
                    return {
                        action: "ALREADY_UNLIKED"
                    };
                default:
                    throw new Error(`Unknown job type: ${job.name}`);
            }
        } catch (error) {

            console.log(
                `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`
            );

            throw error;
        }

    },
    {
        connection: redis,
        concurrency: 20
    }
);

toggleLikeWorker.on("completed", (job, result) => {

    console.log(
        `Job ${job.id} completed - ${result.action}`
    );

});

toggleLikeWorker.on("failed", (job, err) => {

    console.error(
        `Job ${job?.id} failed`,
        err.message
    );

});

const shutdown = async (signal) => {
    console.log(`${signal} received: closing like worker`);
    await toggleLikeWorker.close();
    process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));