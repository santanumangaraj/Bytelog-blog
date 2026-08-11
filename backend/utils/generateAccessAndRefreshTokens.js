import jwt from "jsonwebtoken"
import { ApiError } from "./ApiError.js"

const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
        },
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
    )
}

const generateAccessAndRefreshTokens = async(user)=>{
    try {
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh tokens")
    }
}


export default generateAccessAndRefreshTokens;
export { generateAccessToken, generateRefreshToken };
