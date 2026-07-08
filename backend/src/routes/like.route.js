import { Router } from "express";
import { verifyJWT} from "../middlewares/auth.middleware.js"
import { toggleLike, toggleUnlike } from "../controllers/like.controller.js";


const router = Router()

// router.use(verifyJWT)

router.post("/toggle/:blogId/like",verifyJWT,toggleLike)
router.delete("/toggle/:blogId/unlike",verifyJWT,toggleUnlike)
// router.route("/count/:blogId").get(getBlogLikeCount)


export default router