// src/components/ExpenseAnalysis.jsx
import React, { useState, useEffect } from "react";
import PieChart from "../commonComponent/PieChart.jsx";
import LineChart from "../commonComponent/LineChart.jsx";
import DataTable from "../commonComponent/DataTable.jsx";

const ExpenseAnalysis = ({ year, month }) => {
  // Static sample data for UI preview
  const expenseDateWiseData = Array.from({ length: 30 }, (_, i) => ({
    date: `${String(i + 1).padStart(2, "0")}-${month}-${year}`,
    total: Math.floor(Math.random() * 1000),
  }));
  const expenseCategoryData = [
    { category: "Travel", percentage: 40 },
    { category: "Food", percentage: 30 },
    { category: "Others", percentage: 30 },
  ];
  const expenseCurrencyData = { labels: ["Indian Rupee (₹)", "US Dollar ($)"], data: [80, 20], total: "₹5000.00" };
  const expenseGrowthData = {
    labels: Array.from({ length: 12 }, (_, i) => `Month ${i + 1}`),
    data: Array(12).fill(0).map(() => Math.floor(Math.random() * 1000 - 500)),
  };
  const expenseCurrencyUsageData = { labels: ["Indian Rupee (₹)", "US Dollar ($)"], data: [80, 20], total: "₹5000.00" };
  const currencyTotals = [
    { currency: "Indian Rupee (₹)", total: "₹4000.00" }, // Default currency (₹) first
    { currency: "US Dollar ($)", total: "$1000.00" },
  ];

  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0); // Start with default currency (₹)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCurrencyIndex((prevIndex) => (prevIndex + 1) % currencyTotals.length);
    }, 2000); // Slide every 2 seconds
    return () => clearInterval(interval);
  }, [currencyTotals.length]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Expense Card with Sliding Currency */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Total Expense ({month}/{year})</h3>
        <div className="h-48 flex items-center justify-center">
          <p className="text-2xl font-bold text-gray-800 transition-all duration-500">
            {currencyTotals[currentCurrencyIndex].total}
          </p>
        </div>
        <p className="text-center mt-2 text-gray-600">Sliding total by currency (2s interval)</p>
      </div>

      {/* Category Breakdown (Table) */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Category Breakdown</h3>
        <DataTable data={expenseCategoryData} headers={["Category", "Percentage"]} />
      </div>

      {/* Currency Breakdown (Pie Chart) */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Currency Breakdown</h3>
        <PieChart
          labels={expenseCurrencyData.labels}
          data={expenseCurrencyData.data}
          title="Currency Breakdown"
          total={expenseCurrencyData.total}
        />
      </div>

      {/* Monthly Growth */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-2">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Monthly Growth ({year})</h3>
        <LineChart labels={expenseGrowthData.labels} data={expenseGrowthData.data} title="Monthly Growth" />
      </div>

      {/* Currency Usage (Pie Chart) */}
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Currency Usage</h3>
        <PieChart
          labels={expenseCurrencyUsageData.labels}
          data={expenseCurrencyUsageData.data}
          title="Currency Usage"
          total={expenseCurrencyUsageData.total}
        />
      </div>
    </div>
  );
};

export default ExpenseAnalysis;