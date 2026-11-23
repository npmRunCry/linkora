import { Router } from "express"
import {
  changePassword,
  deleteAccount,
  updateAccount,
} from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = Router()

router.patch("/account", protect, updateAccount)
router.patch("/password", protect, changePassword)
router.delete("/account", protect, deleteAccount)

export default router
