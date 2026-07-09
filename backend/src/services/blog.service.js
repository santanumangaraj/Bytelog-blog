import { Op } from "sequelize"
import { blogImageUploadQueue } from "../queues/blog.queue.js"
import { createBlog, findAndCountAllBlogs, findBlogByPk, findOneBlog } from "../repository/blog.repository.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateExcerpt } from "../utils/excerpt.utils.js"
import createUniqueSlug from "../utils/slug.utils.js"
import { createCacheData, getCacheData } from "./redisBlog.service.js"



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

const getBlogById = async ({blogId})=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const blog = await findBlogByPk(blogId)

    return blog;
}

const getAllBlogs =async ({page=1,limit=10, query,sortBy="createdAt",sortType="desc",author})=>{

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum-1) * limitNum;

    const cacheKey = `cache:blogs:${page}:${limit}:${query || ""}:${sortBy || ""}:${sortType || ""}:${author || ""}`;

    const cachedData = await getCacheData(cacheKey)

    if(cachedData){
        console.log("Blogs fetched from cache!!")
        return cachedData
    }

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
        ]
    }

    if(author){
        where.author = author
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

    const {rows,count } = await findAndCountAllBlogs({
        where,
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


    const setCacheData = await createCacheData(cacheKey,AllBlogsdata,60)

    console.log("Blogs fetched from Db!!")

    return AllBlogsdata

}

/*
const updateBlogDetails = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    let { title, tags } = req.body

    if (!blogId) {
        throw new ApiError(400, "Blog id is required")
    }

    if (!title && !tags) {
        throw new ApiError(400, "At least one field is required")
    }

    if (typeof tags === "string") {
        tags = JSON.parse(tags)
    }
        
    const isOwner = await Blog.findOne({author:req.user?._id})

    if(!isOwner){
        throw new ApiError(401,"Unauthorized access!! Blog can be update by author only")
    }

    const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: {
                ...(title && { title }),
                ...(tags && { tags })
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, blog, "Blog details updated successfully")
    )
})

const deleteABlog = asyncHandler(async (req, res)=>{
    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId,)

    if(!deletedBlog){
        throw new ApiError(500,"Something went wrong while deleting the blog!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,deleteABlog,"Blog deleted successfully")
    )
})

const togglePublishBlogStatus = asyncHandler(async (req, res)=>{
    const {blogId} = req.params
    const {status} = req.body

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }
    
    const blog = await Blog.findById(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    blog.status = status
    blog.isPublished = status === "published" ? true:false;
    await blog.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,blog,"Video Published status update successfully")
    )
})
*/

export {
    publishBlog,
    getBlogById,
    getAllBlogs
}