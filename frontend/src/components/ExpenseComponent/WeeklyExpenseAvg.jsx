import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import dayjs from "dayjs"; // A library for date manipulation
import useUserExpenseStore from "../../store/UserStore/userExpenseStore.js";

const WeeklyAverageExpenses = () => {
  const { weeklyUserExpenses, loading, error, fetchUserWeeklyExpenses } =
    useUserExpenseStore();
  const userId = "677bc096bd8c6f677ef507d3";

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [averageOnline, setAverageOnline] = useState(0);
  const [averageOffline, setAverageOffline] = useState(0);

  // Calculate the start and end dates of the current week (Monday to Sunday)
  useEffect(() => {
    const now = dayjs();
    const weekStart = "13-01-2025"; // Start on Monday in "DD-MM-YYYY"
    const weekEnd = "19-01-2025"; // End on Sunday in "DD-MM-YYYY"

    console.log("Week Start:", weekStart); // Example Output: "22-01-2025"
    console.log("Week End:", weekEnd); // Example Output: "28-01-2025"

    setStartDate(weekStart); // Set start date in ISO format
    setEndDate(weekEnd); // Set end date in ISO format
  }, []);

  // Fetch expenses when startDate and endDate are ready
  useEffect(() => {
    console.log(startDate, endDate);
    if (startDate && endDate) {
      fetchUserWeeklyExpenses(userId, startDate, endDate);
    }

    // Cleanup expenses when component unmounts
    // return () => useUserExpenseStore.setState({ weeklyUserExpenses: [] });
  }, [startDate, endDate, fetchUserWeeklyExpenses, userId]);

  useEffect(() => {
    if (weeklyUserExpenses.length > 0) {
      let totalOnline = 0;
      let totalOffline = 0;
      let totalOnlineCount = 0;
      let totalOfflineCount = 0;

      // Iterate over each date object
      weeklyUserExpenses.forEach((expense) => {
        // Sum up all online expenses for the week
        if (expense.online?.length > 0) {
          totalOnline += expense.online.reduce(
            (acc, item) => acc + parseFloat(item.amount), // Ensure `amount` is treated as a number
            0
          );
          totalOnlineCount += expense.online.length;
        }

        // Sum up all offline expenses for the week
        if (expense.offline?.length > 0) {
          totalOffline += expense.offline.reduce(
            (acc, item) => acc + parseFloat(item.amount), // Ensure `amount` is treated as a number
            0
          );
          totalOfflineCount += expense.offline.length;
        }
      });

      // Calculate the averages
      const averageOnline =
        totalOnlineCount > 0 ? totalOnline / totalOnlineCount : 0;
      const averageOffline =
        totalOfflineCount > 0 ? totalOffline / totalOfflineCount : 0;

      setAverageOnline(averageOnline);
      setAverageOffline(averageOffline);
    }
  }, [weeklyUserExpenses]);

  return (
    <div className="bg-gray-100 flex flex-col h-[38vh] items-center p-4 rounded-md border gap-5">
      <h1 className="text-lg font-bold text-gray-700 mb-4">
        Weekly Average Expenses
      </h1>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : (
        <div className="flex flex-col md:flex-row justify-around align-middle items-center gap-5">
          {/* Average Online Expenses */}
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">
              Average Online:{" "}
            </h3>
            <p className="text-xl font-semibold text-blue-600">
              ₹{averageOnline.toFixed(2)}
            </p>
          </div>

          {/* Average Offline Expenses */}
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">
              Average Offline:{" "}
            </h3>
            <p className="text-xl font-semibold text-green-600">
              ₹{averageOffline.toFixed(2)}
            </p>
          </div>
          {/* Average Offline Expenses */}
          <div className="flex md:flex-col text-center gap-3">
            <h3 className="text-lg font-bold text-gray-700">
              Average Offline:{" "}
            </h3>
            <p className="text-xl font-semibold text-green-600">
              ₹{averageOffline.toFixed(2)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyAverageExpenses;
