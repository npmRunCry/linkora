import {Router} from "express"
import { getMyProfile, getPublicProfile, updateAppearance, updateMyProfile } from "../controllers/profileController.js"
import {protect} from "../middleware/authMiddleware.js"

const router = Router()

router.get("/me", protect, getMyProfile)
router.get("/public/:username", getPublicProfile)
router.patch("/me", protect, updateMyProfile)
router.patch("/appearance", protect, updateAppearance)

export default router