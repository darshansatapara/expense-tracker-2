// frontend/src/api.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.LIVE_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
