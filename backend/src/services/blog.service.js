import { blogImageUploadQueue } from "../queues/blog.queue.js"
import { createBlog, findOneBlog } from "../repository/blog.repository.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateExcerpt } from "../utils/excerpt.utils.js"
import createUniqueSlug from "../utils/slug.utils.js"



const publishBlog = async(userId,{title,content,status},{image})=>{

        if(!title || status || !content){
            throw new ApiError(400,"All fields are required")
        }

        const slug = await createUniqueSlug(title);
        const excerpt =await  generateExcerpt(content);
        
        const blog = await createBlog({
            title,
            content,
            slug,
            excerpt,
            author:userId
        })
        
        await blogImageUploadQueue.add("blog-image-process",{
            blogId:blog.id,
            filePath: image[0].path,
            fileName: image[0].originalname,
            mimetype:image[0].mimetype,
            status:status
        },
        {
            attempts: 5,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        })

        return blog
}


export {
    publishBlog
}