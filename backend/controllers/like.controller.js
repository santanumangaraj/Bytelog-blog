import { toggleBlogLike, toggleBlogUnlike, getBlogLikeCount, getBlogLikeStatus } from "../services/like.service.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleLike = asyncHandler(async(req , res)=>{
    
    const blogLikeMsg = await toggleBlogLike(req.user?.id,req.params)

    if(!blogLikeMsg){
        throw new ApiError(500,"Something went wrong while fetching blogLike from db!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,null,blogLikeMsg)
    )
})

const toggleUnlike = asyncHandler(async(req,res)=>{
    const blogUnlikeMsg = await toggleBlogUnlike(req.user?.id,req.params)

    if(!blogUnlikeMsg){
        throw new ApiError(500,"Something went wrong while fetching blogUnlike msg !!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,null,blogUnlikeMsg)
    )
})

const getLikeCount = asyncHandler(async(req, res)=>{

    const result = await getBlogLikeCount(req.params)

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Like count fetched successfully")
    )
})

const getLikeStatus = asyncHandler(async(req, res)=>{

    const result = await getBlogLikeStatus(req.user?.id, req.params)

    return res
    .status(200)
    .json(
        new ApiResponse(200, result, "Like status fetched successfully")
    )
})

export {
    toggleLike,
    toggleUnlike,
    getLikeCount,
    getLikeStatus
}