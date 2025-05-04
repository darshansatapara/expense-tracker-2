import React, { useState, useEffect } from "react";
import { Table, Spin, Empty } from "antd";
import "antd/dist/reset.css"; // Ensure Ant Design styles are applied
import { TabButton } from "../commonComponent/TabButton.jsx";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";
const TableList = ({ today, yesterday, activeTab }) => {
  const [showData, setShowData] = useState([]);
  const [activeButton, setActiveButton] = useState("Today");
  const [loading, setLoading] = useState(false);
  const handleTodayClick = () => setActiveButton("Today");
  const handleYesterdayClick = () => setActiveButton("Yesterday");
  const [defaultCurrencySymbol, setDefaultCurrencySymbol] = useState("");
  const { currentUser } = userStore();
  const userId = currentUser?._id;

  const { fetchCurrencyAndBudget } = userCategoryStore();

  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      const defaultCurrency = await fetchCurrencyAndBudget(userId);

      setDefaultCurrencySymbol(defaultCurrency.defaultCurrency.symbol);
    };
    fetchDefaultCurrency();
  }, [fetchCurrencyAndBudget, userId]);

  // Update data based on the selected button
  useEffect(() => {
    setLoading(true);
    if (activeButton === "Today") {
      setShowData(today);
    } else {
      setShowData(yesterday);
    }
    setLoading(false);
  }, [activeButton, today, yesterday]);
  const data = showData?.data || [];
  const total = showData?.totals || {};

  // Filtered transactions based on activeTab (isExpense: true for Expense, false for Income)
  const formattedTransactions = data.flatMap((expenseGroup) =>
    [...expenseGroup.online, ...expenseGroup.offline].map((transaction) => ({
      ...transaction,
      key: transaction._id,
      amount: `${transaction.currency.symbol || ""}${parseFloat(
        transaction.amount || 0
      ).toFixed(2)}`,
      date: transaction.date || "N/A",
      category: transaction.category.name || "N/A",
      subcategory: transaction.subcategory?.name || "N/A", // Only for Expense
      mode: transaction.mode || "N/A",
    }))
  );

  // Define columns
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => <span>{amount}</span>,
    },
    {
      title: "Mode",
      dataIndex: "mode",
      key: "mode",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    ...(activeTab
      ? [
          {
            title: "Subcategory",
            dataIndex: "subcategory",
            key: "subcategory",
          },
        ]
      : []),
  ];
  return (
    <>
      <div className="flex items-center justify-between gap-5 mb-3">
        {/* Tab Buttons */}
        <div className="flex text-sm md:text-lg items-center gap-5 mb-3">
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
        {/* Total Amounts */}
        <div className="flex justify-between gap-3">
          <div className="hidden sm:hidden md:block lg:block">
            <div className="flex gap-5">
              <h3 className="text-md font-bold text-gray-700">
                Total Online:{" "}
                <span className="text-green-500 font-semibold">
                  {defaultCurrencySymbol}
                  {total.onlineTotal || 0}
                </span>
              </h3>
              <h3 className="text-md font-bold text-gray-700">
                Total Offline:{" "}
                <span className="text-green-500 font-semibold">
                  {defaultCurrencySymbol}
                  {total.offlineTotal || 0}
                </span>
              </h3>
            </div>
          </div>
          <div className="block sm:block md:hidden lg:block">
            <h3 className="text-sm md:text-md font-bold text-gray-700">
              Total:{" "}
              <span className="text-green-500 font-semibold">
                {defaultCurrencySymbol}
                {total.bothTotal || 0}
              </span>
            </h3>
          </div>
        </div>
      </div>
      {/* Table Section */}
      <div className="bg-white shadow-md rounded-lg p-2">
        <div className="overflow-x-auto">
          <Table
            dataSource={formattedTransactions}
            columns={columns}
            pagination={false}
            scroll={{ x: 700 }}
            locale={{
              emptyText: loading ? (
                <Spin className="h-[35vh]" size="large" />
              ) : (
                <Empty className="h-[25vh]" />
              ),
            }}
            rowClassName={(record, index) =>
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }
            className="w-full"
            style={{ height: "40vh" }}
          />
        </div>
      </div>
    </>
  );
};
export default TableList;
