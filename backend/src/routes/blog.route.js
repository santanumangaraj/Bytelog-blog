import {Router} from "express"
import {uploadBlogImage} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { delBlog, fetchedAllBlogs, fetchedBlogBySlug, fetchedOwnerBlogs, getBlog, incrementView, publish, toggleStatus, updateBlog } from "../controllers/blog.controller.js";
import { doValidate } from "../middlewares/validate.middleware.js";
import { deleteBlogSchema, getAllBlogsSchema, getAllUserBlogsSchema, getBlogByIdSchema, getBlogBySlugSchema, publishSchema } from "../validations/blog.validation.js";
import idempotencyMiddleware from "../middlewares/idempotency.middleware.js";


const router = Router()

router.post("/upload-blog",uploadBlogImage.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),verifyJWT,doValidate(publishSchema),idempotencyMiddleware,publish)
    
router.get("/id/:blogId",doValidate(getBlogByIdSchema,"params"),getBlog)

router.get("/s/:slug",doValidate(getBlogBySlugSchema,"params"),fetchedBlogBySlug)

router.get("/",doValidate(getAllBlogsSchema,"query"),fetchedAllBlogs)

router.get("/me",verifyJWT,doValidate(getAllUserBlogsSchema,"query"),fetchedOwnerBlogs)

router.delete("/delete-blog/:blogId",verifyJWT,doValidate(deleteBlogSchema,"params"),delBlog)

router.patch("/:blogId",verifyJWT,updateBlog)

router.patch("/:blogId/status",verifyJWT,toggleStatus)

router.patch("/:blogId/view",incrementView)
// router.route("/update-blog-details/:blogId").patch(verifyJWT,updateBlogDetails)
// router.route("/toggle/publish/:blogId").patch(verifyJWT,togglePublishBlogStatus)

export default router