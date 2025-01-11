import React, { useState, useEffect } from "react";
import { Table, Button } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are applied
import useUserExpenseStore from "../../store/userExpenseStore.js";
import { userStore } from "../../store/userStore.js";

const ExpenseList = () => {
  const { userExpenses, loading, error, fetchUserExpenses, clearUserExpenses } =
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
      console.log("Fetching expenses for:", userId, startDate, endDate);
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
  const formattedExpenses = userExpenses.flatMap((expenseGroup) =>
    [...expenseGroup.online, ...expenseGroup.offline].map((expense) => ({
      key: `${expenseGroup.date}-${expense.date}-${expense.amount}`,
      date: formatDate(expense.date),
      category: expense.category,
      subcategory: expense.subcategory,
      mode: expense.mode,
      note: expense.note,
      amount: `${expense.amount} ${expense.currency}`,
    }))
  );

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
      width: 50,
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
    <>
      <div className="flex justify-center gap-5">
        <Button onClick={handleTodayClick}>Today</Button>
        <Button onClick={handleYesterdayClick}>Yesterday</Button>
      </div>
      <div className="p-4 bg-gray-50 shadow-md rounded-lg">
        {!error && userExpenses.length > 0 ? (
          <div className="overflow-auto" style={{ maxHeight: "500px" }}>
            <Table
              dataSource={formattedExpenses}
              columns={columns}
              pagination={false}
              bordered
              className="rounded-lg"
            />
          </div>
        ) : error ? (
          <p className="text-center text-lg text-red-500">Error: {error}</p>
        ) : (
          <p className="text-center text-lg font-semibold">
            No expenses found.
          </p>
        )}
      </div>
    </>
  );
};

export default ExpenseList;
