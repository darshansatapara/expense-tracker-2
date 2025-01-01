import express from "express";
import {
  addIncome,
  updateIncome,
  getIncomes,
} from "../../controllers/UserController/userIncomeController.js";

const userIncomeRoute = (userDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }
  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.post("/addIncome", addIncome(userDbConnection));
  router.put("/updateIncome/:userId/:date", updateIncome(userDbConnection));
  router.get(
    "/getIncomes/:userId/:startDate/:endDate",
    getIncomes(userDbConnection)
  );

  return router;
};
export default userIncomeRoute;
