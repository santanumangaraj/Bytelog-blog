import dotenv from "dotenv";
import path from "path"
dotenv.config({
    path: path.resolve(process.cwd(),"../.env"),
});
import fs from "fs"
import s3 from "../config/s3.js"
import redis from "../config/redis.js";
import { Worker } from "bullmq";
import { DeleteObjectCommand, PutObjectCommand} from "@aws-sdk/client-s3";
import { findBlogByPk, findOneBlog, updateBlog } from "../repository/blog.repository.js";
import { optimizeImage } from "../utils/optimizeImage.utils.js";
import { cacheKey } from "../cache/cacheKey.js";

const blogImageWorker = new Worker("blog-image-processing",async(job)=>{
    console.log("Worker received job");

    const { blogId,filePath,fileName} = job.data
    
    const lockKey = cacheKey.blogImageLock(blogId);
    try {
        const baseName = path.parse(fileName).name;

        const s3Key = `uploads/blogImage/${Date.now()}-${baseName}.webp`;

        const absolutePath = path.resolve(process.cwd(), "..", filePath);
    
        const newOptimizeImgPath = await optimizeImage(absolutePath,`${absolutePath}.webp`);

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
        
        await updateBlog(getBlog,{coverImageUrl:fileUrl,coverImageKey:s3Key,status:"published",publishedAt:new Date()})
    

        try {
            if (absolutePath) {
                await fs.promises.unlink(absolutePath);
            }

            if (newOptimizeImgPath) {
                await fs.promises.unlink(newOptimizeImgPath);
            }
        } catch (err) {
            console.error("Error deleting file:", err);
        }
    
    } catch (error) {
        console.log(
            `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`
        );
        throw error;
    }finally{
        await redis.del(lockKey);
    }
},{
    connection: redis
}).on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
}).on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
})

const delBlogImageWorker = new Worker("del-blog-img-processing",async(job)=>{
    console.log("Delete blog image worker job received!!")

    const {coverImageKey} = job.data

    try {

        await s3.send(
            new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: coverImageKey
            })
        )

        console.log("Blog image was deleted successfully from s3 server")
    } catch (error) {
        console.log(
            `Attempt ${job.attemptsMade + 1} of ${job.opts.attempts}`
        );
    }

},{
    connection: redis
}).on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
}).on("failed", (job, err) => {
    console.log(`Job ${job.id} failed:`, err.message);
})