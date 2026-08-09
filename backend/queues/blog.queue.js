import { Queue } from "bullmq";
import redis from "../config/redis.js";

const blogImageUploadQueue = new Queue("blog-image-processing",{
    connection: redis
});
blogImageUploadQueue.on("error", () => {});

const delBlogImgQueue = new Queue("del-blog-img-processing",{
    connection: redis
});
delBlogImgQueue.on("error", () => {});

export {
    blogImageUploadQueue,
    delBlogImgQueue
}