import { Queue } from "bullmq";
import redis from "../config/redis.js";

const toggleLikeQueue = new Queue("toggle-like-processing",{
    connection: redis
});
toggleLikeQueue.on("error", () => {});

export {
    toggleLikeQueue
}