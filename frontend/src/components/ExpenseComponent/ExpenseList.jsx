import React, { useState, useEffect } from "react";
import { Table, Spin } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are applied
import useUserExpenseStore from "../../store/UserStore/userExpenseStore.js";
import { TabButton } from "../commonComponent/TabButton.jsx";
import { Empty } from "antd";

const ExpenseList = () => {
  const { userExpenses, loading, fetchUserExpenses } = useUserExpenseStore();

  const userId = "677bc096bd8c6f677ef507d3";

  // Manage start and end dates as local states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeButton, setActiveButton] = useState("Today");

  // Helper function to format date as DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Helper function to get today's date in DD-MM-YYYY format
  const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
  };

  // Helper function to get yesterday's date in DD-MM-YYYY format
  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return formatDate(yesterday);
  };

  // Set default to today's date on mount
  useEffect(() => {
    const today = "19-01-2025";
    //  getCurrentDate();
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Fetch expenses when userId, startDate, or endDate changes
  useEffect(() => {
    if (userId && startDate && endDate) {
      fetchUserExpenses(userId, startDate, endDate);
    }

    // Cleanup expenses when component unmounts
    return () => useUserExpenseStore.setState({ userExpenses: [] });
  }, [userId, startDate, endDate, fetchUserExpenses]);

  // Handle button clicks
  const handleTodayClick = () => {
    setActiveButton("Today");
    const today = getCurrentDate();
    setStartDate(today);
    setEndDate(today);
  };

  const handleYesterdayClick = () => {
    setActiveButton("Yesterday");
    const yesterday = getYesterdayDate();
    setStartDate(yesterday);
    setEndDate(yesterday);
  };

  // Combine online and offline expenses into a single array with a unique key
  const formattedExpenses =
    userExpenses.flatMap((expenseGroup) =>
      [...expenseGroup.online, ...expenseGroup.offline].map((expense) => ({
        key: expense._id,
        date: expense.date || "N/A",
        category: expense.category || "N/A",
        subcategory: expense.subcategory || "N/A",
        mode: expense.mode || "N/A",
        note: expense.note || "N/A",
        amount: expense.amount
          ? `${expense.amount} ${expense.currency || ""}`
          : "N/A",
      }))
    ) || [];

  // Calculate total expenses for online and offline
  const totalOnlineExpenses = userExpenses
    .flatMap((expenseGroup) => expenseGroup.online)
    .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0); // Convert string to number

  const totalOfflineExpenses = userExpenses
    .flatMap((expenseGroup) => expenseGroup.offline)
    .reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0); // Convert string to number

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
    },
    {
      title: "Method",
      dataIndex: "mode",
      key: "mode",
      width: 100,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      width: 120,
    },
    {
      title: "Subcategory",
      dataIndex: "subcategory",
      key: "subcategory",
      width: 120,
    },
  ];

  return (
    <>
      <div className="flex justify-center gap-5 mb-3">
        <TabButton
          label="Today"
          isActive={activeButton === "Today"}
          onClick={handleTodayClick}
        />
        <TabButton
          label="Yesterday"
          isActive={activeButton === "Yesterday"}
          onClick={handleYesterdayClick}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg ">
        <div className="overflow-auto">
          <Table
            dataSource={formattedExpenses.length > 0 ? formattedExpenses : []}
            columns={columns}
            pagination={false}
            scroll={{ x: 700 }}
            sticky
            size="middle"
            locale={{
              emptyText: loading ? (
                <Spin
                  className="h-[35.5vh] flex flex-col items-center justify-center"
                  size="large"
                />
              ) : (
                <Empty className="h-[35.5vh] flex flex-col items-center justify-center" />
              ),
            }} // Customize empty text
            className="rounded-lg"
            style={{ height: "50vh" }}
          />
        </div>
      </div>
      {/* Total Expenses Section */}
      <div className="flex flex-col ">
        <div className="flex flex-col md:flex-row justify-around items-center p-2 bg-gray-100 rounded-md border gap-3 md:gap-5">
          {/* Total Online Section */}
          <div className="flex text-center md:flex-col gap-5">
            <h3 className="text-lg font-bold text-gray-700">Total Online: </h3>
            <p className="text-lg font-semibold text-green-500">
              ₹{totalOnlineExpenses.toFixed(2)}
            </p>
          </div>
          {/* Total Offline Section */}
          <div className=" flex text-center md:flex-col gap-5">
            <h3 className="text-lg font-bold text-gray-700">Total Offline: </h3>
            <p className="text-lg font-semibold text-blue-500">
              ₹{totalOfflineExpenses.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExpenseList;
