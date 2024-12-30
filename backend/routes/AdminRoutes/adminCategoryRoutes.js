import express from "express";
import {
  getAllAdminCurrencyCategories,
  getAllAdminExpenseCategories,
  getAllAdminIncomeCategories,
} from "../../controllers/AdminController/adminCategoryController.js"; // Make sure this import path is correct

// Define the adminCategoryRoute
const adminCategoryRoutes = (adminDbConnection) => {
  if (!adminDbConnection) {
    throw new Error("Admin database connection is undefined");
  }

  const router = express.Router();

  // Route to get all currency categories
  router.get(
    "/allcurrencyCategory",
    getAllAdminCurrencyCategories(adminDbConnection)
  );

  // Route to get all expense categories
  router.get(
    "/allexpenseCategory",
    getAllAdminExpenseCategories(adminDbConnection)
  );

  // Route to get all income categories
  router.get(
    "/allincomeCategory",
    getAllAdminIncomeCategories(adminDbConnection)
  );

  return router;
};

export default adminCategoryRoutes;
