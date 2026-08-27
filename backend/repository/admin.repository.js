import db from "../models/index.js";

const User = db.user;
const Blog = db.blog;
const Like = db.like;

const countBlogsByStatus = async () => {
    const [total, published, draft, archived] = await Promise.all([
        Blog.count(),
        Blog.count({ where: { status: "published" } }),
        Blog.count({ where: { status: "draft" } }),
        Blog.count({ where: { status: "archived" } }),
    ])
    return { total, published, draft, archived }
}

// Two simple, self-contained queries (distinct author ids, then those
// users' names) rather than one combined GROUP BY — same "resolve ids
// first, then fetch records" idiom already used for related blogs
// (tags.repository.js#findRelatedBlogIds), avoids guessing what alias
// Sequelize would generate for a raw correlated subquery.
const findDistinctAuthorNames = async () => {
    const rows = await Blog.findAll({
        attributes: [[db.sequelize.fn("DISTINCT", db.sequelize.col("author")), "author"]],
        raw: true,
    })

    const authorIds = rows.map((r) => r.author).filter(Boolean)
    if (!authorIds.length) return []

    const authors = await User.findAll({
        where: { id: authorIds },
        attributes: ["fullName"],
        order: [["fullName", "ASC"]],
        raw: true,
    })
    return authors.map((a) => a.fullName)
}

const findAndCountAllUsers = async ({ where, order, offset, limit }) => {
    return await User.findAndCountAll({ where, order, offset, limit })
}

const countBlogsPerAuthor = async (userIds) => {
    if (!userIds.length) return new Map()

    const rows = await Blog.findAll({
        where: { author: userIds },
        attributes: ["author", [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"]],
        group: ["author"],
        raw: true,
    })
    return new Map(rows.map((r) => [r.author, Number(r.count)]))
}

const countLikesPerBlog = async (blogIds) => {
    if (!blogIds.length) return new Map()

    const rows = await Like.findAll({
        where: { blogId: blogIds },
        attributes: ["blogId", [db.sequelize.fn("COUNT", db.sequelize.col("id")), "count"]],
        group: ["blogId"],
        raw: true,
    })
    return new Map(rows.map((r) => [r.blogId, Number(r.count)]))
}

const countUserStats = async () => {
    const [total, admins] = await Promise.all([
        User.count(),
        User.count({ where: { role: "ADMIN" } }),
    ])
    return { total, admins }
}

export {
    countBlogsByStatus,
    findDistinctAuthorNames,
    findAndCountAllUsers,
    countBlogsPerAuthor,
    countLikesPerBlog,
    countUserStats,
}
