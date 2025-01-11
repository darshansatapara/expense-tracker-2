import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are applied
import useUserExpenseStore from "../../store/userExpenseStore.js";

const ExpenseList = () => {
  const { userExpenses, loading, fetchUserExpenses, clearUserExpenses } =
    useUserExpenseStore();

  const userId = "67792e48b3085a94fc47b110";

  // Manage start and end dates as local states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    const today = getCurrentDate();
    setStartDate(today);
    setEndDate(today);
  }, []);

  // Fetch expenses when userId, startDate, or endDate changes
  useEffect(() => {
    if (userId && startDate && endDate) {
      fetchUserExpenses(userId, startDate, endDate);
    }

    // Cleanup expenses when component unmounts
    return () => clearUserExpenses();
  }, [userId, startDate, endDate, fetchUserExpenses, clearUserExpenses]);

  // Handle button clicks
  const handleTodayClick = () => {
    const today = getCurrentDate();
    setStartDate(today);
    setEndDate(today);
  };

  const handleYesterdayClick = () => {
    const yesterday = getYesterdayDate();
    setStartDate(yesterday);
    setEndDate(yesterday);
  };

  if (loading) {
    return <p className="text-center text-lg font-semibold">Loading...</p>;
  }

  // Combine online and offline expenses into a single array with a unique key
  const formattedExpenses =
    userExpenses.flatMap((expenseGroup) =>
      [...expenseGroup.online, ...expenseGroup.offline].map((expense) => ({
        key: `${expenseGroup.date}-${expense.date}-${expense.amount}`,
        date: formatDate(expense.date) || "N/A",
        category: expense.category || "N/A",
        subcategory: expense.subcategory || "N/A",
        mode: expense.mode || "N/A",
        note: expense.note || "N/A",
        amount: expense.amount
          ? `${expense.amount} ${expense.currency || ""}`
          : "N/A",
      }))
    ) || [];

  // Define columns for the Ant Design Table
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
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
    {
      title: "Method",
      dataIndex: "mode",
      key: "mode",
      width: 100,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      align: "right",
    },
  ];

  return (
    <div className="p-5 bg-gray-50 ">
      <div className="flex justify-center gap-5 mb-5">
        <Button onClick={handleTodayClick} className="rounded-lg">
          Today
        </Button>
        <Button onClick={handleYesterdayClick} className="rounded-lg">
          Yesterday
        </Button>
      </div>
      <div className="p-4 bg-white shadow-md rounded-lg">
        <div
          className="overflow-auto "
          style={{ maxHeight: "42vh", maxWidth: "120vw" }}
        >
          <Table
            dataSource={formattedExpenses.length > 0 ? formattedExpenses : []}
            columns={columns}
            pagination={false}
            bordered
            scroll={{ x: 700 }} // Enables horizontal scrolling
            className="rounded-lg"
          />
        </div>
        {formattedExpenses.length === 0 && (
          <p className="text-center text-lg font-semibold mt-4">
            No expenses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
