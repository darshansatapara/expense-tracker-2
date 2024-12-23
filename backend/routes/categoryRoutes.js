import express from "express";
const router = express.Router();
import {
  createCategory,
  deleteCategoryOrSubcategory,
  getCategoriesById,
} from "../controllers/categoryController.js";

router.post("/create/:userId", createCategory);
router.get("/getcategories/:userId", getCategoriesById);
router.delete(
  "/deletecategories/:userId/:categoryId",
  deleteCategoryOrSubcategory
);

export default router;
