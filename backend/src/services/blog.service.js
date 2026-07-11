import { Model, Op } from "sequelize"
import { blogImageUploadQueue, delBlogImgQueue } from "../queues/blog.queue.js"
import { createBlog, deleteBlogs, findAndCountAllBlogs, findBlogByPk, findOneBlog, updateBlog } from "../repository/blog.repository.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateExcerpt } from "../utils/excerpt.utils.js"
import createUniqueSlug from "../utils/slug.utils.js"
import { createCacheData, deleteCache, getCacheData } from "./redisCache.js"
import { acquireLock } from "../cache/redisLock.js"
import { cacheAside } from "../cache/cacheAside.js"
import {  cacheKey } from "../cache/cacheKey.js"



const publishBlog = async(userId,{title,content,status},{image})=>{

        if(!title || !content){
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

        const lockKey = cacheKey.blogImageLock(blog.id)

        if(!lockKey){
            throw new ApiError(409,'Image processing is already in progress.')
        }

        await deleteCache("cache:blogs:*")
        
        await blogImageUploadQueue.add("blog-image-process",{
            blogId:blog.id,
            filePath: image[0].path,
            fileName: image[0].originalname,
        },
        {
            attempts: 5,
            jobId:`blog-image-${blog.id}`,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        })

        return blog
}

const getBlogById = async ({blogId})=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const blog = await findBlogByPk(blogId)

    return blog;
}

const getAllBlogs =async ({page=1,limit=10, query,sortBy="createdAt",sortType="desc"})=>{

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum-1) * limitNum;

    const filters = {page,limit, query,sortBy,sortType}

    return await cacheAside({
        key: cacheKey.getAllBlogs(filters),
        ttl: 60,
        loader: async ()=>{
            const where = {};
        
            if(query){
                where[Op.or] = [
                    {
                        title:{
                            [Op.like]: `%${query}%`
                        },
                    },
                    {
                        slug:{
                            [Op.like]: `%${query}%`
                        },
                    },
                    {
                        "$authorDetails.fullName$": {
                            [Op.like]: `%${query}%`,
                        },
                    },
                ]
            }
        
            const allowedSortFields = ["createdAt", "title","views","publishedAt"];
            const order = [];
        
            if (allowedSortFields.includes(sortBy)) {
                order.push([
                    sortBy,
                    sortType.toLowerCase() === "asc" ? "asc" : "desc",
                ]);
            } else {
                order.push(["createdAt", "DESC"]);
            }

            const include = [{
                association:"authorDetails",
                attributes: ["id","username","fullName","email","avatar",]
            }]

        
            const {rows,count } = await findAndCountAllBlogs({
                where,
                include,
                order,
                offset,
                limit: limitNum,
            });
        
        
            const AllBlogsdata = { 
                    rows,
                    pagination: {
                        totalBlogs: count,
                        currentPage: pageNum,
                        totalPages: Math.ceil(count / limitNum),
                        limit: limitNum,
                    }
                }

            return AllBlogsdata
        }    
    })    

}

const deleteABlog = async ({blogId},userId)=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const getBlog = await findBlogByPk(blogId)

    if(!getBlog){
        throw new ApiError(404,"Blog not found!!")
    }

    if(getBlog.author !== userId){
        throw new ApiError(401,"Unauthorized to delete this blog")
    }

    await deleteBlogs(getBlog);

    await deleteCache("cache:blogs:*")

    await delBlogImgQueue.add("del-blog-img-process",{
            coverImageKey:getBlog.coverImageKey
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

    

    if(!getBlog){
        throw new ApiError(500,"Something went wrong while deleting the blog!!")
    }

    return getBlog
}

const getBlogBySlug = async({slug})=>{
    if(!slug){
        throw new ApiError(400,"Slug is required")
    }

    return await cacheAside({
        key: cacheKey.getBlogBySlug(slug),
        ttl:60 * 5,
        loader:async()=>{

            const getBlog = await findOneBlog({slug,status:"published"})

            if(!getBlog){
                throw new ApiError(404,"Blog not found!!")
            }

            return getBlog
        }
    })
}

const getUserBlogs = async(userId,{page,limit, query,sortBy="createdAt",sortType="desc"})=>{

    if(!userId){
        throw new ApiError(400,"userid is required")
    }

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum-1) * limitNum;

    const where ={}

    if(query){
        where.title={
            [Op.like]:`%${query}%`
        } 
    }

    where.author = userId
        
    const allowedSortFields = ["createdAt", "title","views","publishedAt"];
    const order = [];
        
    if (allowedSortFields.includes(sortBy)) {
        order.push([
            sortBy,
            sortType.toLowerCase() === "asc" ? "asc" : "desc",
        ]);
    } else {
        order.push(["createdAt", "DESC"]);
    }


    const {rows,count } = await findAndCountAllBlogs({
        where,
        order,
        offset,
        limit: limitNum,
    });
        
    const AllUsersBlogsdata = { 
        rows,
        pagination: {
            totalBlogs: count,
            currentPage: pageNum,
            totalPages: Math.ceil(count / limitNum),
            limit: limitNum,
        }
    }
    return AllUsersBlogsdata
}

const updateABlog = async({blogId},{title,content,excerpt},userId)=>{

    if (!blogId) {
        throw new ApiError(400, "Blog id is required")
    }

    if (!title && !excerpt && !content) {
        throw new ApiError(400, "At least one field is required")
    }

    const isOwner = await findOneBlog({author:userId})

    if(!isOwner){
        throw new ApiError(401,"Unauthorized access!! Blog can be update by author only")
    }


    await updateBlog(isOwner,{
        title,
        excerpt,
        content
    })

    await deleteCache("cache:blogs:*")

    return isOwner
    
}

const toggleBlogStatus =async ({blogId},{status},userId)=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }
    
    const blog = await findBlogByPk(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    if(blog.author !== userId){
        throw new ApiError(401,"Unauthorized access!! Blog status can be update by author only")
    }

    if(blog.status === status){
        return {blog:null,msg:`Blog was already in ${status} mode`}
    }

    const publishedAt = blog.status === "published" ? null : new Date();
    if(blog.status === "published"){

    }

    await updateBlog(blog,{status:status,publishedAt})

    return {blog,msg:"Blog Published status update successfully"}

}

export {
    publishBlog,
    getBlogById,
    getBlogBySlug,
    getAllBlogs,
    deleteABlog,
    getUserBlogs,
    updateABlog,
    toggleBlogStatus
}