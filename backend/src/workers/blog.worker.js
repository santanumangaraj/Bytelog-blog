import "dotenv/config"
import { Worker } from "bullmq";
import { PutObjectCommand} from "@aws-sdk/client-s3";
import s3 from "../config/s3.js"
import fs from "fs"
import { findBlogByPk, findOneBlog, updateBlog } from "../repository/blog.repository.js";
import { optimizeImage } from "../utils/optimizeImage.utils.js";

const blogImageWorker = new Worker("blog-image-processing",async(job)=>{
    console.log("Worker received job");
    console.log(job.data);

    const { blogId,filePath,mimetype,fileName,status} = job.data
    
    try {
        const s3Key = `uploads/blogImage/${Date.now()}-${fileName}`;
    
        const newOptimizeImgPath = `${filePath}.webp`
    
        const optimizeImg = await optimizeImage(filePath,newOptimizeImgPath);
    
        const fileBuffer = fs.readFileSync(newOptimizeImgPath);
    
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: s3Key,
            Body: fileBuffer,
            ContentType: "image/webp"
        })
    
        await s3.send(command);
    
        const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;
    
        const getBlog = await findBlogByPk(blogId);
    
        const publishedAt = status === "published"? new Date():null;
    
        await updateBlog(getBlog,{coverImageUrl:fileUrl,coverImageKey:s3Key,status,publishedAt})
    
        fs.unlinkSync(filePath);
        fs.unlinkSync(newOptimizeImgPath)
    
    } catch (error) {
        console.log(
            `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`
        );
    }
},{
    connection: {
        host: "127.0.0.1",
        port: 6379,
}})

blogImageWorker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

blogImageWorker.on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
})