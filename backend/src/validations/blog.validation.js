import Joi from "joi";

const publishSchema = Joi.object({
    identifier: Joi.string().required(),
    password: Joi.string().required()
})


export {
    publishSchema
}