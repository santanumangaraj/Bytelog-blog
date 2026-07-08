import { publishBlog } from "../services/blog.service.js"
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


export {
    publish
}