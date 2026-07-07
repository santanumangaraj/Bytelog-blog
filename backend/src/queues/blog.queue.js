import { Queue } from "bullmq";

const blogImageUploadQueue = new Queue("blog-image-processing",{
    connection: "127.0.0.1",
    port:6379
})

export {
    blogImageUploadQueue
}