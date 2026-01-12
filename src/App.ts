import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/authRoutes";
import plumberRoutes from "./routes/plumberRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import { sendMail } from "./services/emailService";
import { User } from "./entities/User";
import bcrypt from "bcryptjs";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/plumbers", plumberRoutes);
app.use("/api/services", serviceRoutes);

// Connect to DB and seed test user (optional)
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected ✅✅✅");

    // Optional: Seed a test admin user if needed
    const userRepository = AppDataSource.getRepository(User);
    const testEmail = "admin@plumbing.com";
    const testUser = await userRepository.findOneBy({ email: testEmail });
    if (!testUser) {
      const hashedPassword = await bcrypt.hash("plumb123", 10);
      const user = userRepository.create({
        email: testEmail,
        password: hashedPassword,
        role: "admin", // Make this user an admin
      });
      await userRepository.save(user);
      console.log("Test admin user created: admin@plumbing.com / plumb123 (ADMIN)");
    }

    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error("Database connection error:", err));

app.get("/api/test-email", async (req, res) => {
  try {
    await sendMail("yourpersonal@example.com", "Test", "Hello from plumbing backend");
    res.send("Email sent. Check inbox/spam.");
  } catch (err: any) {
    res.status(500).send("Failed to send: " + err.message);
  }
});
