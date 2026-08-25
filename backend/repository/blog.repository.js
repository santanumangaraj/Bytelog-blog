import blog from "../models/blog.js";
import db from "../models/index.js";

const Blog = db.blog;

const findOneBlog = async(data,include=[])=>{
    const query = { where:data }
    if(include.length){
        query.include = include
    }
    return await Blog.findOne(query)
}

const createBlog = async(data)=>{
    return await Blog.create(data)
}

const findBlogByPk = async(blogId)=>{
    return await Blog.findByPk(blogId)
}

const updateBlog = async(blog,data)=>{
    return await blog.update(data)
}

const deleteBlogs = async(blogDb)=>{
    return await blogDb.destroy();
}

const findAndCountAllBlogs = async({
                where,
                include=[],
                order,
                offset,
                limit: limitNum,
            })=>{


        const query ={
                where,
                order,
                offset,
                limit: limitNum,
            }
            if(include.length){
                query.include = include
                // With a belongsToMany include (tags), a plain COUNT(*) double-counts
                // any blog that has more than one tag — distinct + the PK dedupes it.
                query.distinct = true
                query.col = "id"
            }
    return await Blog.findAndCountAll(query)
}
export {
    findOneBlog,
    findBlogByPk,
    updateBlog,
    createBlog,
    findAndCountAllBlogs,
    deleteBlogs
}