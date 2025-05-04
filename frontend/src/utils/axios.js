import axios from "axios";
// import dotenv from "dotenv";

// dotenv.config();

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust base URL based on your environment
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Add Authorization header if needed
  },
});
