import { Router } from "express";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { toggleBlogLike } from "../controllers/like.controllers.js";


const router = Router()

router.use(verifyJWT)

router.route("/toggle/bl/:blogId").post(toggleBlogLike)



export default router