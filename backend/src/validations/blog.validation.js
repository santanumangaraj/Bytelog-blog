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
})

const getBlogByIdSchema = Joi.object({
    blogId: Joi.string()
        .trim()
        .lowercase()
        .pattern(/^[a-z0-9-]+$/)
        .min(5)
        .required()
        .messages({
            "string.pattern.base": "Invalid blog slug format"
        })
})
const getBlogBySlugSchema = Joi.object({
    slug: Joi.string().trim().min(5).required()
})

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

    author: Joi.number()
        .integer()
        .positive()
        .optional(),
});

const deleteBlogSchema = getBlogByIdSchema;

export {
    publishSchema,
    getAllBlogsSchema,
    getBlogByIdSchema,
    getBlogBySlugSchema,
    deleteBlogSchema
}