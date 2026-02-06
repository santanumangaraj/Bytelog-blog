import { Router } from "express";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { toggleBlogLike,getBlogLikeCount } from "../controllers/like.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/toggle/bl/:blogId").post(toggleBlogLike)
router.route("/count/:blogId").get(getBlogLikeCount)


export default router