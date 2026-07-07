import {Router} from "express"
import {uploadBlogImage} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { publish } from "../controllers/blog.controller.js";


const router = Router()

// router.use(verifyJWT)

router.post("/upload-blog",uploadBlogImage.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),verifyJWT,publish)
// router.route("/b/:blogId").get(getBlogById)
// router.route("/").get(getAllBlogs)
// router.route("/update-blog-details/:blogId").patch(verifyJWT,updateBlogDetails)
// router.route("/delete-blog/:blogId").delete(verifyJWT,deleteABlog)
// router.route("/toggle/publish/:blogId").patch(verifyJWT,togglePublishBlogStatus)

export default router