import { Blog } from "../models/blog.model.js";
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary} from "../utils/cloudinary.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { json } from "express";


const publishABlog = asyncHandler(async (req , res)=>{
    let {title,tags,content} = req.body
    console.log(req.body)

    tags = JSON.parse(tags)
    if(!(title && tags && content)){
        throw new ApiError(400,"All fields are required")
    }

    console.log(`title:${title}\n tags:${tags} \n content:${content}`)
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



export {publishABlog}