import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { Calendar, DollarSign, BarChart2 } from "lucide-react";
import useUserIncomeStore from "../store/UserStore/userIncomeStore.js"; // Adjust path
import useUserExpenseStore from "../store/UserStore/userExpenseStore.js"; // Adjust path
import PieChart from "../components/commonComponent/PieChart.jsx";
import LineChart from "../components/commonComponent/LineChart.jsx";
import DataTable from "../components/commonComponent/DataTable.jsx";
import { TabButton } from "../components/commonComponent/TabButton.jsx"; // Adjust path

// Date Range Selector Component
const DateRangeSelector = ({ startValue, endValue, onChange }) => {
  const firstDayOfCurrentMonth = dayjs().startOf("month");
  const lastDayOfCurrentMonth = dayjs().endOf("month");
  const disabledStartDate = (startValue) => (!startValue || !endValue ? false : startValue.valueOf() > endValue.valueOf());
  const disabledEndDate = (endValue) => (!endValue || !startValue ? false : endValue.valueOf() <= startValue.valueOf());

  const handleStartChange = (value) => onChange && onChange([value || firstDayOfCurrentMonth, endValue]);
  const handleEndChange = (value) => onChange && onChange([startValue, value || lastDayOfCurrentMonth]);

  return (
    <div className="flex flex-row items-center justify-center space-x-4 w-full lg:w-fit">
      <DatePicker
        disabledDate={disabledStartDate}
        format="DD-MM-YYYY"
        value={startValue}
        placeholder="Start Date"
        onChange={handleStartChange}
        className="border border-gray-200 rounded-lg p-2 w-40 bg-white shadow-sm focus-within:border-blue-500"
      />
      <DatePicker
        disabledDate={disabledEndDate}
        format="DD-MM-YYYY"
        value={endValue}
        placeholder="End Date"
        onChange={handleEndChange}
        className="border border-gray-200 rounded-lg p-2 w-40 bg-white shadow-sm focus-within:border-blue-500"
      />
    </div>
  );
};

// Analysis Section Component
const AnalysisSection = ({ type, analysisData, monthlyIncomeData, monthlyExpenseData, startDate, endDate }) => {
  console.log("Rendering AnalysisSection with type:", type); // Debug render
  console.log("Analysis Data:", analysisData); // Debug analysis data
  console.log("Monthly Income Data:", monthlyIncomeData); // Debug monthly income
  console.log("Monthly Expense Data:", monthlyExpenseData); // Debug monthly expense

  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const currencyTotals = [
    { currency: "Indian Rupee (₹)", total: analysisData?.[type === "expense" ? "totalExpense" : "totalIncome"]?.amount || "0.00" },
    { currency: "US Dollar ($)", total: "$0.00" }, // Placeholder, adjust if needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCurrencyIndex((prevIndex) => (prevIndex + 1) % currencyTotals.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [currencyTotals.length]);

  const categoryData = analysisData?.categoryBreakdown?.map((item) => ({
    index: item.index,
    category: item.category,
    total: `${item.percentage}%`,
  })) || [];

  const currencyUsageData = {
    labels: analysisData?.currencyBreakdown?.map((item) => item.currency) || [],
    data: analysisData?.currencyBreakdown?.map((item) => item.percentage) || [],
    total: analysisData?.[type === "expense" ? "totalExpense" : "totalIncome"]?.amount
      ? `${analysisData[type === "expense" ? "totalExpense" : "totalIncome"].currency}${analysisData[type === "expense" ? "totalExpense" : "totalIncome"].amount}`
      : "₹0.00",
  };

  const lineChartData = {
    labels:
      (type === "income"
        ? monthlyIncomeData?.map((item) => item.monthName)
        : monthlyExpenseData?.map((item) => item.monthName)) ||
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      type === "income"
        ? {
            label: "Income",
            data: monthlyIncomeData?.map((item) => parseFloat(item.total)) || Array(12).fill(0),
            borderColor: "rgba(34, 197, 94, 1)", // Green
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            fill: false,
          }
        : {
            label: "Expense",
            data: monthlyExpenseData?.map((item) => parseFloat(item.total)) || Array(12).fill(0),
            borderColor: "rgba(239, 68, 68, 1)", // Red
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            fill: false,
          },
    ],
  };
  console.log("Expense Data:", monthlyExpenseData); // Your original log
  console.log("Line Chart Data:", lineChartData); // Debug line chart data

  const title = type === "expense" ? "Expense" : "Income";
  console.log("Calculated title:", title); // Debug title
  const textColor = type === "expense" ? "text-red-600" : "text-green-600";
  const iconColor = type === "expense" ? "text-red-500" : "text-green-500";

  return (
    <div className="flex flex-col space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
        <h3 className={`text-2xl font-bold mb-4 ${textColor} flex items-center`}>
          <DollarSign className={`w-6 h-6 ${iconColor} mr-2`} />
          Total {title}
        </h3>
        <div className="flex items-center space-x-2">
          <p className="text-3xl font-extrabold text-gray-900 transition-all duration-500">
            {currencyTotals[currentCurrencyIndex].total}
          </p>
          <span className="text-sm text-gray-500">({currencyTotals[currentCurrencyIndex].currency})</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Currency Usage</h3>
          <PieChart labels={currencyUsageData.labels} data={currencyUsageData.data} title="Currency Usage" total={currencyUsageData.total} />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Category Usage</h3>
          <PieChart labels={categoryData.map((item) => item.category)} data={categoryData.map((item) => parseFloat(item.total))} title="Category Usage" total={currencyUsageData.total} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Category Breakdown</h3>
        <DataTable data={categoryData} headers={["Index", "Category", "Total"]} />
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Yearly {title} Trend</h3>
        <LineChart data={lineChartData} />
      </div>
    </div>
  );
};

// Main Analysis Page Component
const AnalysisPage = () => {
  const [startValue, setStartValue] = useState(dayjs().startOf("month"));
  const [endValue, setEndValue] = useState(dayjs().endOf("month"));
  const [activeTab, setActiveTab] = useState("income"); // Default to income tab

  // Income store
  const { userIncomes, monthlyIncomeTotals, getIncomeAnalysis, getMonthlyIncome, loading: incomeLoading } = useUserIncomeStore();
  // Expense store
  const { expenseAnalysis, monthlyExpenseTotals, fetchExpenseAnalysis, getMonthlyExpenseTotals, loading: expenseLoading } = useUserExpenseStore();

  const userId = "677bc096bd8c6f677ef507d3"; // Replace with actual user ID
  const professionId = "6774e0884930e249cf39daa0"; // Replace with actual profession ID
  const year = startValue.year();

  useEffect(() => {
    console.log("useEffect triggered with startValue:", startValue.format("YYYY-MM-DD"), "endValue:", endValue.format("YYYY-MM-DD"));
    console.log("Calling getIncomeAnalysis with userId:", userId, "startDate:", startValue.format("YYYY-MM-DD"), "endDate:", endValue.format("YYYY-MM-DD"), "professionId:", professionId);
    getIncomeAnalysis(userId, startValue.format("YYYY-MM-DD"), endValue.format("YYYY-MM-DD"), professionId);
    console.log("Calling fetchExpenseAnalysis with userId:", userId, "startDate:", startValue.format("YYYY-MM-DD"), "endDate:", endValue.format("YYYY-MM-DD"));
    fetchExpenseAnalysis(userId, startValue.format("YYYY-MM-DD"), endValue.format("YYYY-MM-DD"));
    console.log("Calling getMonthlyIncome with userId:", userId, "year:", year);
    getMonthlyIncome(userId, year);
    console.log("Calling getMonthlyExpenseTotals with userId:", userId, "year:", year);
    getMonthlyExpenseTotals(userId, year);
  }, [startValue, endValue, getIncomeAnalysis, fetchExpenseAnalysis, getMonthlyIncome, getMonthlyExpenseTotals]);

  const handleDateRangeChange = ([start, end]) => {
    console.log("Date range changed to:", [start?.format("YYYY-MM-DD"), end?.format("YYYY-MM-DD")]);
    setStartValue(start || dayjs().startOf("month"));
    setEndValue(end || dayjs().endOf("month"));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-800">
      {/* Header */}
      <div className="mb-6 text-center md:text-left px-4">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
          Analyze Your Data :-
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Gain insights into your income and expenses
        </p>
      </div>

      {/* Date Selector + Tabs */}
      <div className="w-full px-4 md:px-8">
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4 ">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4 md:mb-0">
              <Calendar className="w-6 h-6 text-blue-500 mr-2" />
              Select Date Range
            </h2>
            <DateRangeSelector
              startValue={startValue}
              endValue={endValue}
              onChange={handleDateRangeChange}
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <TabButton
              label="Income"
              isActive={activeTab === "income"}
              onClick={() => setActiveTab("income")}
            />
            <TabButton
              label="Expense"
              isActive={activeTab === "expense"}
              onClick={() => setActiveTab("expense")}
            />
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="w-full px-4 md:px-8 mt-6 ml-0 float-start">
        {incomeLoading || expenseLoading ? (
          <div className="text-center text-gray-600 py-10">Loading...</div>
        ) : (
          <div className="w-full px-5 md:px-8 ">
            {activeTab === "income" && (
              <AnalysisSection
                type="income"
                analysisData={userIncomes}
                monthlyIncomeData={monthlyIncomeTotals}
                monthlyExpenseData={monthlyExpenseTotals}
                startDate={startValue}
                endDate={endValue}
              />
            )}
            {activeTab === "expense" && (
              <AnalysisSection
                type="expense"
                analysisData={expenseAnalysis}
                monthlyIncomeData={monthlyIncomeTotals}
                monthlyExpenseData={monthlyExpenseTotals}
                startDate={startValue}
                endDate={endValue}
              />
            )}
          </div>
        )}
      </div>

      {/* Summary Cards - Uncomment when needed */}
      {/*
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        <SummaryCard
          title="Expense Total"
          icon={<DollarSign className="w-6 h-6 text-red-500 mr-2" />}
          value={
            expenseAnalysis?.totalExpense
              ? `${expenseAnalysis.totalExpense.currency}${expenseAnalysis.totalExpense.amount}`
              : "₹0.00"
          }
          note={`${startValue.format("DD-MM-YYYY")} to ${endValue.format("DD-MM-YYYY")}`}
          color="red"
        />
        <SummaryCard
          title="Income Total"
          icon={<DollarSign className="w-6 h-6 text-green-500 mr-2" />}
          value={
            userIncomes?.totalIncome
              ? `${userIncomes.totalIncome.currency}${userIncomes.totalIncome.amount}`
              : "₹0.00"
          }
          note={`${startValue.format("DD-MM-YYYY")} to ${endValue.format("DD-MM-YYYY")}`}
          color="green"
        />
        <SummaryCard
          title="Net Balance"
          icon={<BarChart2 className="w-6 h-6 text-blue-500 mr-2" />}
          value={
            expenseAnalysis?.totalExpense && userIncomes?.totalIncome
              ? `${expenseAnalysis.totalExpense.currency}${(
                  parseFloat(userIncomes.totalIncome.amount) -
                  parseFloat(expenseAnalysis.totalExpense.amount)
                ).toFixed(2)}`
              : "₹0.00"
          }
          note="Income - Expenses"
          color="blue"
        />
      </div>
      */}
    </div>
  );
};

export default AnalysisPage;