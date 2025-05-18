import nodeCron from "node-cron";
import storeRates from "../controllers/CommonController/currencyDailyRateController.js";

export const CurrencyDailyRateJob = (adminDbConnection) => {
  console.log("✅ Currency update job scheduled to run daily at 00:30 AM IST.");

  nodeCron.schedule(
    "00 1 * * *",
    async () => {
      console.log("🔄 Running scheduled currency rate update...");
      try {
        const today = new Date();
        const formattedDate = `${today
          .getDate()
          .toString()
          .padStart(2, "0")}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${today.getFullYear()}`;

        await storeRates(adminDbConnection, formattedDate);
        console.log("✅ Currency rates updated successfully.");
      } catch (error) {
        console.error("❌ Error updating currency rates:", error);
      }
    },
    {
      timezone: "Asia/Kolkata", // Set timezone to Indian Standard Time (IST)
    }
  );
};
