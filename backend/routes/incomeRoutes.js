import express from "express";
import {
  addIncome,
  updateIncome,
  getIncomes,
} from "../controllers/incomeController.js";

const router = express.Router();

router.post("/addIncome", addIncome);
router.put("/updateIncome/:userId/:date", updateIncome);
router.get("/getIncomes/:userId/:startDate/:endDate", getIncomes);

export default router;
