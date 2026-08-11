import redis from "../config/redis.js";
import {countBlogLiked } from "../repository/like.repository.js";

const incrementLikeCount = async(blogId)=>{
    const key = `blog:${blogId}:likes`;

    const isKeyExists = await redis.exists(key);

    if(!isKeyExists){
        const count = await countBlogLiked({blogId});

        await redis.set(key,count);
    }

    return await redis.incr(key);
}

const decrementLikeCount = async(blogId)=>{
    const key = `blog:${blogId}:likes`;

    const isKeyExists = await redis.exists(key);

    if(!isKeyExists){
        const count = await countBlogLiked({blogId});

        await redis.set(key,count);
    }

    return await redis.decr(key);
}

const getLikeCount = async(blogId)=>{
    const key = `blog:${blogId}:likes`;

    const isKeyExists = await redis.exists(key);

    if(!isKeyExists){
        const count = await countBlogLiked({blogId});

        await redis.set(key,count);

        return count;
    }

    return Number(await redis.get(key));
}


export {
    incrementLikeCount,
    decrementLikeCount,
    getLikeCount
}