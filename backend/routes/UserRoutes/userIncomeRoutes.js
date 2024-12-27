import express from "express";
import {
  addIncome,
  updateIncome,
  getIncomes,
} from "../../controllers/UserController/userIncomeController.js";

const userIncomeRoute = (userDbConnection) => {
  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.post("/addIncome", (req, res) =>
    addIncome(req, res, userDbConnection)
  );
  router.put("/updateIncome/:userId/:date", (req, res) =>
    updateIncome(req, res, userDbConnection)
  );
  router.get("/getIncomes/:userId/:startDate/:endDate", (req, res) =>
    getIncomes(req, res, userDbConnection)
  );

  return router;
};
export default userIncomeRoute;
