import {Router} from "express"
import {uploadBlogImage} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { delBlog, fetchedAllBlogs, fetchedBlogBySlug, getBlog, publish } from "../controllers/blog.controller.js";
import { doValidate } from "../middlewares/validate.middleware.js";
import { deleteBlogSchema, getAllBlogsSchema, getBlogByIdSchema, getBlogBySlugSchema, publishSchema } from "../validations/blog.validation.js";
import idempotencyMiddleware from "../middlewares/idempotency.middleware.js";


const router = Router()

// router.use(verifyJWT)

router.post("/upload-blog",uploadBlogImage.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),verifyJWT,doValidate(publishSchema),idempotencyMiddleware,publish)
    
router.get("/id/:blogId",doValidate(getBlogByIdSchema,"params"),getBlog)
router.get("/:slug",doValidate(getBlogBySlugSchema,"params"),fetchedBlogBySlug)
router.route("/").get(doValidate(getAllBlogsSchema),fetchedAllBlogs)
router.route("/delete-blog/:blogId").delete(verifyJWT,doValidate(deleteBlogSchema,"params"),delBlog)
// router.route("/update-blog-details/:blogId").patch(verifyJWT,updateBlogDetails)
// router.route("/toggle/publish/:blogId").patch(verifyJWT,togglePublishBlogStatus)

export default router