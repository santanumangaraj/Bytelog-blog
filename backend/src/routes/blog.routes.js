import {Router} from "express"
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { deleteABlog, getAllBlogs, getBlogById, publishABlog, updateBlogDetails } from "../controllers/blog.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/upload-blog").post(upload.single("image"),publishABlog)
router.route("/b/:blogId").get(getBlogById)
router.route("/").get(getAllBlogs)
router.route("/update-blog-details/:blogId").patch(updateBlogDetails)
router.route("/delete-blog/:blogId").delete(deleteABlog)

export default router