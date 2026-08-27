import { Op } from "sequelize"
import { findAndCountAllBlogs } from "../repository/blog.repository.js"
import {
    countBlogsByStatus,
    findDistinctAuthorNames,
    findAndCountAllUsers,
    countBlogsPerAuthor,
    countLikesPerBlog,
    countUserStats,
} from "../repository/admin.repository.js"

const getAdminBlogsList = async ({ page = 1, limit = 8, query, status = "all", author = "all", sort = "newest" }) => {

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum - 1) * limitNum

    const where = {}

    if (status !== "all") {
        where.status = status
    }

    if (author !== "all") {
        where["$authorDetails.fullName$"] = author
    }

    if (query) {
        where[Op.or] = [
            { title: { [Op.like]: `%${query}%` } },
            { "$authorDetails.fullName$": { [Op.like]: `%${query}%` } },
        ]
    }

    const order = [["createdAt", sort === "oldest" ? "ASC" : "DESC"]]

    const include = [{
        association: "authorDetails",
        attributes: ["id", "username", "fullName", "email", "avatarImageUrl"],
    }]

    const [{ rows, count }, stats, authors] = await Promise.all([
        findAndCountAllBlogs({ where, include, order, offset, limit: limitNum }),
        countBlogsByStatus(),
        findDistinctAuthorNames(),
    ])

    const likeCounts = await countLikesPerBlog(rows.map((b) => b.id))

    const mappedRows = rows.map((b) => ({
        id: b.id,
        title: b.title,
        slug: b.slug,
        author: b.authorDetails?.fullName ?? "Unknown",
        status: b.status,
        views: b.views,
        likes: likeCounts.get(b.id) ?? 0,
        coverImageUrl: b.coverImageUrl,
        createdAt: b.createdAt,
    }))

    return {
        rows: mappedRows,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalItems: count,
            totalPages: Math.ceil(count / limitNum) || 1,
        },
        stats,
        authors,
    }
}

// The `user` model has no `status` column yet (only `role`,
// `failedLoginAttempts`, `lockUntil`) — there's no real suspend/reactivate
// feature on the backend. Every account is reported "active" until that's
// built; filtering to "suspended" always returns zero rows rather than
// silently ignoring the filter.
const getAdminUsersList = async ({ page = 1, limit = 8, query, role = "all", status = "all", sort = "newest" }) => {

    const pageNum = Number(page)
    const limitNum = Number(limit)
    const offset = (pageNum - 1) * limitNum

    if (status === "suspended") {
        const { total, admins } = await countUserStats()
        return {
            rows: [],
            pagination: { page: pageNum, limit: limitNum, totalItems: 0, totalPages: 1 },
            stats: { total, admins, active: total, suspended: 0 },
        }
    }

    const where = {}

    if (role !== "all") {
        where.role = role
    }

    if (query) {
        where[Op.or] = [
            { username: { [Op.like]: `%${query}%` } },
            { fullName: { [Op.like]: `%${query}%` } },
            { email: { [Op.like]: `%${query}%` } },
        ]
    }

    const order = [["createdAt", sort === "oldest" ? "ASC" : "DESC"]]

    const [{ rows, count }, statsBase] = await Promise.all([
        findAndCountAllUsers({ where, order, offset, limit: limitNum }),
        countUserStats(),
    ])

    const blogCounts = await countBlogsPerAuthor(rows.map((u) => u.id))

    const mappedRows = rows.map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        avatarUrl: u.avatarImageUrl,
        role: u.role,
        status: "active",
        blogsCount: blogCounts.get(u.id) ?? 0,
        joinedAt: u.createdAt,
    }))

    return {
        rows: mappedRows,
        pagination: {
            page: pageNum,
            limit: limitNum,
            totalItems: count,
            totalPages: Math.ceil(count / limitNum) || 1,
        },
        stats: { ...statsBase, active: statsBase.total, suspended: 0 },
    }
}

export {
    getAdminBlogsList,
    getAdminUsersList,
}
