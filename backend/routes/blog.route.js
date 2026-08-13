import { Router } from "express"
import { uploadBlogImage } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { delBlog, fetchedAllBlogs, fetchedBlogBySlug, fetchedOwnerBlogs, getBlog, incrementView, publish, toggleStatus, updateBlog } from "../controllers/blog.controller.js";
import { doValidate } from "../middlewares/validate.middleware.js";
import { deleteBlogSchema, getAllBlogsSchema, getAllUserBlogsSchema, getBlogByIdSchema, getBlogBySlugSchema, publishSchema, toggleStatusBodySchema, updateBlogBodySchema } from "../validations/blog.validation.js";
import idempotencyMiddleware from "../middlewares/idempotency.middleware.js";
import { uploadRateLimiter, viewRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router()

router.post("/upload-blog", uploadRateLimiter, uploadBlogImage.fields([
    {
        name: "coverImage",
        maxCount: 1
    }
]), verifyJWT, doValidate(publishSchema), idempotencyMiddleware, publish)
    
router.get("/id/:blogId", doValidate(getBlogByIdSchema, "params"), getBlog)

router.get("/s/:slug", doValidate(getBlogBySlugSchema, "params"), fetchedBlogBySlug)

router.get("/", doValidate(getAllBlogsSchema, "query"), fetchedAllBlogs)

router.get("/me", verifyJWT, doValidate(getAllUserBlogsSchema, "query"), fetchedOwnerBlogs)

router.delete("/delete-blog/:blogId", verifyJWT, doValidate(deleteBlogSchema, "params"), delBlog)

router.patch("/:blogId", uploadRateLimiter, verifyJWT, doValidate(getBlogByIdSchema, "params"), uploadBlogImage.fields([
    {
        name: "coverImage",
        maxCount: 1
    }
]), doValidate(updateBlogBodySchema), updateBlog)

router.patch("/:blogId/status", verifyJWT, doValidate(getBlogByIdSchema, "params"), doValidate(toggleStatusBodySchema), toggleStatus)

router.patch("/:blogId/view", viewRateLimiter, doValidate(getBlogByIdSchema, "params"), incrementView)

export default router
