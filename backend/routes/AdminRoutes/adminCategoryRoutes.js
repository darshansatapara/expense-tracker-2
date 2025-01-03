import express from "express";
import {
  getAllAdminCurrencyCategories,
  getAllAdminCurrencyCategoriesIsActive,
  getAllAdminExpenseCategories,
  getAllAdminExpenseCategoriesIsActive,
  getAllAdminIncomeCategories,
  getAllAdminIncomeCategoriesIsActive,
  removeSoftDeleteExpenseCategories,
  removeSoftDeleteExpenseSubcategories,
  softDeleteAdminCurrencyCategories,
  softDeleteExpenseCategories,
  softDeleteExpenseSubcategories,
  updateExpenseCategoriesAndSubcategories,
} from "../../controllers/AdminController/adminCategoryController.js"; // Make sure this import path is correct

// Define the adminCategoryRoute
const adminCategoryRoutes = (adminDbConnection, userDbConnection) => {
  if (!adminDbConnection) {
    throw new Error("Admin database connection is undefined");
  }

  const router = express.Router();

  //***************************************************Expense route***************************************/
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
  // update the expense categories and sub categories by name (we can able to update only category or subcategory or both )
  router.put(
    "/updateExpenseCategoriesAndSubcategories",
    updateExpenseCategoriesAndSubcategories(adminDbConnection)
  );
  // remove soft delete(mean make active : true) only in expense "category" in admin and user database
  router.put(
    "/removeSoftDeleteExpenseCategories",
    removeSoftDeleteExpenseCategories(adminDbConnection, userDbConnection)
  );
  // remove soft delete(mean make active : true) only in expense "sub-category" in admin and user database
  router.put(
    "/removeSoftDeleteExpenseSubCategories",
    removeSoftDeleteExpenseSubcategories(adminDbConnection, userDbConnection)
  );

  // soft delete expense categories in admin database and user database
  router.delete(
    "/softDeleteExpenseCategories",
    softDeleteExpenseCategories(adminDbConnection, userDbConnection)
  );
  // soft delete expense Sub-categories in admin database and user database
  router.delete(
    "/softDeleteExpenseSubcategories",
    softDeleteExpenseSubcategories(adminDbConnection, userDbConnection)
  );

  //****************************************income route ***************************************************/
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

  //*****************************************currency route****************************************************/
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

  // make softdelete request to make currency categories active false and as per that we can also update user database
  router.delete(
    "/currencyCategorySoftDelete",
    softDeleteAdminCurrencyCategories(adminDbConnection, userDbConnection)
  );

  return router;
};

export default adminCategoryRoutes;
