import { Router } from "express"
import { fetchedAllTags } from "../controllers/tags.controller.js";

const router = Router()

router.get("/", fetchedAllTags)

export default router
