import { ApiResponse } from "../utils/ApiResponse.js";

const doValidate = (schema,property="body")=>{
    return (req,res,next)=>{
        
        const { error, value } = schema.validate(req[property], {
            abortEarly: true,
            stripUnknown: true,
        });

        if(error){

            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        if (property === "query") {
            Object.assign(req.query, value);
        } else if (property === "params") {
            Object.assign(req.params, value);
        } else {
            req.body = value;
        }

        next();
    }
}

export {doValidate}