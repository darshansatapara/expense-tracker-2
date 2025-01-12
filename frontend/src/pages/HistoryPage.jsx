import React, { useState } from "react";
import dayjs from "dayjs";
import { HistoryEntry } from "../components/HistoryPageComponent/HistoryEntry";
import DateRangeSelector from "../components/InputComponents/DateRangeSelector";
import { TabButton } from "../components/commonComponent/TabButton";

const HistoryPage = () => {
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs().endOf("month"),
  ]);
  const [activeTab, setActiveTab] = useState("Expense");

  const toggleExpand = (index) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const dummyData = [
    {
      date: "01-01-2025",
      offlineTotal: 10000,
      onlineTotal: 10000,
      transactions: [
        {
          amount: 100,
          category: "Travel",
          subCategory: "Rixa",
        },
        {
          amount: 100,
          category: "Travel",
          subCategory: "Rixa",
        },
      ],
    },
    {
      date: "02-01-2025",
      offlineTotal: 10000,
      onlineTotal: 10000,
      transactions: [
        {
          amount: 100,
          category: "Travel",
          subCategory: "Rixa",
        },
      ],
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-4 md:p-6 max-w-full md:max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
            <TabButton
              label="Expense"
              isActive={activeTab === "Expense"}
              onClick={() => setActiveTab("Expense")}
              className="mb-2 md:mb-0"
            />
            <TabButton
              label="Income"
              isActive={activeTab === "Income"}
              onClick={() => setActiveTab("Income")}
              className="mb-2 md:mb-0"
            />
          </div>
          <DateRangeSelector
            defaultValue={dateRange}
            onChange={(range) => setDateRange(range)}
            className="w-full md:w-auto"
          />
        </div>
        <div className="space-y-4">
          {dummyData.map((entry, index) => (
            <HistoryEntry
              key={index}
              entry={entry}
              isExpanded={expandedIndexes.includes(index)}
              toggleExpand={() => toggleExpand(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
