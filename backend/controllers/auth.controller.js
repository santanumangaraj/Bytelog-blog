import { changeUserPassword, loginUser, logoutUser, refreshAccessToken, registerUser } from "../services/auth.service.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { accessTokenCookieOptions, refreshTokenCookieOptions } from "../utils/cookieOptions.js"


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
        throw new ApiError(500, "Something went wrong while logging in the user")
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,accessTokenCookieOptions())
    .cookie("refreshToken",refreshToken,refreshTokenCookieOptions())
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

const refreshToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken

    const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(incomingRefreshToken)

    return res
    .status(200)
    .cookie("accessToken",accessToken,accessTokenCookieOptions())
    .cookie("refreshToken",newRefreshToken,refreshTokenCookieOptions())
    .json(
        new ApiResponse(200,{accessToken},"Access token refreshed")
    )
})

const logout = asyncHandler(async (req ,res)=>{

    await logoutUser(req.user.id)

    return res
    .status(200)
    .clearCookie("accessToken", accessTokenCookieOptions())
    .clearCookie("refreshToken", refreshTokenCookieOptions())
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out"
        )
    )
})

const changePassword = asyncHandler(async(req,res)=>{

    await changeUserPassword(req.body,req.user?.id)

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



export {
    register,
    login,
    refreshToken,
    logout,
    changePassword,
    getCurrentUser
}
