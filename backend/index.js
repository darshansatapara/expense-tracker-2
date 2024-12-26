import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDatabase from "../backend/config/database.js";
import userRoute from "./routes/userRoutes.js";
import userCategoryRoute from "./routes/userCategoryRoutes.js";
import expenseRoute from "./routes/expenseRoutes.js";
import incomeRoute from "./routes/incomeRoutes.js";
import otpRoute from "./routes/otpRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";

dotenv.config(); // Load environment variables

// Connect to the database
connectDatabase();

const app = express();

// Middleware
// Increase payload size limit
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());

// routes
app.use("/api/auth", userRoute);
// app.use("/api/usercategories", userCategoryRoute);
// app.use("/api/admincategories", adminCategoryRoutes);
app.use("/api/expenses", expenseRoute);
app.use("/api/income", incomeRoute);
app.use("/api/otp", otpRoute);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
