import express from "express";
import {
  getAllAdminCurrencyCategories,
  getAllAdminCurrencyCategoriesIsActive,
  getAllAdminExpenseCategories,
  getAllAdminExpenseCategoriesIsActive,
  getAllAdminIncomeCategories,
  getAllAdminIncomeCategoriesIsActive,
  updateExpenseCategoriesAndSubcategories,
} from "../../controllers/AdminController/adminCategoryController.js"; // Make sure this import path is correct

// Define the adminCategoryRoute
const adminCategoryRoutes = (adminDbConnection) => {
  if (!adminDbConnection) {
    throw new Error("Admin database connection is undefined");
  }

  const router = express.Router();

  //******************************Expense route***********************/
  // Route to get all expense categories
  router.get(
    "/allexpenseCategory",
    getAllAdminExpenseCategories(adminDbConnection)
  );

  // get all expense categories which are active
  router.get(
    "/allexpenseCategoryIsActive",
    getAllAdminExpenseCategoriesIsActive(adminDbConnection)
  );

  router.put(
    "/updateExpenseCategoriesAndSubcategories",
    updateExpenseCategoriesAndSubcategories(adminDbConnection)
  );

  //*******************income route **************************/
  // Route to get all income categories
  router.get(
    "/allincomeCategory",
    getAllAdminIncomeCategories(adminDbConnection)
  );
  //get all income categories which are active
  router.get(
    "/allincomeCategoryIsActive",
    getAllAdminIncomeCategoriesIsActive(adminDbConnection)
  );

  //******************currency route********************/
  // Route to get all currency categories
  router.get(
    "/allcurrencyCategory",
    getAllAdminCurrencyCategories(adminDbConnection)
  );

  // get all currency categories which are active
  router.get(
    "/allcurrencyCategoryIsActive",
    getAllAdminCurrencyCategoriesIsActive(adminDbConnection)
  );
  return router;
};

export default adminCategoryRoutes;
