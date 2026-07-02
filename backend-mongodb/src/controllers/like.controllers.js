import { Blog } from "../models/blog.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const toggleBlogLike = asyncHandler(async (req, res)=>{
    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const verifyBlogId = await Blog.findById(blogId)

    const existingBlogLike = await Like.findOne({
        blog:blogId,
        likedBy:req.user?._id
    })

    let modifyBlogLikeDetails,msg;
    
    if(!existingBlogLike && verifyBlogId!==null){
        modifyBlogLikeDetails = await Like.create(
            {
                blog:blogId,
                likedBy:req.user?._id
            },
        )
        msg="Blog liked Successfully"
    }else if(existingBlogLike){
        modifyBlogLikeDetails = await Like.findByIdAndDelete(existingBlogLike._id)
        msg = "Blog unliked Successfully"
    }else{
        modifyBlogLikeDetails = null
        msg = "Blog not found"
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,modifyBlogLikeDetails,msg)
    )
})

const getBlogLikeCount = asyncHandler(async (req,res)=>{

    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const likedCount = await Like.countDocuments({blog:blogId})

    return res
    .status(200)
    .json(
        new ApiResponse(200,{likedCount},"Blog likes fetched successfully")
    )
})
export {
    toggleBlogLike,
    getBlogLikeCount
}