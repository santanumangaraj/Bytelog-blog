import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { toggleLike, toggleUnlike } from "../controllers/like.controller.js";
import { doValidate } from "../middlewares/validate.middleware.js";
import { getBlogByIdSchema } from "../validations/blog.validation.js";

const router = Router()

router.post("/toggle/:blogId/like", verifyJWT, doValidate(getBlogByIdSchema, "params"), toggleLike)
router.delete("/toggle/:blogId/unlike", verifyJWT, doValidate(getBlogByIdSchema, "params"), toggleUnlike)

export default router