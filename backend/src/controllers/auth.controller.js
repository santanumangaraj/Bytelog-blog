import { changeUserPassword, loginUser, registerUser } from "../services/auth.service.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const register = asyncHandler(async (req, res) => {

    const newUser = await registerUser(req)

    if (!newUser) {
        throw new ApiError(500, "Something went wrong while registering the user!!")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(201, newUser, "User Registered Successfully!!")
        )
})

const login = asyncHandler(async(req,res)=>{

    const {loggedInUser,accessToken,refreshToken} = await loginUser(req.body);

    if(!loggedInUser){
        throw new ApiError(500, "Something went wrong while registering the user!!")
    }
    
    const options = {
        httpOnly: true,
        secure: true,
        samesite:"none"
    }
    
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,accessToken
            },
            "User logged in successfully"
        )
    )
})

const logoutUser = asyncHandler(async (req ,res)=>{

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out"
        )
    )
})

const changePassword = asyncHandler(async(req,res)=>{

    const user = await changeUserPassword(req.body,req.user?.id)

    return res
    .status(200)
    .json(
        new ApiResponse(200,{},"Password changed successfully")
    )
})

const getCurrentUser = asyncHandler(async (req, res)=>{
    return res
    .status(200)
    .json(
        new ApiResponse(200,req.user,"Current user fetched successfully")
    )
})

/*later updation
const updateAccountDetails = asyncHandler (async (req,res)=>{
    const {newFullName,newEmail} = req.body

    if(!(newFullName || newEmail)){
        throw new ApiError(400,"All fields are required")
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName:newFullName,
                email:newEmail
            }
        },
        {new : true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedUser,"User Account details updated Successfully")
    )
})
const updateUserAvatar = asyncHandler (async (req, res)=>{
    const avatarLocalPath = req.file?.path

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new : true}
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"User avatar changed successfully")
    )

})
const refreshAccessToken = asyncHandler( async (req , res)=>{
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }

    try{
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user){
            throw new ApiError(401, "Invalid refresh Token")
        }

        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }

        const options={
            httpOnly: true,
            secure: true
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)

        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",refreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    }catch(error){
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})
*/

export {
    register,
    login,
    logoutUser,
    changePassword,
    getCurrentUser
}