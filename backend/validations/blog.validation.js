import Joi from "joi";

const publishSchema = Joi.object({
    title: Joi.string()
        .trim()
        .min(5)
        .max(200)
        .required(),

    content: Joi.string()
        .trim()
        .min(50)
        .required(),

    status: Joi.string()
        .valid("draft", "published", "archived")
        .default("draft"),

    tags: Joi.array()
        .items(Joi.string().trim().min(2).max(30))
        .max(5)
        .optional(),
})

const getBlogByIdSchema = Joi.object({
    blogId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "Invalid blog ID format"
        })
})

const updateBlogBodySchema = Joi.object({
    title: Joi.string().trim().min(5).max(200).optional(),
    content: Joi.string().trim().min(50).optional(),
    excerpt: Joi.string().trim().min(10).max(300).optional(),
    tags: Joi.array()
        .items(Joi.string().trim().min(2).max(30))
        .max(5)
        .optional(),
}).or("title", "content", "excerpt", "tags");

const toggleStatusBodySchema = Joi.object({
    status: Joi.string().valid("draft", "published", "archived").required()
});

const getBlogBySlugSchema = Joi.object({
    slug: Joi.string().trim().min(5).required()
})

const getAllUserBlogsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),

    query: Joi.string()
        .trim()
        .allow("")
        .optional(),

    tag: Joi.string()
        .trim()
        .lowercase()
        .allow("")
        .optional(),

    sortBy: Joi.string()
        .trim()
        .valid(
        "createdAt",
        "updatedAt",
        "publishedAt",
        "title",
        "views"
        )
        .default("createdAt"),

    sortType: Joi.string()
        .trim()
        .valid("asc", "desc")
        .insensitive()
        .default("desc"),
});

const getAllBlogsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(10),

    query: Joi.string()
        .trim()
        .allow("")
        .optional(),

    tag: Joi.string()
        .trim()
        .lowercase()
        .allow("")
        .optional(),

    sortBy: Joi.string()
        .trim()
        .valid(
        "createdAt",
        "updatedAt",
        "publishedAt",
        "title",
        "views"
        )
        .default("createdAt"),

    sortType: Joi.string()
        .trim()
        .valid("asc", "desc")
        .insensitive()
        .default("desc"),
});

const deleteBlogSchema = getBlogByIdSchema;

export {
    publishSchema,
    getAllBlogsSchema,
    getAllUserBlogsSchema,
    getBlogByIdSchema,
    getBlogBySlugSchema,
    deleteBlogSchema,
    updateBlogBodySchema,
    toggleStatusBodySchema
}