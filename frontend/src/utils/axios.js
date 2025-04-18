import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust base URL based on your environment
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    // Add Authorization header if needed
  },
});
