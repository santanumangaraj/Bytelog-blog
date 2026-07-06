import jwt from "jsonwebtoken"


const generateAccessAndRefreshTokens = async(user)=>{
    try {
        const accessToken = await jwt.sign({
            id:user.id,
            username:user.username,
        },process.env.JWT_SECRET_KEY)
    
        const refreshToken = await jwt.sign({
            id:user.id,
            username:user.username,
            email:user.email,
        },process.env.JWT_SECRET_KEY)
    
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}


export default generateAccessAndRefreshTokens;