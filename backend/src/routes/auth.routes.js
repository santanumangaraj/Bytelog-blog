import { Router } from "express"
import { login, register } from "../controllers/auth.controllers.js"
import upload from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { doValidate } from "../middlewares/validate.middleware.js";
import { registerSchema } from "../validations/auth.validation.js";

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

router.post("/login",login)
// router.route("/logout").post(verifyJWT,logoutUser)
// router.route("/refresh-token").post(refreshAccessToken)
// router.route("/change-password").post(verifyJWT,changeCurrentPassword)
// router.route("/current-user").get(verifyJWT,getCurrentUser)
// router.route("/update-account").patch(verifyJWT,updateAccountDetails)
// router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)

export default router