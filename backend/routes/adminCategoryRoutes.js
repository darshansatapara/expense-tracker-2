import express from "express";
import {
  getAdminCategories,
  postAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../controllers/AdminController/adminCategoryController.js";
import formatCategoryMiddleware from "../middlewares/formatCategoryMiddleware .js";
const router = express.Router();

// Fetch all categories
router.get("/getallcategories", getAdminCategories);

// Add a new category (with formatting middleware)
router.post("/addcategories", formatCategoryMiddleware, postAdminCategory);

// Update an existing category (with formatting middleware)
router.put(
  "/updatecategories/:name",
  formatCategoryMiddleware,
  updateAdminCategory
);

// Delete a specific category by name
router.delete("/deletecategories/:name", deleteAdminCategory);

export default router;
