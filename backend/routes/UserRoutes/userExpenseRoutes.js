import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
} from "../../controllers/UserController/userExpenseController.js";

const userExpenseRoute = (userDbConnection) => {
  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.post("/addExpense", (req, res) => addExpense(req, res, userDbConnection));
  router.get(
    "/getExpenses/:userId/:startDate/:endDate",
    (req, res) => getExpenses(req, res, userDbConnection)
  );
  router.put(
    "/updateExpense/:userId/:expenseDate",
    (req, res) => updateExpense(req, res, userDbConnection)
  );

  return router;
};
export default userExpenseRoute;
