import Joi from "joi";

const registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    fullName: Joi.string().required(),
    email: Joi.string().email({
        minDomainSegments: 2,
    }).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
})

const loginSchema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
})

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    newPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required()
})

export {
    registerSchema,
    loginSchema,
    changePasswordSchema
}