import { Model, Op } from "sequelize"
import { blogImageUploadQueue, delBlogImgQueue } from "../queues/blog.queue.js"
import { createBlog, deleteBlogs, findAndCountAllBlogs, findBlogByPk, findBlogsByIds, findOneBlog, incrementBlogViews, updateBlog } from "../repository/blog.repository.js"
import { findBlogIdsByTagSlug, findRelatedBlogIds } from "../repository/tags.repository.js"
import { attachTagsToBlog } from "./tags.service.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateExcerpt } from "../utils/excerpt.utils.js"
import createUniqueSlug from "../utils/slug.utils.js"
import { createCacheData, deleteCache, getCacheData } from "./redisCache.js"
import { acquireLock } from "../cache/redisLock.js"
import { cacheAside } from "../cache/cacheAside.js"
import {  cacheKey } from "../cache/cacheKey.js"

const TAG_ATTRIBUTES = ["id", "name", "slug"]
const tagsInclude = () => ({
    association: "tags",
    attributes: TAG_ATTRIBUTES,
    through: { attributes: [] },
})

// `tag` filter narrows by slug — resolved to concrete blog IDs up front
// (rather than a required belongsToMany include) so it doesn't distort
// findAndCountAll's LIMIT/COUNT when a blog carries more than one tag.
const applyTagFilter = async (where, tag) => {
    if (!tag) return where

    const blogIds = await findBlogIdsByTagSlug(tag)
    return { ...where, id: { [Op.in]: blogIds.length ? blogIds : [-1] } }
}



const publishBlog = async(userId,{title,content,status,tags},{coverImage})=>{

        if(!title || !content){
            throw new ApiError(400,"All fields are required")
        }

        if (!coverImage || !Array.isArray(coverImage) || coverImage.length === 0 || !coverImage[0].path) {
            throw new ApiError(400, "Cover image is required");
        }

        const slug = await createUniqueSlug(title);
        const excerpt =await  generateExcerpt(content);

        const blog = await createBlog({
            title,
            content,
            slug,
            excerpt,
            author:userId
        })

        if(tags?.length){
            await attachTagsToBlog(blog, tags)
        }

        await deleteCache("cache:blogs:*")
        
        await blogImageUploadQueue.add("blog-image-process",{
            blogId: blog.id,
            status: status ?? "draft",
            tempFilePath: coverImage[0].path,
            originalFileName: coverImage[0].originalname,
        },
        {
            attempts: 5,
            jobId: `blog-image-${blog.id}`,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        })

        return blog
}

const getBlogById = async ({blogId})=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const blog = await findBlogByPk(blogId)

    return blog;
}

const getAllBlogs =async ({page=1,limit=10, query,tag,sortBy="createdAt",sortType="desc"})=>{

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum-1) * limitNum;

    const filters = {page,limit, query,tag,sortBy,sortType}

    return await cacheAside({
        key: cacheKey.getAllBlogs(filters),
        ttl: 60,
        loader: async ()=>{
            let where = {
                status: "published",
            };

            where = await applyTagFilter(where, tag)

            if(query){
                where[Op.or] = [
                    {
                        title:{
                            [Op.like]: `%${query}%`
                        },
                    },
                    {
                        slug:{
                            [Op.like]: `%${query}%`
                        },
                    },
                    {
                        "$authorDetails.fullName$": {
                            [Op.like]: `%${query}%`,
                        },
                    },
                ]
            }
        
            const allowedSortFields = ["createdAt", "title","views","publishedAt"];
            const order = [];
        
            if (allowedSortFields.includes(sortBy)) {
                order.push([
                    sortBy,
                    sortType.toLowerCase() === "asc" ? "asc" : "desc",
                ]);
            } else {
                order.push(["createdAt", "DESC"]);
            }

            const include = [{
                association:"authorDetails",
                attributes: ["id","username","fullName","email","avatarImageUrl"]
            }, tagsInclude()]


            const {rows,count } = await findAndCountAllBlogs({
                where,
                include,
                order,
                offset,
                limit: limitNum,
            });
        
        
            const AllBlogsdata = { 
                    rows,
                    pagination: {
                        totalBlogs: count,
                        currentPage: pageNum,
                        totalPages: Math.ceil(count / limitNum),
                        limit: limitNum,
                    }
                }

            return AllBlogsdata
        }    
    })    

}

const deleteABlog = async ({blogId},requester)=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const getBlog = await findBlogByPk(blogId)

    if(!getBlog){
        throw new ApiError(404,"Blog not found!!")
    }

    if(getBlog.author !== requester.id && requester.role === "ADMIN"){
        throw new ApiError(401,"Unauthorized to delete this blog")
    }

    await deleteBlogs(getBlog);

    await deleteCache("cache:blogs:*")

    await delBlogImgQueue.add("del-blog-img-process",{
            coverImageKey:getBlog.coverImageKey
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

    

    if(!getBlog){
        throw new ApiError(500,"Something went wrong while deleting the blog!!")
    }

    return getBlog
}

const getBlogBySlug = async({slug})=>{
    if(!slug){
        throw new ApiError(400,"Slug is required")
    }

    return await cacheAside({
        key: cacheKey.getBlogBySlug(slug),
        ttl:60 * 5,
        loader:async()=>{

            // const getBlog = await findOneBlog({slug,status:"published"})
            const getBlog = await findOneBlog({slug}, [tagsInclude()])

            if(!getBlog){
                throw new ApiError(404,"Blog not found!!")
            }

            return getBlog
        }
    })
}

const RELATED_BLOGS_LIMIT = 3

const getRelatedBlogs = async({blogId})=>{
    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    return await cacheAside({
        key: cacheKey.getRelatedBlogs(blogId),
        ttl: 60 * 5,
        loader: async()=>{

            const blog = await findOneBlog({id:blogId}, [tagsInclude()])

            if(!blog){
                throw new ApiError(404,"Blog not found")
            }

            const tagIds = blog.tags?.map((t)=>t.id) ?? []

            if(!tagIds.length){
                return []
            }

            const relatedBlogIds = await findRelatedBlogIds({
                blogId,
                tagIds,
                limit: RELATED_BLOGS_LIMIT,
            })

            if(!relatedBlogIds.length){
                return []
            }

            const relatedBlogs = await findBlogsByIds({
                ids: relatedBlogIds,
                include: [{
                    association:"authorDetails",
                    attributes: ["id","username","fullName","email","avatarImageUrl"]
                }, tagsInclude()],
            })

            // findBlogsByIds' IN-clause doesn't preserve order — re-sort by the
            // shared-tag-count ranking findRelatedBlogIds already computed.
            const rankById = new Map(relatedBlogIds.map((id,i)=>[id,i]))
            return relatedBlogs.sort((a,b)=>rankById.get(a.id) - rankById.get(b.id))
        }
    })
}

const getUserBlogs = async(userId,{page=1,limit=10, query,tag,sortBy="createdAt",sortType="desc"})=>{

    if(!userId){
        throw new ApiError(400,"userid is required")
    }

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum-1) * limitNum;

    let where ={}

    if(query){
        where.title={
            [Op.like]:`%${query}%`
        }
    }

    where.author = userId

    where = await applyTagFilter(where, tag)

    const allowedSortFields = ["createdAt", "title","views","publishedAt"];
    const order = [];

    if (allowedSortFields.includes(sortBy)) {
        order.push([
            sortBy,
            sortType.toLowerCase() === "asc" ? "asc" : "desc",
        ]);
    } else {
        order.push(["createdAt", "DESC"]);
    }


    const {rows,count } = await findAndCountAllBlogs({
        where,
        include: [tagsInclude()],
        order,
        offset,
        limit: limitNum,
    });
        
    const AllUsersBlogsdata = { 
        rows,
        pagination: {
            totalBlogs: count,
            currentPage: pageNum,
            totalPages: Math.ceil(count / limitNum),
            limit: limitNum,
        }
    }
    return AllUsersBlogsdata
}

const updateABlog = async({blogId},{title,content,excerpt,tags},userId,files)=>{

    if (!blogId) {
        throw new ApiError(400, "Blog id is required")
    }

    if (!title && !excerpt && !content && tags === undefined) {
        throw new ApiError(400, "At least one field is required")
    }

    const targetBlog = await findBlogByPk(blogId)

    if(!targetBlog){
        throw new ApiError(404, "Blog not found!!")
    }

    if(targetBlog.author !== userId){
        throw new ApiError(403, "Unauthorized access!! Blog can be updated by author only")
    }

    await updateBlog(targetBlog, {
        title,
        excerpt,
        content
    })

    if(tags !== undefined){
        await attachTagsToBlog(targetBlog, tags)
    }

    const coverImage = files?.coverImage

    if (coverImage && Array.isArray(coverImage) && coverImage.length > 0 && coverImage[0].path) {
        await blogImageUploadQueue.add("blog-image-update-process", {
            blogId: targetBlog.id,
            oldCoverImageKey: targetBlog.coverImageKey,
            tempFilePath: coverImage[0].path,
            originalFileName: coverImage[0].originalname,
        },
        {
            attempts: 5,
            jobId: `blog-image-update-${targetBlog.id}`,
            backoff: {
                type: "exponential",
                delay: 5000
            },
            removeOnComplete: true,
            removeOnFail: false
        })
    }

    await deleteCache("cache:blogs:*")

    return targetBlog
}

const toggleBlogStatus =async ({blogId},{status},userId)=>{

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }
    
    const blog = await findBlogByPk(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    if(blog.author !== userId){
        throw new ApiError(401,"Unauthorized access!! Blog status can be update by author only")
    }

    if(blog.status === status){
        return {blog:null,msg:`Blog was already in ${status} mode`}
    }

    const publishedAt = blog.status === "published" ? null : new Date();
    if(blog.status === "published"){

    }

    await updateBlog(blog,{status:status,publishedAt})

    return {blog,msg:"Blog Published status update successfully"}

}

const incrementBlogView = async({blogId})=>{
    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    await incrementBlogViews({blogId});

    
    const blog = await findBlogByPk(blogId)
    
    if(!blog){
        throw new ApiError(404,"Blog not found")
    }
    
    await deleteCache(cacheKey.getBlogBySlug(blog.slug))
    
    return {viewCount:blog.views}
}

export {
    publishBlog,
    getBlogById,
    getBlogBySlug,
    getAllBlogs,
    deleteABlog,
    getUserBlogs,
    updateABlog,
    toggleBlogStatus,
    incrementBlogView,
    getRelatedBlogs
}