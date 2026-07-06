import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import bcrypt from "bcrypt"
import { createUser, findByEmailOrUsername, findByIdentifier, findUserByPk, updateUser } from "../repository/auth.repository.js";
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens.js"

const registerUser = async (data) => {

    const { fullName, email, username, password } = data.body

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await findByEmailOrUsername({username,email})

    if (existedUser) {
        throw new ApiError(409, "Either User with email or username already exists")
    }

    const avatarPath = data.files?.avatar[0]?.key;

    if (!avatarPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await createUser({
        username: username,
        fullName: fullName,
        email: email,
        avatar: avatarPath,
        password: hashedPassword,
    })

    const createdUser = await findUserByPk(newUser.id)

    return createdUser;
}

const loginUser = async({identifier,password})=>{

    if(!(identifier || password)){
        throw new ApiError(400,"Either Username or email is required")
    }

    const user = await findByIdentifier(identifier)
    
    if(!user){
        throw new ApiError(404,"User does not exist")
    }
    
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    
    if(!isPasswordCorrect){
        throw new ApiError(401,"Invalid user credentials")
    }
        
    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user)

    await updateUser(user,{refreshToken:refreshToken})

    const loggedInUser = await findUserByPk(user.id)
    
    
    return {loggedInUser,accessToken,refreshToken};
}


export {
    registerUser,
    loginUser
}