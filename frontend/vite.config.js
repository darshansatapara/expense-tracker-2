import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env filenbvhvjh
dotenv.config();

export default defineConfig({
  base: "/",
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: process.env.VITE_API_URL || "http://localhost:5000",
  //       changeOrigin: true,
  //       secure: true,
  //       rewrite: (path) => path.replace(/^\/api/, "/api"),
  //     },
  //   },
  // },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom", "zustand"],
          antd: ["antd"],
          charts: ["chart.js", "react-chartjs-2"],
          documents: ["exceljs", "jspdf", "html2canvas"],
          // firebase: ['firebase'],
          animations: ["framer-motion", "motion"],
          datepicker: ["react-datepicker", "dayjs"],
          utilities: [
            "react-hot-toast",
            "react-toastify",
            "lucide-react",
            "react-icons",
            "react-loading-skeleton",
            "react-otp-input",
          ],
          axios: ["axios"],
          app: ["./src/main.jsx", "./src/App.jsx"],
        },
      },
    },
    chunkSizeWarningLimit: 10000,
  },
  // define: {
  //   "process.env": {},
  // },
});
