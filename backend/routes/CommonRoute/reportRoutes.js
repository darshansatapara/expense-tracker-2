import express from "express";
import { getFinancialReportData } from "../../controllers/CommonController/reportApiController.js";

const reportRoute = (userDbConnection, adminDbConnection) => {
  const router = express.Router();


  router.get(
    "/financial-report/:userId/:year/:professionId",
    getFinancialReportData(userDbConnection, adminDbConnection)
  );

  return router;
};  

export default reportRoute;
