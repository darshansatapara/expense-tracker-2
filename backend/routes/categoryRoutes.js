import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategoriesByEmail,
  getCategoriesById,
} from "../controllers/categoryController.js";

router.post("/create/:email", createCategory);
router.get("/getcategories/email/:email", getCategoriesByEmail);
router.get("/getcategories/id/:userId", getCategoriesById);

export default router;
