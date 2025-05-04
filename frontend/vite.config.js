import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.VITE_API_URL || "http://localhost:5000",
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
    sourcemap: true, // Enable sourcemaps for debugging
  },
  base: "/", // Ensure assets are served from root
  define: {
    "process.env": {}, // Prevent process.env usage
  },
});
