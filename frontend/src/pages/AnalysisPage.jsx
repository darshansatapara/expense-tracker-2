import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { Calendar, DollarSign, BarChart2, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import useUserIncomeStore from "../store/UserStore/userIncomeStore.js";
import useUserExpenseStore from "../store/UserStore/userExpenseStore.js";
import PieChart from "../components/commonComponent/PieChart.jsx";
import LineChart from "../components/commonComponent/LineChart.jsx";
import DataTable from "../components/commonComponent/DataTable.jsx";
import { TabButton } from "../components/commonComponent/TabButton.jsx";

// Ultra-compact Date Range Selector Component
const DateRangeSelector = ({ startValue, endValue, onChange, isSmallScreen = false }) => {
  const firstDayOfCurrentMonth = dayjs().startOf("month");
  const lastDayOfCurrentMonth = dayjs().endOf("month");
  const disabledStartDate = (startValue) => (!startValue || !endValue ? false : startValue.valueOf() > endValue.valueOf());
  const disabledEndDate = (endValue) => (!endValue || !startValue ? false : endValue.valueOf() <= startValue.valueOf());

  const handleStartChange = (value) => onChange && onChange([value || firstDayOfCurrentMonth, endValue]);
  const handleEndChange = (value) => onChange && onChange([startValue, value || lastDayOfCurrentMonth]);

  return (
    <div className={`flex ${isSmallScreen ? 'flex-col space-y-2' : 'flex-row space-x-2'} items-center justify-center w-full`}>
      <DatePicker
        disabledDate={disabledStartDate}
        format="DD-MM-YY"
        value={startValue}
        placeholder="Start"
        onChange={handleStartChange}
        className="border border-gray-200 rounded-lg p-1 w-full text-xs bg-white shadow-sm focus-within:border-blue-500"
        inputStyle={{ fontSize: '11px', padding: '2px' }}
      />
      <DatePicker
        disabledDate={disabledEndDate}
        format="DD-MM-YY"
        value={endValue}
        placeholder="End"
        onChange={handleEndChange}
        className="border border-gray-200 rounded-lg p-1 w-full text-xs bg-white shadow-sm focus-within:border-blue-500"
        inputStyle={{ fontSize: '11px', padding: '2px' }}
      />
    </div>
  );
};

// Collapsible Section Component for tiny screens
const CollapsibleSection = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-2 overflow-hidden">
      <button
        className="w-full p-2 flex items-center justify-between text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          {icon}
          <h3 className="text-xs font-medium ml-1 truncate">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-gray-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="p-2 border-t border-gray-100">{children}</div>}
    </div>
  );
};

// Mini Currency Display
const MiniCurrencyDisplay = ({ currencyTotals, currentCurrencyIndex }) => {
  return (
    <div className="mb-1">
      <p className="text-sm font-bold text-gray-900">
        {currencyTotals[currentCurrencyIndex].total}
      </p>
      <span className="text-xs text-gray-500">
        ({currencyTotals[currentCurrencyIndex].currency})
      </span>
    </div>
  );
};

// Tiny Charts Component
const TinyChart = ({ type, data, title }) => {
  return (
    <div className="h-32 overflow-hidden">
      {type === "pie" ? (
        <PieChart 
          labels={data.labels} 
          data={data.data} 
          title={title} 
          total={data.total} 
          isSmallScreen={true}
        />
      ) : (
        <LineChart 
          data={data} 
          isSmallScreen={true}
        />
      )}
    </div>
  );
};

// Micro Data Table Component
const MicroDataTable = ({ data, headers }) => {
  if (!data || data.length === 0) {
    return <p className="text-xs text-gray-500">No data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className="py-1 px-1 text-left font-medium text-gray-600 bg-gray-50">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 3).map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-gray-100">
              <td className="py-1 px-1">{row.index || rowIndex + 1}</td>
              <td className="py-1 px-1 truncate max-w-16">{row.category}</td>
              <td className="py-1 px-1">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.length > 3 && (
        <p className="text-xs text-gray-500 mt-1 text-right">
          +{data.length - 3} more items
        </p>
      )}
    </div>
  );
};

// Responsive Analysis Section Component
const AnalysisSection = ({ type, analysisData, monthlyIncomeData, monthlyExpenseData, startDate, endValue, isSmallScreen = false }) => {
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);
  const currencyTotals = [
    { currency: "INR (₹)", total: analysisData?.[type === "expense" ? "totalExpense" : "totalIncome"]?.amount || "0.00" },
    { currency: "USD ($)", total: "$0.00" },
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
            borderColor: "rgba(34, 197, 94, 1)",
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            fill: false,
          }
        : {
            label: "Expense",
            data: monthlyExpenseData?.map((item) => parseFloat(item.total)) || Array(12).fill(0),
            borderColor: "rgba(239, 68, 68, 1)",
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            fill: false,
          },
    ],
  };

  const title = type === "expense" ? "Expense" : "Income";
  const textColor = type === "expense" ? "text-red-600" : "text-green-600";
  const iconColor = type === "expense" ? "text-red-500" : "text-green-500";

  // For ultra-small screens, use collapsible sections
  if (isSmallScreen) {
    return (
      <div className="flex flex-col space-y-2">
        {/* Mini Total Card */}
        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <h3 className={`text-xs font-medium ${textColor} flex items-center mb-1`}>
            <DollarSign className={`w-3 h-3 ${iconColor} mr-1`} />
            Total {title}
          </h3>
          <MiniCurrencyDisplay currencyTotals={currencyTotals} currentCurrencyIndex={currentCurrencyIndex} />
        </div>

        {/* Currency Usage - Collapsible */}
        <CollapsibleSection 
          title="Currency Usage" 
          icon={<DollarSign className="w-3 h-3 text-blue-500" />}
        >
          <TinyChart type="pie" data={currencyUsageData} title="Currency" />
        </CollapsibleSection>

        {/* Category Usage - Collapsible */}
        <CollapsibleSection 
          title="Category Usage" 
          icon={<BarChart2 className="w-3 h-3 text-blue-500" />}
        >
          <TinyChart type="pie" data={{
            labels: categoryData.map((item) => item.category),
            data: categoryData.map((item) => parseFloat(item.total)),
            total: currencyUsageData.total
          }} title="Categories" />
        </CollapsibleSection>

        {/* Category Breakdown Table - Collapsible */}
        <CollapsibleSection 
          title="Category Breakdown" 
          icon={<Menu className="w-3 h-3 text-blue-500" />}
        >
          <MicroDataTable data={categoryData} headers={["#", "Category", "%"]} />
        </CollapsibleSection>

        {/* Yearly Trend - Collapsible */}
        <CollapsibleSection 
          title={`Yearly ${title} Trend`} 
          icon={<BarChart2 className="w-3 h-3 text-blue-500" />}
        >
          <TinyChart type="line" data={lineChartData} />
        </CollapsibleSection>
      </div>
    );
  }

  // Regular layout for larger screens (original code)
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
  const [activeTab, setActiveTab] = useState("income");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  // Check if screen is ultra-small (193px width)
  const isUltraSmallScreen = windowWidth <= 210;
  const isSmallScreen = windowWidth <= 400;

  // Update window width on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Income and expense store
  const { userIncomes, monthlyIncomeTotals, getIncomeAnalysis, getMonthlyIncome, loading: incomeLoading } = useUserIncomeStore();
  const { expenseAnalysis, monthlyExpenseTotals, fetchExpenseAnalysis, getMonthlyExpenseTotals, loading: expenseLoading } = useUserExpenseStore();

  const userId = "677bc096bd8c6f677ef507d3";
  const professionId = "6774e0884930e249cf39daa0";
  const year = startValue.year();

  useEffect(() => {
    getIncomeAnalysis(userId, startValue.format("YYYY-MM-DD"), endValue.format("YYYY-MM-DD"), professionId);
    fetchExpenseAnalysis(userId, startValue.format("YYYY-MM-DD"), endValue.format("YYYY-MM-DD"));
    getMonthlyIncome(userId, year);
    getMonthlyExpenseTotals(userId, year);
  }, [startValue, endValue, getIncomeAnalysis, fetchExpenseAnalysis, getMonthlyIncome, getMonthlyExpenseTotals]);

  const handleDateRangeChange = ([start, end]) => {
    setStartValue(start || dayjs().startOf("month"));
    setEndValue(end || dayjs().endOf("month"));
    if (isUltraSmallScreen) {
      setIsDatePickerOpen(false);
    }
  };

  const toggleDatePicker = () => {
    setIsDatePickerOpen(!isDatePickerOpen);
  };

  // Ultra-small screen layout
  if (isUltraSmallScreen) {
    return (
      <div className="bg-gray-50 p-1 min-h-screen">
        {/* Micro Header */}
        <div className="mb-2 text-center">
          <h1 className="text-lg font-bold text-blue-600">
            Data Analysis
          </h1>
        </div>

        {/* Date Toggle + Tabs */}
        <div className="mb-2">
          <div className="bg-white rounded-lg shadow-sm p-2 mb-2">
            {/* Date Toggle Button */}
            <button 
              onClick={toggleDatePicker}
              className="w-full text-xs flex justify-between items-center text-blue-500 mb-2"
            >
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Date Range
              </span>
              <span className="text-xs">
                {startValue.format("MM/DD")}-{endValue.format("MM/DD")}
              </span>
              {isDatePickerOpen ? 
                <ChevronUp className="w-3 h-3" /> : 
                <ChevronDown className="w-3 h-3" />
              }
            </button>

            {/* Collapsible Date Picker */}
            {isDatePickerOpen && (
              <div className="mb-2">
                <DateRangeSelector
                  startValue={startValue}
                  endValue={endValue}
                  onChange={handleDateRangeChange}
                  isSmallScreen={true}
                />
              </div>
            )}

            {/* Mini Tabs */}
            <div className="flex border-t border-gray-100 pt-1">
              <button
                className={`text-xs px-2 py-1 flex-1 ${activeTab === "income" ? "bg-blue-50 text-blue-600 rounded" : "text-gray-600"}`}
                onClick={() => setActiveTab("income")}
              >
                Income
              </button>
              <button
                className={`text-xs px-2 py-1 flex-1 ${activeTab === "expense" ? "bg-blue-50 text-blue-600 rounded" : "text-gray-600"}`}
                onClick={() => setActiveTab("expense")}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="w-full">
          {incomeLoading || expenseLoading ? (
            <div className="text-center text-xs text-gray-600 py-2">Loading...</div>
          ) : (
            <div className="w-full">
              {activeTab === "income" && (
                <AnalysisSection
                  type="income"
                  analysisData={userIncomes}
                  monthlyIncomeData={monthlyIncomeTotals}
                  monthlyExpenseData={monthlyExpenseTotals}
                  startDate={startValue}
                  endDate={endValue}
                  isSmallScreen={true}
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
                  isSmallScreen={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Small screen layout (between ultra-small and regular)
  if (isSmallScreen) {
    return (
      <div className="bg-gray-50 p-2 min-h-screen">
        {/* Compact Header */}
        <div className="mb-3 text-center">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">
            Analyze Your Data
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Income and expense insights
          </p>
        </div>

        {/* Date Selector + Tabs */}
        <div className="mb-3">
          <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
            <h2 className="text-sm font-medium text-gray-700 flex items-center mb-2">
              <Calendar className="w-4 h-4 text-blue-500 mr-1" />
              Date Range
            </h2>
            <DateRangeSelector
              startValue={startValue}
              endValue={endValue}
              onChange={handleDateRangeChange}
              isSmallScreen={true}
            />

            {/* Tabs */}
            <div className="flex space-x-2 border-t border-gray-200 mt-3 pt-2">
              <button
                className={`text-xs px-3 py-1 rounded-full ${activeTab === "income" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("income")}
              >
                Income
              </button>
              <button
                className={`text-xs px-3 py-1 rounded-full ${activeTab === "expense" ? "bg-blue-100 text-blue-600" : "text-gray-600"}`}
                onClick={() => setActiveTab("expense")}
              >
                Expense
              </button>
            </div>
          </div>
        </div>

        {/* Analysis Content */}
        <div className="w-full">
          {incomeLoading || expenseLoading ? (
            <div className="text-center text-sm text-gray-600 py-4">Loading...</div>
          ) : (
            <div className="w-full">
              {activeTab === "income" && (
                <AnalysisSection
                  type="income"
                  analysisData={userIncomes}
                  monthlyIncomeData={monthlyIncomeTotals}
                  monthlyExpenseData={monthlyExpenseTotals}
                  startDate={startValue}
                  endDate={endValue}
                  isSmallScreen={true}
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
                  isSmallScreen={true}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Original layout for regular screens
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
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 border-l-4">
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
          <div className="w-full px-5 md:px-8">
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
    </div>
  );
};

export default AnalysisPage;