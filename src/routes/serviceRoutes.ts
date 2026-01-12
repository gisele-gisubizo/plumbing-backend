import { Router } from "express";
import {
  createService,
  getAllServices,
  getActiveServices,
  getServiceById,
  updateService,
  deleteService,
  getServicesByCategory,
} from "../controllers/serviceController";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Public routes (no authentication required)
router.get("/", getAllServices); // Get all services
router.get("/active", getActiveServices); // Get only active services
router.get("/category/:category", getServicesByCategory); // Get services by category
router.get("/:id", getServiceById); // Get single service

// Protected routes (ADMIN ONLY)
router.post("/", adminMiddleware, createService); // Create service
router.put("/:id", adminMiddleware, updateService); // Update service
router.delete("/:id", adminMiddleware, deleteService); // Delete service

export default router;
