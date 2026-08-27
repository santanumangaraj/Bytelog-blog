import { Router } from "express"
import { verifyJWT, verifyAdmin } from "../middlewares/auth.middleware.js"
import { doValidate } from "../middlewares/validate.middleware.js"
import { fetchedAdminBlogs, fetchedAdminUsers } from "../controllers/admin.controller.js"
import { getAdminBlogsSchema, getAdminUsersSchema } from "../validations/admin.validation.js"

const router = Router()

router.get("/blogs", verifyJWT, verifyAdmin, doValidate(getAdminBlogsSchema, "query"), fetchedAdminBlogs)
router.get("/users", verifyJWT, verifyAdmin, doValidate(getAdminUsersSchema, "query"), fetchedAdminUsers)

export default router
