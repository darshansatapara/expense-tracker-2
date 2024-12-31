import express from "express";
import {
  addUserExpenseCategory,
  // addUserIncomeCategory,
  addUserCurrencyAndBudget,
  getUserExpenseCategories,
  getUserIncomeCategories,
  getUserCurrencyAndBudget,
  updateUserCurrencyAndBudget,
  updateUserExpenseCategories,
  // updateUserIncomeCategory,
} from "../../controllers/UserController/userCategoryController.js";

const userCategoryRoute = (userDbConnection, adminDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }

  const router = express.Router();

  // ******************************post routes******************************

  //add expense category
  router.post("/addExpenseCategory", addUserExpenseCategory(userDbConnection));
  // add income category
  // router.post("/addIncomeCategory", addUserIncomeCategory(userDbConnection));
  // add currency and budget
  router.post(
    "/addCurrencyAndBudget",
    addUserCurrencyAndBudget(userDbConnection)
  );

  // *******************************get routes********************************

  // Expense Categories Route
  router.get(
    "/expenseCategories/get/:userId",
    getUserExpenseCategories(userDbConnection, adminDbConnection)
  );

  // Income Categories Route(we can fatch the income category using the user profession and fetch category into the admin database)
  router.get(
    "/incomeCategories/get/:userId",
    getUserIncomeCategories(userDbConnection, adminDbConnection)
  );

  // Currency and Budget Route
  router.get(
    "/currencyAndBudget/get/:userId",
    getUserCurrencyAndBudget(userDbConnection, adminDbConnection)
  );

  //*************************************update routes*******************************/

  // Route to update user currency categories and budget

  // router.put(
  //   "/incomeCategory/updateIncomeCategory/:userId",
  //   updateUserIncomeCategory(userDbConnection, adminDbConnection)
  // );

  router.put(
    "/expenseCategory/updateExpenseCategory/:userId",
    updateUserExpenseCategories(userDbConnection, adminDbConnection)
  );
  router.put(
    "/currencyAndBudget/updateCurrency/:userId",
    updateUserCurrencyAndBudget(userDbConnection, adminDbConnection)
  );

  return router;
};

export default userCategoryRoute;
