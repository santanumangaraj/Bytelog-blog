import { toggleLikeQueue } from "../queues/like.queue.js"
import { createBlogLike, findBlogLikeByPk, findOneBlogLike } from "../repository/like.repository.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const toggleBlogLike = async(userId ,{blogId})=>{

    if(!blogId || !userId){
        throw new ApiError(400,"Blog id and userId are required")
    }

    await toggleLikeQueue.add("toggle-like-process",{
        blogId:blogId,
        likedBy:userId
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

    return {
        message: "Like request accepted"
    }

}

const toggleBlogUnlike = async(userId ,{blogId})=>{

    if(!blogId || !userId){
        throw new ApiError(400,"Blog id and userId are required")
    }

    await toggleLikeQueue.add("toggle-unlike-process",{
        blogId:blogId,
        likedBy:userId
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

    return {
        message: "Unlike request accepted"
    }

}

export {
    toggleBlogLike,
    toggleBlogUnlike
}