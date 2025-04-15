import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { DollarSign, ChevronRight } from "lucide-react";
import useUserIncomeStore from "../store/UserStore/userIncomeStore.js";
import useUserExpenseStore from "../store/UserStore/userExpenseStore.js";
import PieChart from "../components/commonComponent/PieChart.jsx";
import LineChart from "../components/commonComponent/LineChart.jsx";
import DataTable from "../components/commonComponent/DataTable.jsx";
import { TabButton } from "../components/commonComponent/TabButton.jsx";
import DateRangeSelector from "../components/InputComponents/DateRangeSelector.jsx";

// Currency Slider Card Component (Unchanged)
const CurrencySliderCard = ({ type, currencyTotals, isSmallScreen }) => {
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);

  const isValidCurrencyTotals =
    Array.isArray(currencyTotals) && currencyTotals.length > 0;

  useEffect(() => {
    if (!isValidCurrencyTotals) return;

    const interval = setInterval(() => {
      setCurrentCurrencyIndex(
        (prevIndex) => (prevIndex + 1) % currencyTotals.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isValidCurrencyTotals, currencyTotals?.length]);

  const handleNextCurrency = () => {
    if (isValidCurrencyTotals) {
      setCurrentCurrencyIndex(
        (prevIndex) => (prevIndex + 1) % currencyTotals.length
      );
    }
  };

  if (!isValidCurrencyTotals) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all h-full">
        <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-800 flex items-center">
          <DollarSign className="w-4 md:w-6 h-4 md:h-6 text-blue-500 mr-1 md:mr-2" />
          {type === "income" ? "Income" : "Expense"} Currency Breakdown
        </h3>
        <Skeleton height={40} width={100} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all h-full">
      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-800 flex items-center">
        <DollarSign className="w-4 md:w-6 h-4 md:h-6 text-blue-500 mr-1 md:mr-2" />
        {type === "income" ? "Income" : "Expense"} Currency Breakdown
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base md:text-3xl font-extrabold text-gray-900">
            {currencyTotals[currentCurrencyIndex]?.total || "₹0.00"}
          </p>
          <span className="text-xs md:text-sm text-gray-500">
            ({currencyTotals[currentCurrencyIndex]?.currency || "INR (₹)"})
          </span>
        </div>
        <button
          onClick={handleNextCurrency}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

// Skeleton Component for Analysis Section
const AnalysisSectionSkeleton = ({ isSmallScreen }) => {
  return (
    <div className="p-4 md:p-6 border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Skeleton height={100} />
              <Skeleton height={100} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <Skeleton height={200} />
              <Skeleton height={200} />
            </div>
          </div>
          <div className="lg:self-start lg:h-full">
            <Skeleton height={300} />
          </div>
        </div>
        <Skeleton height={300} />
      </div>
    </div>
  );
};

// Analysis Section Component
const AnalysisSection = ({
  activeTab,
  analysisData,
  monthlyIncomeTotals,
  monthlyExpenseTotals,
  isSmallScreen,
  selectedYear,
  setSelectedYear,
}) => {
  const title = activeTab === "expense" ? "Expense" : "Income";
  const textColor = activeTab === "expense" ? "text-red-600" : "text-green-600"; // Fixed typo "roe"
  const iconColor = activeTab === "expense" ? "text-red-500" : "text-green-500";

  const currencyTotals =
    analysisData?.currencyBreakdown?.length > 0
      ? analysisData.currencyBreakdown.map((item) => ({
        currency: item.currency || "INR (₹)",
        total: item.total
          ? `${item.symbol}${parseFloat(item.total).toFixed(2)}`
          : "₹0.00",
      }))
      : [{ currency: "INR (₹)", total: "₹0.00" }];

  const categoryData =
    analysisData?.categoryBreakdown?.length > 0
      ? analysisData.categoryBreakdown.map((item) => ({
        index: item.index || 0,
        category: item.category || "Uncategorized",
        total: item.percentage
          ? `${parseFloat(item.percentage).toFixed(2)}%`
          : "0.00%",
      }))
      : [];

  const currencyUsageData = {
    labels:
      analysisData?.currencyBreakdown?.length > 0
        ? analysisData.currencyBreakdown.map((item) => item.currency)
        : ["INR (₹)"],
    data:
      analysisData?.currencyBreakdown?.length > 0
        ? analysisData.currencyBreakdown.map((item) =>
          parseFloat(item.percentage || 0)
        )
        : [0],
    total: analysisData?.[
      activeTab === "expense" ? "totalExpense" : "totalIncome"
    ]?.amount
      ? `${analysisData[activeTab === "expense" ? "totalExpense" : "totalIncome"]
        .currency
      }${parseFloat(
        analysisData[activeTab === "expense" ? "totalExpense" : "totalIncome"]
          .amount
      ).toFixed(2)}`
      : "₹0.00",
  };

  const years = Array.from(
    { length: dayjs().year() - 1999 },
    (_, i) => dayjs().year() - i
  );

  const lineChartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      activeTab === "income"
        ? {
          label: `Income ${selectedYear}`,
          data: Array(12)
            .fill(0)
            .map((_, index) => {
              const month = monthlyIncomeTotals?.find(
                (item) => item.monthNumber === index + 1
              );
              return month ? parseFloat(month.total || 0) : 0;
            }),
          borderColor: "rgba(34, 197, 94, 1)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          fill: false,
        }
        : {
          label: `Expense ${selectedYear}`,
          data: Array(12)
            .fill(0)
            .map((_, index) => {
              const month = monthlyExpenseTotals?.find(
                (item) => item.monthNumber === index + 1
              );
              return month ? parseFloat(month.total || 0) : 0;
            }),
          borderColor: "rgba(239, 68, 68, 1)",
          backgroundColor: "rgba(239, 68, 68, 0.2)",
          fill: false,
        },
    ],
  };

  return (
    <div className="p-4 md:p-6 border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3
                  className={`text-lg md:text-2xl font-bold mb-2 md:mb-4 ${textColor} flex items-center`}
                >
                  <DollarSign
                    className={`w-4 md:w-6 h-4 md:h-6 ${iconColor} mr-1 md:mr-2`}
                  />
                  Total {title}
                </h3>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <p className="text-base md:text-3xl font-extrabold text-gray-900">
                    {analysisData?.[
                      activeTab === "expense" ? "totalExpense" : "totalIncome"
                    ]?.amount
                      ? `${analysisData[
                        activeTab === "expense"
                          ? "totalExpense"
                          : "totalIncome"
                      ].currency
                      }${parseFloat(
                        analysisData[
                          activeTab === "expense"
                            ? "totalExpense"
                            : "totalIncome"
                        ].amount
                      ).toFixed(2)}`
                      : "₹0.00"}
                  </p>
                  <span className="text-xs md:text-sm text-gray-500">
                    (
                    {analysisData?.[
                      activeTab === "expense" ? "totalExpense" : "totalIncome"
                    ]?.currency || "INR (₹)"}
                    )
                  </span>
                </div>
              </div>
              <CurrencySliderCard
                type={activeTab}
                currencyTotals={currencyTotals}
                isSmallScreen={isSmallScreen}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
                  Currency Usage ({selectedYear})
                </h3>
                <PieChart
                  labels={currencyUsageData.labels}
                  data={currencyUsageData.data}
                  title={`Currency Usage (${selectedYear})`}
                  total={currencyUsageData.total}
                  isSmallScreen={isSmallScreen}
                />
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
                  Category Usage ({selectedYear})
                </h3>
                <PieChart
                  labels={categoryData.map((item) => item.category)}
                  data={categoryData.map((item) =>
                    parseFloat(item.total.replace("%", ""))
                  )} // Convert percentage string to float
                  title={`Category Usage (${selectedYear})`}
                  total={currencyUsageData.total}
                  isSmallScreen={isSmallScreen}
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all lg:self-start lg:h-full">
            <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
              Category Breakdown
            </h3>
            <DataTable
              data={categoryData}
              headers={["Index", "Category", "Total"]}
              defaultPageSize={15}
            />
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
          <div className="flex items-center gap-2 mb-4">
            <label
              htmlFor="year-select"
              className="text-sm md:text-base font-medium text-gray-800"
            >
              Select Year:
            </label>
            <div className="relative w-[150px] md:w-[180px]">
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="appearance-none w-full border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
            {selectedYear} - Yearly {title} Trend
          </h3>
          <LineChart
            data={lineChartData}
            title={`${selectedYear} - ${title} Monthly Trend`}
          />
        </div>
      </div>
    </div>
  );
};

// Main Analysis Page Component
const AnalysisPage = () => {
  const [startValue, setStartValue] = useState(dayjs().startOf("month"));
  const [endValue, setEndValue] = useState(dayjs().endOf("month"));
  const [activeTab, setActiveTab] = useState("expense"); // Default to expense
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1000
  );
  const [selectedYear, setSelectedYear] = useState(dayjs().year());
  const isSmallScreen = windowWidth <= 768;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    userIncomes,
    monthlyIncomeTotals,
    getIncomeAnalysis,
    getMonthlyIncome,
    loading: incomeLoading,
  } = useUserIncomeStore();
  const {
    expenseAnalysis,
    monthlyExpenseTotals,
    fetchExpenseAnalysis,
    getMonthlyExpenseTotals,
    loading: expenseLoading,
  } = useUserExpenseStore();

  const userId = "677bc096bd8c6f677ef507d3";
  const professionId = "6774e0884930e249cf39daa0";

  // Fetch analysis data based on active tab and date range
  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        if (activeTab === "income") {
          await getIncomeAnalysis(
            userId,
            startValue.format("DD-MM-YYYY"),
            endValue.format("DD-MM-YYYY"),
            professionId
          );
        } else {
          await fetchExpenseAnalysis(
            userId,
            startValue.format("DD-MM-YYYY"),
            endValue.format("DD-MM-YYYY")
          );
        }
      } catch (error) {
        console.error("Error fetching analysis data:", error);
      }
    };
    fetchAnalysisData();
  }, [
    activeTab,
    startValue,
    endValue,
    userId,
    professionId,
    getIncomeAnalysis,
    fetchExpenseAnalysis,
  ]);

  // Fetch monthly totals based on selected year
  useEffect(() => {
    const fetchMonthlyTotals = async () => {
      try {
        await Promise.all([
          getMonthlyIncome(userId, selectedYear),
          getMonthlyExpenseTotals(userId, selectedYear),
        ]);
      } catch (error) {
        console.error("Error fetching monthly totals:", error);
      }
    };
    fetchMonthlyTotals();
  }, [selectedYear, userId, getMonthlyIncome, getMonthlyExpenseTotals]);

  const handleDateRangeChange = ([start, end]) => {
    setStartValue(start || dayjs().startOf("month"));
    setEndValue(end || dayjs().endOf("month"));
  };

  const isLoading =
    (activeTab === "income" && incomeLoading) ||
    (activeTab === "expense" && expenseLoading);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 text-gray-800">
      <div className="w-full px-2 md:px-4 mb-6">
        <div className="p-4 md:p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
            <div className={`flex ${isSmallScreen ? "flex-col space-y-2" : "flex-row space-x-4"} border-b border-gray-200 pb-2`}>
              <TabButton
                label="Expense"
                isActive={activeTab === "expense"}
                onClick={() => setActiveTab("expense")}
              />
              <TabButton
                label="Income"
                isActive={activeTab === "income"}
                onClick={() => setActiveTab("income")}
              />
            </div>
            <DateRangeSelector
              startValue={startValue}
              endValue={endValue}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <AnalysisSectionSkeleton isSmallScreen={isSmallScreen} />
      ) : (
        <div className="w-full px-2 md:px-4">
          {activeTab === "income" && userIncomes ? (
            <AnalysisSection
              activeTab={activeTab}
              analysisData={userIncomes}
              monthlyIncomeTotals={monthlyIncomeTotals || []}
              monthlyExpenseTotals={monthlyExpenseTotals || []}
              isSmallScreen={isSmallScreen}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          ) : activeTab === "expense" && expenseAnalysis ? (
            <AnalysisSection
              activeTab={activeTab}
              analysisData={expenseAnalysis}
              monthlyIncomeTotals={monthlyIncomeTotals || []}
              monthlyExpenseTotals={monthlyExpenseTotals || []}
              isSmallScreen={isSmallScreen}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
          ) : (
            <div className="text-center text-gray-600 py-4">
              No {activeTab} data available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;