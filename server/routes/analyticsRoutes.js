import { Router } from "express"
import {
  getAnalyticsOverview,
  trackClick,
} from "../controllers/analyticsController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = Router()

router.post("/click/:blockId", trackClick)
router.get("/overview", protect, getAnalyticsOverview)

export default router
