import { toggleLikeQueue } from "../queues/like.queue.js"
import { findOneBlogLike } from "../repository/like.repository.js"
import { getLikeCount } from "./redisLike.service.js"
import { ApiError } from "../utils/ApiError.js"


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

const getBlogLikeCount = async({blogId})=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const count = await getLikeCount(blogId)

    return {
        count
    }

}

const getBlogLikeStatus = async(userId,{blogId})=>{

    if(!blogId || !userId){
        throw new ApiError(400,"Blog id and userId are required")
    }

    const existingLike = await findOneBlogLike({blogId,likedBy:userId})

    return {
        liked: Boolean(existingLike)
    }

}

export {
    toggleBlogLike,
    toggleBlogUnlike,
    getBlogLikeCount,
    getBlogLikeStatus
}
