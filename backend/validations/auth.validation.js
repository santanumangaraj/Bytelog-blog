import Joi from "joi";

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().required(),
    email: Joi.string().email({
        minDomainSegments: 2,
    }).required(),
    password: Joi.string().min(6).max(100).required(),
})

const loginSchema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
})

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().min(6).max(100).required(),
    newPassword: Joi.string().min(6).max(100).required()
})

export {
    registerSchema,
    loginSchema,
    changePasswordSchema
}