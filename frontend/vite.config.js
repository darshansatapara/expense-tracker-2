import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        "mongoose", // Exclude mongoose
        /backend\/.*/, // Exclude backend files
      ],
    },
    sourcemap: true,
  },
  base: "./",
  define: {
    "process.env": {},
  },
});
