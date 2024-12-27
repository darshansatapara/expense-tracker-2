import express from "express";
import dotenv from "dotenv";

// Database imports
import {
  connectUserDatabase,
  connectAdminDatabase,
} from "./config/database.js";

import cors from "cors";

// Routes
import userAuthRoute from "./routes/UserRoutes/userAuthRoutes.js";
import userExpenseRoute from "./routes/UserRoutes/userExpenseRoutes.js";
import userIncomeRoute from "./routes/UserRoutes/userIncomeRoutes.js";
import otpRoute from "./routes/CommonRoute/otpRoutes.js";

dotenv.config(); // Load environment variables

(async () => {
  try {
    const userDbConnection = await connectUserDatabase();
    const adminDbConnection = await connectAdminDatabase();

    const app = express();

    // Middleware
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));
    app.use(cors());

    // Routes
    app.use("/api/auth", userAuthRoute(userDbConnection)); // Pass the user database connection to routes
    app.use("/api/expenses", userExpenseRoute(userDbConnection));
    app.use("/api/income", userIncomeRoute(userDbConnection));
    app.use("/api/otp", otpRoute);

    // Admin-specific routes (if any)
    // app.use("/api/admincategories", adminCategoryRoutes(adminDbConnection));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
})();
