import {Router} from "express"
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { deleteABlog, getAllBlogs, getBlogById, publishABlog, togglePublishBlogStatus, updateBlogDetails } from "../controllers/blog.controllers.js";


const router = Router()

// router.use(verifyJWT)

router.route("/upload-blog").post(upload.single("image"),verifyJWT,publishABlog)
router.route("/b/:blogId").get(getBlogById)
router.route("/").get(getAllBlogs)
router.route("/update-blog-details/:blogId").patch(verifyJWT,updateBlogDetails)
router.route("/delete-blog/:blogId").delete(verifyJWT,deleteABlog)
router.route("/toggle/publish/:blogId").patch(verifyJWT,togglePublishBlogStatus)

export default router