import express from "express";
import {
  addExpense,
  getExpenses,
  updateExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

router.post("/addExpense", addExpense);
router.get("/getExpenses/:userId/:startDate/:endDate", getExpenses);
router.put("/updateExpense/:userId/:expenseDate", updateExpense);

export default router;
