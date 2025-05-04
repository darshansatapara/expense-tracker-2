import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: import.meta.env.LIVE_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"), // Ensure /api prefix is preserved
      },
    },
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: [
        "mongoose", // Exclude mongoose
        /backend\/.*/, // Exclude all backend files
      ],
    },
    sourcemap: true, // Enable sourcemaps for debugging (disable in production if not needed)
  },
  base: "/", // Ensure assets are served from root
  define: {
    "process.env": {}, // Prevent accidental process.env usage
  },
});
