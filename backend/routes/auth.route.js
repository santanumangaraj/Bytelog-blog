import { Router } from "express"
import { changePassword, forgotPassword, getCurrentUser, login, logout, refreshToken, register, resetPassword } from "../controllers/auth.controller.js"
import { uploadAvatar } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { doValidate } from "../middlewares/validate.middleware.js";
import { changePasswordSchema, forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validations/auth.validation.js";
import { forgotPasswordRateLimiter, loginRateLimiter, registerRateLimiter, refreshRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router()

router.post("/register",
    registerRateLimiter,
    uploadAvatar.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    doValidate(registerSchema),
    register
)

router.post("/login",loginRateLimiter,doValidate(loginSchema),login)
router.post("/refresh-token",refreshRateLimiter,refreshToken)
router.post("/logout",verifyJWT,logout)
router.post("/change-password",verifyJWT,doValidate(changePasswordSchema),changePassword)
router.get("/current-user", verifyJWT, getCurrentUser)

router.post("/forgot-password",forgotPasswordRateLimiter,doValidate(forgotPasswordSchema),forgotPassword)
router.post("/reset-password",doValidate(resetPasswordSchema),resetPassword)

export default router
