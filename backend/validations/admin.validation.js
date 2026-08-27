import Joi from "joi";

const getAdminBlogsSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(8),

    query: Joi.string()
        .trim()
        .allow("")
        .optional(),

    status: Joi.string()
        .trim()
        .valid("all", "published", "draft", "archived")
        .default("all"),

    author: Joi.string()
        .trim()
        .allow("all", "")
        .default("all"),

    sort: Joi.string()
        .trim()
        .valid("newest", "oldest")
        .default("newest"),
})

const getAdminUsersSchema = Joi.object({
    page: Joi.number()
        .integer()
        .min(1)
        .default(1),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(50)
        .default(8),

    query: Joi.string()
        .trim()
        .allow("")
        .optional(),

    role: Joi.string()
        .trim()
        .valid("all", "ADMIN", "READER")
        .default("all"),

    status: Joi.string()
        .trim()
        .valid("all", "active", "suspended")
        .default("all"),

    sort: Joi.string()
        .trim()
        .valid("newest", "oldest")
        .default("newest"),
})

export {
    getAdminBlogsSchema,
    getAdminUsersSchema
}
