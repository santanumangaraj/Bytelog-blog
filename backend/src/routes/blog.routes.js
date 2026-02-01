import {Router} from "express"
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { publishABlog } from "../controllers/blog.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/upload-blog").post(upload.single("image"),publishABlog)


export default router