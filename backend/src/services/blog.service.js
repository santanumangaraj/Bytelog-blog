import { blogImageUploadQueue } from "../queues/blog.queue.js"
import { createBlog, findOneBlog } from "../repository/blog.repository.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { generateExcerpt } from "../utils/excerpt.utils.js"
import createUniqueSlug from "../utils/slug.utils.js"



const publishBlog = async(userId,{title,content,status},{image})=>{

        if(!title || status || !content){
            throw new ApiError(400,"All fields are required")
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
        
        await blogImageUploadQueue.add("blog-image-process",{
            blogId:blog.id,
            filePath: image[0].path,
            fileName: image[0].originalname,
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

        return blog
}

/*
const getBlogById = asyncHandler(async (req, res)=>{
    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const blog = await Blog.findById(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,blog,"Blog fetched successfully")
    )
})

const getAllBlogs = asyncHandler(async (req, res)=>{
    const {page=1,limit=10, query,sortBy,sortType,author} = req.query

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum-1) * limitNum;

    const filter = {};

    if(query){
        filter.$or=[
            {title: {$regex:query,$options: "i"}},
            {content: {$regex:query,$options: "i"}}
        ];
    }

    if(author){
        filter.author = author
    }

    const allowedSortFields = ["createdAt", "title"];
    const sortOptions = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
        sortOptions[sortBy] = sortType === "asc" ? 1 : -1;
    } else {
        sortOptions.createdAt = -1;
    }

    const blogs = await Blog.find(filter)
    .populate("author", "fullName")
    .sort(sortOptions)
    .skip(skip)
    .limit(limitNum)

    const totalBlogs = await Blog.countDocuments(filter);

    return res
    .status(200)
    .json(
        new ApiResponse(200,{
            totalBlogs,
            currentPage: pageNum,
            totalPages : Math.ceil((totalBlogs/ limitNum)),
            blogs
        },
        !blogs?.length? "No blogs found!!":"blogs loaded successfully"
        )
    )
})

const updateBlogDetails = asyncHandler(async (req, res) => {
    const { blogId } = req.params
    let { title, tags } = req.body

    if (!blogId) {
        throw new ApiError(400, "Blog id is required")
    }

    if (!title && !tags) {
        throw new ApiError(400, "At least one field is required")
    }

    if (typeof tags === "string") {
        tags = JSON.parse(tags)
    }
        
    const isOwner = await Blog.findOne({author:req.user?._id})

    if(!isOwner){
        throw new ApiError(401,"Unauthorized access!! Blog can be update by author only")
    }

    const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
            $set: {
                ...(title && { title }),
                ...(tags && { tags })
            }
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponse(200, blog, "Blog details updated successfully")
    )
})

const deleteABlog = asyncHandler(async (req, res)=>{
    const {blogId} = req.params

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }

    const deletedBlog = await Blog.findByIdAndDelete(blogId,)

    if(!deletedBlog){
        throw new ApiError(500,"Something went wrong while deleting the blog!!")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,deleteABlog,"Blog deleted successfully")
    )
})

const togglePublishBlogStatus = asyncHandler(async (req, res)=>{
    const {blogId} = req.params
    const {status} = req.body

    if(!blogId){
        throw new ApiError(400,"Blog id is required")
    }
    
    const blog = await Blog.findById(blogId)

    if(!blog){
        throw new ApiError(404,"Blog not found")
    }

    blog.status = status
    blog.isPublished = status === "published" ? true:false;
    await blog.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200,blog,"Video Published status update successfully")
    )
})
*/

export {
    publishBlog
}