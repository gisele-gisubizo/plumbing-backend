import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../services/emailService";
import crypto from "crypto";

const userRepository = AppDataSource.getRepository(User);


const otpStorage: Map<string, { otp: string; expires: number }> = new Map();

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes expiration
    otpStorage.set(email, { otp, expires });

    // Send OTP via email
    await sendMail(email, "Your OTP for Registration", `Your OTP is ${otp}. It expires in 10 minutes.`);

    // Temporarily store hashed password in session or return a temp token (for simplicity, we'll verify in next step)

    return res.status(200).json({ message: "OTP sent to your email. Verify to complete registration." });
  } catch (error) {
    return res.status(500).json({ message: "Error initiating registration", error });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp, password } = req.body;

  try {
    const storedOtp = otpStorage.get(email);
    if (!storedOtp || storedOtp.otp !== otp || Date.now() > storedOtp.expires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP valid, create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({ email, password: hashedPassword, role: "user" });
    await userRepository.save(user);

    // Clean up OTP
    otpStorage.delete(email);

    await sendMail(email, "Welcome to Plumbing Backend", "Thank you for registering!");

    return res.status(201).json({ message: "User registered successfully", user: { id: user.id, email, role: user.role } });
  } catch (error) {
    return res.status(500).json({ message: "Error verifying OTP", error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Include role in JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );
    
    return res.status(200).json({ 
      message: "Login successful", 
      token, 
      user: { 
        id: user.id, 
        email: user.email,
        role: user.role
      } 
    });
  } catch (error) {
    return res.status(500).json({ message: "Error logging in", error });
  }
};
