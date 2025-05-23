import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to the user database
export const connectUserDatabase = async () => {
  try {
    const userDbConnection = mongoose.createConnection(
      process.env.USER_MONGO_URI,
      {
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 45000, // Optional: max time a query can run
      }
    );
    console.log("Connected to user database");
    return userDbConnection; // Return the connection instance
  } catch (error) {
    console.error("Error connecting to user database:", error);
    process.exit(1);
  }
};

// Connect to the admin database
export const connectAdminDatabase = async () => {
  try {
    const adminDbConnection = mongoose.createConnection(
      process.env.ADMIN_MONGO_URI,
      {
        serverSelectionTimeoutMS: 30000, // Increase to 30 seconds
        socketTimeoutMS: 45000, // Optional: max time a query can run
      }
    );
    console.log("Connected to admin database");
    return adminDbConnection; // Return the connection instance
  } catch (error) {
    console.error("Error connecting to admin database:", error);
    process.exit(1);
  }
};
