import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust base URL based on your environment
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});
