import db from "../models/index.js";

const Tags = db.tags;

const findOneTag = async (data) => {
    return await Tags.findOne({
        where: data
    })
}

const createTag = async (data) => {
    return await Tags.create(data)
}

const findAllTags = async () => {
    return await Tags.findAll({
        attributes: {
            include: [
                [
                    db.sequelize.literal(
                        "(SELECT COUNT(*) FROM `blogTags` AS bt WHERE bt.tagId = `tags`.`id`)"
                    ),
                    "blogCount",
                ],
            ],
        },
        order: [["name", "ASC"]],
    })
}

const findTagsBySlugs = async (slugs) => {
    return await Tags.findAll({
        where: { slug: slugs }
    })
}

// Ranks other published blogs by how many tags they share with `tagIds`,
// most-shared first. Raw SQL over the plain join table (rather than a
// Sequelize include + GROUP BY across blogs/authorDetails columns) keeps
// this out of MySQL's ONLY_FULL_GROUP_BY territory — grouping stays
// confined to blogId, nothing else needs to be functionally dependent on it.
const findRelatedBlogIds = async ({ blogId, tagIds, limit = 3 }) => {
    if (!tagIds.length) return []

    const rows = await db.sequelize.query(
        `SELECT bt.blogId AS blogId, COUNT(*) AS sharedCount
         FROM \`blogTags\` bt
         INNER JOIN \`blogs\` b ON b.id = bt.blogId
         WHERE bt.tagId IN (:tagIds)
           AND bt.blogId != :blogId
           AND b.status = 'published'
           AND b.deletedAt IS NULL
         GROUP BY bt.blogId
         ORDER BY sharedCount DESC
         LIMIT :limit`,
        {
            replacements: { tagIds, blogId, limit },
            type: db.Sequelize.QueryTypes.SELECT,
        }
    )

    return rows.map((r) => r.blogId)
}

const findBlogIdsByTagSlug = async (slug) => {
    const tag = await Tags.findOne({
        where: { slug },
        include: [
            {
                association: "blogs",
                attributes: ["id"],
                through: { attributes: [] },
            },
        ],
    })

    return tag ? tag.blogs.map((b) => b.id) : []
}

export {
    findOneTag,
    createTag,
    findAllTags,
    findTagsBySlugs,
    findBlogIdsByTagSlug,
    findRelatedBlogIds
}
