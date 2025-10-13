// auth.ts
import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";

const userRepository = AppDataSource.getRepository(User);

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.status(200).json({ message: "Login successful", user: { id: user.id, email: user.email } });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ email, password: hashedPassword });
    await userRepository.save(user);
    return res.status(201).json({ message: "User registered successfully", user: { id: user.id, email } });
  } catch (error) {
    return res.status(500).json({ message: "Error registering user", error });
  }
};