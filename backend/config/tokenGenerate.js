import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const generateToken = (userId, res) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  console.log("the token generated", token);
  res.cookie("token", token, {
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // Required for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    path: "/", // Cookie is available for all routes
  });

  return token;
};
