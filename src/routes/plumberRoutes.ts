import { Router } from "express";
import {
  createPlumber,
  getAllPlumbers,
  getPlumberById,
  updatePlumber,
  deletePlumber,
  getAvailablePlumbers,
} from "../controllers/plumberController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Public routes (no authentication required)
router.get("/available", getAvailablePlumbers); // Get only available plumbers
router.get("/", getAllPlumbers); // Get all plumbers
router.get("/:id", getPlumberById); // Get single plumber

// Protected routes (ADMIN ONLY)
router.post("/", adminMiddleware, createPlumber); // Only admin can create
router.put("/:id", adminMiddleware, updatePlumber); // Only admin can update
router.delete("/:id", adminMiddleware, deletePlumber); // Only admin can delete

export default router;
