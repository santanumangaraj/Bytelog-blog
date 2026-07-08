import "dotenv/config"
import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { findBlogLikeByPk, findOneBlogLike,destoryBlogLike, createBlogLike } from "../repository/like.repository.js";
import { decrementLikeCount, incrementLikeCount } from "../services/redisLike.service.js";
import { ApiError } from "../utils/ApiError.js";
import { findBlogByPk } from "../repository/blog.repository.js";

const toggleLikeWorker = new Worker(
    "toggle-like-processing",
    async (job) => {

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