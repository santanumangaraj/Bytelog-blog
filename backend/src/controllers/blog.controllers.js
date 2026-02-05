import { Blog } from "../models/blog.model.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary} from "../utils/cloudinary.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { json } from "express";


const publishABlog = asyncHandler(async (req , res)=>{
    let {title,tags,content} = req.body

    tags = JSON.parse(tags)
    if(!(title && tags && content)){
        throw new ApiError(400,"All fields are required")
    }

    const existedBlog = await Blog.findOne({title:title})

    if(existedBlog){
        throw new ApiError(409,"Blog with title already exists")
    }

    const imageLocalPath = req.file?.path 
    const image=imageLocalPath?await uploadOnCloudinary(imageLocalPath):null;

    const blog = await Blog.create({
        title,
        tags,
        content,
        image:image.url,
        author:req.user?._id
    })

    if(!blog){
        throw new ApiError(500,"Something went wrong while uploading the blog!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(201,blog,"Blog upload successfully")
    )
})

const getBlogById = asyncHandler(async (req, res)=>{
    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const blog = await Blog.findById(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,blog,"Blog fetched successfully")
    )
})

const getAllBlogs = asyncHandler(async (req, res)=>{
    const {page=1,limit=10, query,sortBy,sortType,author} = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum-1) * limitNum;

    const filter = {};

    if(query){
        filter.$or=[
            {title: {$regex:query,$options: "i"}},
            {content: {$regex:query,$options: "i"}}
        ];
    }

    if(author){
        filter.author = author
    }

    const allowedSortFields = ["createdAt", "title"];
    const sortOptions = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sortOptions.createdAt = -1;
    }

    const blogs = await Blog.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)

    const totalBlogs = await Blog.countDocuments(filter);

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            totalBlogs,
            currentPage: pageNum,
            totalPages : Math.ceil((totalBlogs/ limitNum)),
            blogs
        },
        !blogs?.length? "No blogs found!!":"blogs loaded successfully"
        )
    )
})

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

export {
    publishABlog,
    getBlogById,
    getAllBlogs,
    updateBlogDetails,
    deleteABlog,
    togglePublishBlogStatus
} 