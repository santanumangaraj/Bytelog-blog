import user from "../models/user.js"
import { findUserByPk } from "../repository/auth.repository.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler(async (req , _ , next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token){
            throw new ApiError(401,"Unauthroized request")
        }

        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET)

        const user = await findUserByPk(decodedToken?.id)

        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid access token")
    }
})

export const verifyAdmin = asyncHandler(async (req,_,next)=>{
    if(req.user?.role !=="ADMIN"){
        throw new ApiError(403,"Admin access required")
    }
    next()
})