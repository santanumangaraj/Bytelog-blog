import like from "../models/like.js";
import db from "../models/index.js";


const Like = db.like;

const findBlogLikeByPk = async(data)=>{
    return await Like.findByPk(data)
}

const findOneBlogLike = async(data)=>{
    return await Like.findOne({
        where:data
    })
}

const createBlogLike = async(data)=>{
    return await Like.create(data)
}

const destoryBlogLike = async(data)=>{
    return await Like.destroy({
        where:data
    });
}

const countBlogLiked = async(likeId)=>{
    return await Like.count({
        where:likeId
    })
}

export {
    findBlogLikeByPk,
    findOneBlogLike,
    createBlogLike,
    countBlogLiked,
    destoryBlogLike
}