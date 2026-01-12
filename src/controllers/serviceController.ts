import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { Service } from "../entities/Service";

const serviceRepository = AppDataSource.getRepository(Service);

// Create a new service
export const createService = async (req: Request, res: Response) => {
  const { name, description, price, duration, category, isActive } = req.body;

  try {
    // Check if service with same name already exists
    const existingService = await serviceRepository.findOneBy({ name });
    if (existingService) {
      return res.status(400).json({ message: "Service with this name already exists" });
    }

    const service = serviceRepository.create({
      name,
      description,
      price: price || null,
      duration: duration || null,
      category: category || null,
      isActive: isActive !== undefined ? isActive : true,
    });

    await serviceRepository.save(service);

    return res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ message: "Error creating service", error });
  }
};

// Get all services
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await serviceRepository.find({
      order: { id: "ASC" },
    });

    return res.status(200).json({
      message: "Services retrieved successfully",
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({ message: "Error fetching services", error });
  }
};

// Get active services only
export const getActiveServices = async (req: Request, res: Response) => {
  try {
    const services = await serviceRepository.find({
      where: { isActive: true },
      order: { id: "ASC" },
    });

    return res.status(200).json({
      message: "Active services retrieved successfully",
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching active services:", error);
    return res.status(500).json({ message: "Error fetching active services", error });
  }
};

// Get a single service by ID
export const getServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await serviceRepository.findOneBy({ id: parseInt(id) });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json({
      message: "Service retrieved successfully",
      service,
    });
  } catch (error) {
    console.error("Error fetching service:", error);
    return res.status(500).json({ message: "Error fetching service", error });
  }
};

// Update a service
export const updateService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, duration, category, isActive } = req.body;

  try {
    const service = await serviceRepository.findOneBy({ id: parseInt(id) });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update fields if provided
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration !== undefined) service.duration = duration;
    if (category !== undefined) service.category = category;
    if (isActive !== undefined) service.isActive = isActive;

    await serviceRepository.save(service);

    return res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    return res.status(500).json({ message: "Error updating service", error });
  }
};

// Delete a service
export const deleteService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await serviceRepository.findOneBy({ id: parseInt(id) });

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await serviceRepository.remove(service);

    return res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    return res.status(500).json({ message: "Error deleting service", error });
  }
};

// Get services by category
export const getServicesByCategory = async (req: Request, res: Response) => {
  const { category } = req.params;

  try {
    const services = await serviceRepository.find({
      where: { category, isActive: true },
      order: { id: "ASC" },
    });

    return res.status(200).json({
      message: `Services in category '${category}' retrieved successfully`,
      count: services.length,
      services,
    });
  } catch (error) {
    console.error("Error fetching services by category:", error);
    return res.status(500).json({ message: "Error fetching services by category", error });
  }
};
