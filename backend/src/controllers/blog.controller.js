import { deleteABlog, getAllBlogs, getBlogById, publishBlog } from "../services/blog.service.js"
import { completeRequest, deleteRequest } from "../services/idempotency.service.js"
import {ApiError} from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const publish = asyncHandler(async(req , res)=>{

    try {
        const newBlog = await publishBlog(req.user?.id,req.body,req.files)
    
        if(!newBlog){
            throw new ApiError(500,"Something went wrong while uploading the blog!!")
        }
    
        const response = new ApiResponse(
            201,
            newBlog,
            "Blog published successfully"
        );
    
        await completeRequest(
            req.idempotencyKey,
            {
                statusCode: 201,
                body: response
            }
        )
    
        return res
        .status(202)
        .json(
            response
        )
    } catch (error) {
        await deleteRequest(req.idempotencyKey);
        throw error;
    }
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

const delBlog = asyncHandler(async (req,res)=>{
    
    const deletedBlog = await deleteABlog(req.params,req.user?.id)

    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedBlog,"Blog deleted successfully")
    )
})

export {
    publish,
    getBlog,
    fetchedAllBlogs,
    delBlog
}