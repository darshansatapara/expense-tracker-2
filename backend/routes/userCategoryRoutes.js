import express from "express";
import {
  postUserCategories,
  getUserCategories,
  updateUserCategories,
  deleteUserCategories,
} from "../controllers/userCategoryController.js";

const router = express.Router();

// Create or Update user categories
router.post("/addcategories", postUserCategories);

// Get user categories by userId
router.get("/getallcategories/:userId", getUserCategories);

// Update user categories by categoryId
router.put("/updatecategories/:categoryId", updateUserCategories);

// Delete user categories by categoryId
router.delete("/deletecategories/:categoryId", deleteUserCategories);

export default router;
