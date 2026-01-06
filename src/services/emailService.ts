import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

console.log("Loaded USER_EMAIL:", process.env.USER_EMAIL);
console.log("Loaded APP_PASSWORD:", process.env.APP_PASSWORD);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates for testing
  },
});

// Test the connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Email connection error:", error);
  } else {
    console.log("Email server is ready:", success);
  }
});

export const sendMail = async (to: string, subject: string, text: string) => {
  await transporter.sendMail({
    from: process.env.USER_EMAIL,
    to,
    subject,
    text,
  });
};