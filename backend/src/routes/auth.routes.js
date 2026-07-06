import { Router } from "express"
import { changePassword, getCurrentUser, login, logoutUser, register } from "../controllers/auth.controllers.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { doValidate } from "../middlewares/validate.middleware.js";
import { changePasswordSchema, loginSchema, registerSchema } from "../validations/auth.validation.js";

const router = Router()

router.post("/register",
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    doValidate(registerSchema),
    register
)

router.post("/login",doValidate(loginSchema),login)
router.post("/logout",verifyJWT,logoutUser)
router.post("/change-password",verifyJWT,doValidate(changePasswordSchema),changePassword)
router.route("/current-user").get(verifyJWT,getCurrentUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/update-account").patch(verifyJWT,updateAccountDetails)
// router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

export default router