import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Booking } from "../entities/Booking";

const bookingRepository = AppDataSource.getRepository(Booking);

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Create a new booking (Customer)
export const createBooking = async (req: AuthRequest, res: Response) => {
  const { serviceId, scheduledDate, address, description, priority } = req.body;
  const customerId = req.user?.id;

  try {
    if (!customerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const booking = bookingRepository.create({
      customerId,
      serviceId,
      scheduledDate: new Date(scheduledDate),
      address,
      description: description || null,
      priority: priority || "medium",
      status: "pending",
    });

    await bookingRepository.save(booking);

    // Fetch the booking with relations
    const savedBooking = await bookingRepository.findOne({
      where: { id: booking.id },
      relations: ["customer", "service", "plumber"],
    });

    return res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Error creating booking", error });
  }
};

// Get all bookings (Admin only)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await bookingRepository.find({
      relations: ["customer", "service", "plumber"],
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      message: "Bookings retrieved successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get user's own bookings (Customer)
export const getMyBookings = async (req: AuthRequest, res: Response) => {
  const customerId = req.user?.id;

  try {
    if (!customerId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const bookings = await bookingRepository.find({
      where: { customerId },
      relations: ["customer", "service", "plumber"],
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      message: "Your bookings retrieved successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get single booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["customer", "service", "plumber"],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    return res.status(200).json({
      message: "Booking retrieved successfully",
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({ message: "Error fetching booking", error });
  }
};

// Update booking (Admin only)
export const updateBooking = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { plumberId, status, estimatedPrice, finalPrice, adminNotes, scheduledDate } = req.body;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update fields if provided
    if (plumberId !== undefined) booking.plumberId = plumberId;
    if (status !== undefined) booking.status = status;
    if (estimatedPrice !== undefined) booking.estimatedPrice = estimatedPrice;
    if (finalPrice !== undefined) booking.finalPrice = finalPrice;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (scheduledDate !== undefined) booking.scheduledDate = new Date(scheduledDate);

    await bookingRepository.save(booking);

    // Fetch updated booking with relations
    const updatedBooking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["customer", "service", "plumber"],
    });

    return res.status(200).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({ message: "Error updating booking", error });
  }
};

// Assign plumber to booking (Admin only)
export const assignPlumber = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { plumberId } = req.body;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.plumberId = plumberId;
    booking.status = "confirmed"; // Automatically confirm when plumber is assigned

    await bookingRepository.save(booking);

    const updatedBooking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["customer", "service", "plumber"],
    });

    return res.status(200).json({
      message: "Plumber assigned successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error assigning plumber:", error);
    return res.status(500).json({ message: "Error assigning plumber", error });
  }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await bookingRepository.save(booking);

    const updatedBooking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["customer", "service", "plumber"],
    });

    return res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    return res.status(500).json({ message: "Error updating booking status", error });
  }
};

// Cancel booking (Customer can cancel their own, Admin can cancel any)
export const cancelBooking = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.customerId !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "You don't have permission to cancel this booking" });
    }

    booking.status = "cancelled";
    await bookingRepository.save(booking);

    const updatedBooking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
      relations: ["customer", "service", "plumber"],
    });

    return res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({ message: "Error cancelling booking", error });
  }
};

// Delete booking (Admin only)
export const deleteBooking = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const booking = await bookingRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await bookingRepository.remove(booking);

    return res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({ message: "Error deleting booking", error });
  }
};

// Get bookings by status (Admin only)
export const getBookingsByStatus = async (req: Request, res: Response) => {
  const { status } = req.params;

  try {
    const bookings = await bookingRepository.find({
      where: { status },
      relations: ["customer", "service", "plumber"],
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      message: `Bookings with status '${status}' retrieved successfully`,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings by status:", error);
    return res.status(500).json({ message: "Error fetching bookings", error });
  }
};
