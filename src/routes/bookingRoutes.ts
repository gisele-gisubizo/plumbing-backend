import { Router } from "express";
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  assignPlumber,
  updateBookingStatus,
  cancelBooking,
  deleteBooking,
  getBookingsByStatus,
} from "../controllers/bookingController";
import { authMiddleware } from "../middleware/authMiddleware";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = Router();

// Customer routes (authenticated users)
router.post("/", authMiddleware, createBooking); // Create booking
router.get("/my-bookings", authMiddleware, getMyBookings); // Get user's bookings
router.put("/:id/cancel", authMiddleware, cancelBooking); // Cancel booking

// Admin routes
router.get("/", adminMiddleware, getAllBookings); // Get all bookings
router.get("/status/:status", adminMiddleware, getBookingsByStatus); // Get by status
router.get("/:id", adminMiddleware, getBookingById); // Get single booking
router.put("/:id", adminMiddleware, updateBooking); // Update booking
router.put("/:id/assign", adminMiddleware, assignPlumber); // Assign plumber
router.put("/:id/status", adminMiddleware, updateBookingStatus); // Update status
router.delete("/:id", adminMiddleware, deleteBooking); // Delete booking

export default router;
