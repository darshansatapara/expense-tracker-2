import express from "express";
import {
  addUserExpense,
  deleteUserExpense,
  getExpenseAnalysis,
  getUserExpense,
  updateUserExpense,
} from "../../controllers/UserController/userExpenseController.js";

const userExpenseRoute = (userDbConnection, adminDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }
  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.post("/addExpense", addUserExpense(userDbConnection));
  router.get(
    "/getExpenses/:userId/:startDate/:endDate",
    getUserExpense(userDbConnection, adminDbConnection)
  );
  router.get(
    "/getExpensesAnalysis/:userId/:startDate/:endDate",
    getExpenseAnalysis(userDbConnection, adminDbConnection)
  );

  router.put(
    "/updateExpense/:userId/:expenseDate",
    updateUserExpense(userDbConnection)
  );
  router.delete(
    "/deleteExpense/:userId/:expenseDate",
    deleteUserExpense(userDbConnection)
  );

  return router;
};
export default userExpenseRoute;
