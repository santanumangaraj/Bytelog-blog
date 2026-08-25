import { ApiError } from "../utils/ApiError.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import { createUser, findByEmailOrUsername, findByIdentifier, findByPkWithAllFields, findByResetToken, findUserByPk, updateUser } from "../repository/auth.repository.js";
import generateAccessAndRefreshTokens from "../utils/generateAccessAndRefreshTokens.js"
import { sendPasswordResetEmail } from "../utils/mailer.utils.js"

const MAX_FAILED_ATTEMPTS = Number(process.env.LOGIN_MAX_FAILED_ATTEMPTS) || 5;
const LOCK_DURATION_MS = Number(process.env.LOGIN_LOCK_DURATION_MS) || 15 * 60 * 1000;
const PASSWORD_RESET_EXPIRY_MS = Number(process.env.PASSWORD_RESET_EXPIRY_MS) || 30 * 60 * 1000;

const registerUser = async (data) => {

    const { fullName, email, username, password } = data.body

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await findByEmailOrUsername({username,email})

    if (existedUser) {
        throw new ApiError(409, "Either User with email or username already exists")
    }

    const avatarPathKey = data.files?.avatar[0]?.key;

    if (!avatarPathKey) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatarImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${avatarPathKey}`;

    const hashedPassword = await bcrypt.hash(password,10)
    const newUser = await createUser({
        username: username,
        fullName: fullName,
        email: email,
        avatarImageKey: avatarPathKey,
        avatarImageUrl,
        password: hashedPassword,
    })

    const createdUser = await findUserByPk(newUser.id)

    return createdUser;
}

const loginUser = async({identifier,password})=>{

    if(!identifier || !password){
        throw new ApiError(400,"Either Username or email is required")
    }

    const user = await findByIdentifier(identifier)

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
        const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000)
        throw new ApiError(423, `Account temporarily locked due to multiple failed login attempts. Try again in ${minutesLeft} minute(s).`)
    }

    const isPasswordCorrect = await bcrypt.compare(password,user.password)

    if(!isPasswordCorrect){
        const attempts = user.failedLoginAttempts + 1
        const updateData = { failedLoginAttempts: attempts }

        if (attempts >= MAX_FAILED_ATTEMPTS) {
            updateData.lockUntil = new Date(Date.now() + LOCK_DURATION_MS)
            updateData.failedLoginAttempts = 0
        }

        await updateUser(user, updateData)
        throw new ApiError(401,"Invalid user credentials")
    }

    if (user.failedLoginAttempts > 0 || user.lockUntil) {
        await updateUser(user, { failedLoginAttempts: 0, lockUntil: null })
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user)

    await updateUser(user,{refreshToken:refreshToken})

    const loggedInUser = await findUserByPk(user.id)


    return {loggedInUser,accessToken,refreshToken};
}

const refreshAccessToken = async (incomingRefreshToken) => {

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decoded

    try {
        decoded = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
        throw new ApiError(401, "Invalid or expired refresh token")
    }

    const user = await findByPkWithAllFields(decoded.id)

    if (!user || !user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or has already been used")
    }

    const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user)

    await updateUser(user, { refreshToken: newRefreshToken })

    return { accessToken, refreshToken: newRefreshToken }
}

const logoutUser = async (userId) => {

    const user = await findByPkWithAllFields(userId)

    if (user) {
        await updateUser(user, { refreshToken: null })
    }
}

const changeUserPassword = async({currentPassword, newPassword},userId)=>{

    const user = await findByPkWithAllFields(userId)

    const isPasswordCorrect = await bcrypt.compare(currentPassword,user.password)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    const hashedNewPassword = await bcrypt.hash(newPassword,10)

    await updateUser(user,{password:hashedNewPassword})

    return user;
}

const requestPasswordReset = async({email})=>{

    if(!email){
        throw new ApiError(400,"Email is required")
    }

    const user = await findByIdentifier(email)

    // Same response whether or not the account exists — otherwise this
    // endpoint becomes a way to check which emails are registered.
    if(!user){
        return
    }

    const rawToken = crypto.randomBytes(32).toString("hex")
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex")

    await updateUser(user,{
        passwordResetToken: hashedToken,
        passwordResetExpires: new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS),
    })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`

    await sendPasswordResetEmail(user.email, resetUrl)
}

const resetUserPassword = async({token,newPassword})=>{

    if(!token || !newPassword){
        throw new ApiError(400,"Token and new password are required")
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await findByResetToken(hashedToken)

    if(!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()){
        throw new ApiError(400,"Password reset link is invalid or has expired")
    }

    const hashedPassword = await bcrypt.hash(newPassword,10)

    await updateUser(user,{
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        // a leaked/stale session shouldn't survive a password reset
        refreshToken: null,
    })
}

export {
    registerUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    changeUserPassword,
    requestPasswordReset,
    resetUserPassword
}
