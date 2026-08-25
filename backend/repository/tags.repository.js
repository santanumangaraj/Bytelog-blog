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
    findBlogIdsByTagSlug
}
