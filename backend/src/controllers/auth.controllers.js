import { loginUser, registerUser } from "../services/auth.service.js"
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
export {
    register,
    login
}