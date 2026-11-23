import { Router } from "express";
import { createBlock, deleteBlock, duplicateBlock, getBlocks,reorderBlocks, updateBlock } from "../controllers/blockController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router()

router.get("/", protect, getBlocks)
router.post("/", protect, createBlock)
router.patch("/reorder", protect, reorderBlocks)
router.delete("/:id", protect, deleteBlock)
router.post("/:id/duplicate", protect, duplicateBlock)
router.patch("/:id", protect, updateBlock)


export default router