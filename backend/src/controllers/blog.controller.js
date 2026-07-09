import { getAllBlogs, getBlogById, publishBlog } from "../services/blog.service.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const publish = asyncHandler(async(req , res)=>{


    const newBlog = await publishBlog(req.user?.id,req.body,req.files)


    if(!newBlog){
        throw new ApiError(500,"Something went wrong while uploading the blog!!")
    }

    return res
    .status(202)
    .json(
        new ApiResponse(202,
            newBlog,
            "Blog accepted for processing.")
    )
})

const getBlog = asyncHandler(async (req, res)=>{

    const blog = await getBlogById(req.params)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,blog,"Blog fetched successfully")
    )
})

const fetchedAllBlogs = asyncHandler(async(req,res)=>{

    const {rows,pagination} = await getAllBlogs(req.query)

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            pagination,
            blogs: rows
        },
        !rows?.length? "No blogs found!!":"blogs loaded successfully"
        )
    )
})
export {
    publish,
    getBlog,
    fetchedAllBlogs
}