import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
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
import adminCategoryRoutes from "./routes/AdminRoutes/adminCategoryRoutes.js";
import userCategoryRoute from "./routes/UserRoutes/userCategoryRoutes.js";
import userProfileRoute from "./routes/UserRoutes/userProfileRoutes.js";
import { CurrencyDailyRateJob } from "./jobs/currencyDailyRateJob.js";
import currencyRateRoute from "./routes/CommonRoute/currencyDailyRateRoute.js";
import reportRoute from "./routes/CommonRoute/reportRoutes.js";

dotenv.config(); // Load environment variables

(async () => {
  try {
    const userDbConnection = await connectUserDatabase();
    const adminDbConnection = await connectAdminDatabase();

    if (!userDbConnection || !adminDbConnection) {
      console.error("Error connecting to the databases.");
      process.exit(1);
    }
    const app = express();

    app.use(
      cors({
        origin: [
          "https://expense-tracker-frontend-phi-one.vercel.app", // Add your frontend's production URL
          "http://localhost:5173",
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
      })
    );

    // Handle preflight requests
    app.options("*", cors());

    // Middleware
    app.use(cookieParser());
    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ limit: "10mb", extended: true }));

    // Add explicit OPTIONS handling for preflight requests

    // User Routes*********************************************************
    app.use("/api/otp", otpRoute);
    app.use("/api/auth", userAuthRoute(userDbConnection)); // Pass the user database connection to routes
    app.use(
      "/api/expense",
      // protect,
      userExpenseRoute(userDbConnection, adminDbConnection)
    );
    app.use(
      "/api/income",
      // protect,
      userIncomeRoute(userDbConnection, adminDbConnection)
    );
    app.use(
      "/api/usercategories",
      // protect,
      userCategoryRoute(userDbConnection, adminDbConnection)
    );
    app.use(
      "/api/userprofile",
      // protect,
      userProfileRoute(userDbConnection, adminDbConnection)
    );

    // Admin-specific routes (if any)****************************************************************
    app.use(
      "/api/admincategories",
      adminCategoryRoutes(adminDbConnection, userDbConnection)
    );

    //currency rate routes (if any)****************************************************************
    // Register currencyRateRoute with the app
    app.use("/api/currencyrate", currencyRateRoute(adminDbConnection));
    // Schedule the currency update job

    //report routes (if any)****************************************************************
    app.use("/api/report", reportRoute(userDbConnection, adminDbConnection));

    /////// job sheduler
    CurrencyDailyRateJob(adminDbConnection);

    app.get("/", (req, res) => {
      res
        .status(200)
        .json({ status: "OK", message: "Server is running properly" });
    });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
    process.exit(1);
  }
})();
