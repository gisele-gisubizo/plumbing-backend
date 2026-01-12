import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Plumber } from "../entities/Plumber";

const plumberRepository = AppDataSource.getRepository(Plumber);

// Create a new plumber
export const createPlumber = async (req: Request, res: Response) => {
  const { name, phone, email, specialization, experience, location, available, rating, description } = req.body;

  try {
    // Check if plumber with same email already exists
    const existingPlumber = await plumberRepository.findOneBy({ email });
    if (existingPlumber) {
      return res.status(400).json({ message: "Plumber with this email already exists" });
    }

    const plumber = plumberRepository.create({
      name,
      phone,
      email,
      specialization,
      experience,
      location,
      available: available !== undefined ? available : true,
      rating: rating || null,
      description,
    });

    await plumberRepository.save(plumber);

    return res.status(201).json({
      message: "Plumber created successfully",
      plumber,
    });
  } catch (error) {
    console.error("Error creating plumber:", error);
    return res.status(500).json({ message: "Error creating plumber", error });
  }
};

// Get all plumbers
export const getAllPlumbers = async (req: Request, res: Response) => {
  try {
    const plumbers = await plumberRepository.find({
      order: { createdAt: "DESC" },
    });

    return res.status(200).json({
      message: "Plumbers retrieved successfully",
      count: plumbers.length,
      plumbers,
    });
  } catch (error) {
    console.error("Error fetching plumbers:", error);
    return res.status(500).json({ message: "Error fetching plumbers", error });
  }
};

// Get a single plumber by ID
export const getPlumberById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plumber = await plumberRepository.findOneBy({ id });

    if (!plumber) {
      return res.status(404).json({ message: "Plumber not found" });
    }

    return res.status(200).json({
      message: "Plumber retrieved successfully",
      plumber,
    });
  } catch (error) {
    console.error("Error fetching plumber:", error);
    return res.status(500).json({ message: "Error fetching plumber", error });
  }
};

// Update a plumber
export const updatePlumber = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phone, email, specialization, experience, location, available, rating, description } = req.body;

  try {
    const plumber = await plumberRepository.findOneBy({ id });

    if (!plumber) {
      return res.status(404).json({ message: "Plumber not found" });
    }

    // Update fields if provided
    if (name) plumber.name = name;
    if (phone) plumber.phone = phone;
    if (email) plumber.email = email;
    if (specialization) plumber.specialization = specialization;
    if (experience) plumber.experience = experience;
    if (location) plumber.location = location;
    if (available !== undefined) plumber.available = available;
    if (rating !== undefined) plumber.rating = rating;
    if (description) plumber.description = description;

    await plumberRepository.save(plumber);

    return res.status(200).json({
      message: "Plumber updated successfully",
      plumber,
    });
  } catch (error) {
    console.error("Error updating plumber:", error);
    return res.status(500).json({ message: "Error updating plumber", error });
  }
};

// Delete a plumber
export const deletePlumber = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plumber = await plumberRepository.findOneBy({ id });

    if (!plumber) {
      return res.status(404).json({ message: "Plumber not found" });
    }

    await plumberRepository.remove(plumber);

    return res.status(200).json({
      message: "Plumber deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting plumber:", error);
    return res.status(500).json({ message: "Error deleting plumber", error });
  }
};

// Get available plumbers only
export const getAvailablePlumbers = async (req: Request, res: Response) => {
  try {
    const plumbers = await plumberRepository.find({
      where: { available: true },
      order: { rating: "DESC" },
    });

    return res.status(200).json({
      message: "Available plumbers retrieved successfully",
      count: plumbers.length,
      plumbers,
    });
  } catch (error) {
    console.error("Error fetching available plumbers:", error);
    return res.status(500).json({ message: "Error fetching available plumbers", error });
  }
};
