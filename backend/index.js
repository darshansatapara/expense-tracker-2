import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "../backend/config/database.js";
import userRoute from "./routes/userRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import expenseRoute from "./routes/expenseRoutes.js";
import incomeRoute from "./routes/incomeRoutes.js";
import otpRoute from "./routes/otpRoutes.js";

dotenv.config(); // Load environment variables

// Connect to the database
connectDatabase();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// routes
app.use("/api/auth", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/expenses", expenseRoute);
app.use("/api/income", incomeRoute);
app.use("/api/otp", otpRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
