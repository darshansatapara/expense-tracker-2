import React, { useState } from "react";
import { TabButton } from "../commonComponent/TabButton.jsx";
import ExpenseAnalysis from "./ExpenseAnalysis.jsx";
import IncomeAnalysis from "./IncomeAnalysis.jsx";
import { ChevronDown, Calendar } from "lucide-react";

const Analysis = () => {
  const [year, setYear] = useState("2025"); // Default year
  const [month, setMonth] = useState("04"); // Default month (April)
  const [activeTab, setActiveTab] = useState("expense"); // Toggle between expense and income
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const toggleDateDropdown = () => {
    setIsDateDropdownOpen(!isDateDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header with responsive design */}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6 text-gray-800">
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            Financial Analysis
          </span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          {/* Left side - Date selector */}
          <div className="relative">
            <button
              onClick={toggleDateDropdown}
              className="flex items-center justify-between w-full md:w-64 bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm hover:border-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <span className="font-medium text-gray-700">
                  {months[parseInt(month) - 1]} {year}
                </span>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDateDropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="Enter year"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {months.map((monthName, i) => (
                      <option key={i} value={String(i + 1).padStart(2, "0")}>
                        {monthName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Tabs */}
          <div className="flex bg-gray-200 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("expense")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "expense"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === "income"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Income
            </button>
          </div>
        </div>

        {/* Content Section with Card Design */}
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-1">
              {activeTab === "expense" ? "Expense Analysis" : "Income Analysis"}
            </h2>
            <p className="text-sm text-gray-500">
              {months[parseInt(month) - 1]} {year}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            {activeTab === "expense" ? (
              <ExpenseAnalysis year={year} month={month} />
            ) : (
              <IncomeAnalysis year={year} month={month} />
            )}
          </div>
        </div>

        {/* Bottom Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-700 mb-1">Monthly Total</h3>
            <p className="text-2xl font-bold text-blue-600">$4,285.00</p>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === "expense" ? "Total expenses" : "Total income"} for {months[parseInt(month) - 1]}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-700 mb-1">Year to Date</h3>
            <p className="text-2xl font-bold text-green-600">$17,450.00</p>
            <p className="text-sm text-gray-500 mt-1">
              Total {activeTab === "expense" ? "expenses" : "income"} in {year}
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-gray-700 mb-1">Monthly Average</h3>
            <p className="text-2xl font-bold text-purple-600">$3,865.00</p>
            <p className="text-sm text-gray-500 mt-1">
              Average monthly {activeTab === "expense" ? "expense" : "income"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;