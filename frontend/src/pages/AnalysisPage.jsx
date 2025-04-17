

import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { ChevronRight } from "lucide-react";
import useUserIncomeStore from "../store/UserStore/userIncomeStore.js";
import useUserExpenseStore from "../store/UserStore/userExpenseStore.js";
import PieChart from "../components/commonComponent/PieChart.jsx";
import LineChart from "../components/commonComponent/LineChart.jsx";
import DataTable from "../components/commonComponent/DataTable.jsx";
import { TabButton } from "../components/commonComponent/TabButton.jsx";
import DateRangeSelector from "../components/InputComponents/DateRangeSelector.jsx";
import { userStore } from "../store/UserStore/userAuthStore";

// Utility to debounce a function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Currency Slider Card Component
const CurrencySliderCard = ({
  type,
  currencyBreakdown,
  defaultCurrency,
  isSmallScreen,
}) => {
  const [currentCurrencyIndex, setCurrentCurrencyIndex] = useState(0);

  const isValidCurrencyBreakdown =
    Array.isArray(currencyBreakdown) && currencyBreakdown.length > 0;

  useEffect(() => {
    if (!isValidCurrencyBreakdown) return;

    const interval = setInterval(() => {
      setCurrentCurrencyIndex(
        (prevIndex) => (prevIndex + 1) % currencyBreakdown.length
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isValidCurrencyBreakdown, currencyBreakdown?.length]);

  const handleNextCurrency = () => {
    if (isValidCurrencyBreakdown) {
      setCurrentCurrencyIndex(
        (prevIndex) => (prevIndex + 1) % currencyBreakdown.length
      );
    }
  };

  if (!isValidCurrencyBreakdown) {
    return (
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all h-full">
        <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">
          {type === "income" ? "Income" : "Expense"} Currency Breakdown
        </h3>
        <Skeleton height={40} width={100} />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all h-full">
      <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-gray-800">
        {type === "income" ? "Income" : "Expense"} Currency Breakdown
      </h3>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base md:text-3xl font-extrabold text-gray-900">
            {defaultCurrency}
            {parseFloat(currencyBreakdown[currentCurrencyIndex]?.total).toFixed(
              2
            )}{" "}
            ({currencyBreakdown[currentCurrencyIndex]?.currency})
          </p>
          <p className="text-xs md:text-sm text-gray-500 mt-2">
            Each selected currency is shown, but the total is in Indian Rupees
            (₹).
          </p>
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
const AnalysisSectionSkeleton = ({ isSmallScreen }) => (
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
  const textColor = activeTab === "expense" ? "text-red-600" : "text-green-600";

  // Utility to simplify currency name to code
  const getCurrencyCode = (currencyName) => {
    const currencyMap = {
      "United States Dollar ($)": "USD",
      "Indian Rupee (₹)": "INR",
    };
    return (
      currencyMap[currencyName] ||
      currencyName?.slice(0, 3).toUpperCase() ||
      "INR"
    );
  };

  // Default currency
  const defaultCurrency =
    analysisData?.[activeTab === "expense" ? "totalExpense" : "totalIncome"]
      ?.currency || "₹";

  // Currency breakdown
  const currencyBreakdown = Array.isArray(analysisData?.currencyBreakdown)
    ? analysisData.currencyBreakdown.map((item) => {
        const percentage = item.percentage ? parseFloat(item.percentage) : 0;
        return {
          currency: item.currency || "INR",
          total: item.total ? parseFloat(item.total).toFixed(2) : "0.00",
          percentage: isNaN(percentage) ? 0 : percentage,
        };
      })
    : [{ currency: "INR", total: "0.00", percentage: 0 }];

  // Log currencyBreakdown for debugging
  console.log("currencyBreakdown:", currencyBreakdown);

  // Category breakdown
  const categoryData = Array.isArray(analysisData?.categoryBreakdown)
    ? analysisData.categoryBreakdown.map((item) => ({
        index: item.index || 0,
        category: item.category || "Uncategorized",
        total: item.percentage
          ? `${parseFloat(item.percentage).toFixed(2)}%`
          : "0.00%",
      }))
    : [];

  // Currency usage for PieChart
  const currencyUsageData = {
    labels: currencyBreakdown.map((item) => getCurrencyCode(item.currency)),
    data: currencyBreakdown.map((item) => item.percentage),
    total: analysisData?.[
      activeTab === "expense" ? "totalExpense" : "totalIncome"
    ]?.amount
      ? `${defaultCurrency}${parseFloat(
          analysisData[activeTab === "expense" ? "totalExpense" : "totalIncome"]
            .amount
        ).toFixed(2)}`
      : `${defaultCurrency}0.00`,
  };

  // Log currencyUsageData for debugging
  console.log("currencyUsageData:", currencyUsageData);

  // Available years for selection
  const years = Array.from(
    { length: dayjs().year() - 1999 },
    (_, i) => dayjs().year() - i
  );

  // Line chart data
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

  // Default currency for monthly totals
  const monthlyDefaultCurrency = (() => {
    const totals =
      activeTab === "income" ? monthlyIncomeTotals : monthlyExpenseTotals;
    const validEntry =
      totals?.find((item) => parseFloat(item.total) > 0) || totals?.[0];
    return validEntry?.currency || "₹";
  })();

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `${selectedYear} - ${title} Monthly Trend`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return `${monthlyDefaultCurrency}${value.toFixed(2)}`;
          },
        },
      },
    },
  };

  return (
    <div className="p-4 md:p-6 border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3
                  className={`text-lg md:text-2xl font-bold mb-2 md:mb-4 ${textColor}`}
                >
                  Total {title}
                </h3>
                <div className="flex items-center space-x-1 md:space-x-2">
                  <p className="text-base md:text-3xl font-extrabold text-gray-900">
                    {analysisData?.[
                      activeTab === "expense" ? "totalExpense" : "totalIncome"
                    ]?.amount
                      ? `${defaultCurrency}${parseFloat(
                          analysisData[
                            activeTab === "expense"
                              ? "totalExpense"
                              : "totalIncome"
                          ].amount
                        ).toFixed(2)}`
                      : `${defaultCurrency}0.00`}
                  </p>
                  <span className="text-xs md:text-sm text-gray-500">
                    (
                    {analysisData?.[
                      activeTab === "expense" ? "totalExpense" : "totalIncome"
                    ]?.currency || "INR"}
                    )
                  </span>
                </div>
                <p className="text-xs md:text-sm text-gray-500 mt-2">
                  Total is in {defaultCurrency}.
                </p>
              </div>
              <CurrencySliderCard
                type={activeTab}
                currencyBreakdown={currencyBreakdown}
                isSmallScreen={isSmallScreen}
                defaultCurrency={defaultCurrency}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
                  Currency Usage ({selectedYear})
                </h3>
                {currencyUsageData.labels.length > 0 ? (
                  <PieChart
                    labels={currencyUsageData.labels}
                    data={currencyUsageData.data}
                    title={`Currency Usage (${selectedYear})`}
                    total={currencyUsageData.total}
                    isSmallScreen={isSmallScreen}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    No currency usage data available
                  </p>
                )}
              </div>
              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
                <h3 className="text-base md:text-xl font-semibold mb-2 md:mb-4 text-gray-800">
                  Category Usage ({selectedYear})
                </h3>
                {categoryData.length > 0 ? (
                  <PieChart
                    labels={categoryData.map((item) => item.category)}
                    data={categoryData.map((item) =>
                      parseFloat(item.total.replace("%", ""))
                    )}
                    title={`Category Usage (${selectedYear})`}
                    total={currencyUsageData.total}
                    isSmallScreen={isSmallScreen}
                  />
                ) : (
                  <p className="text-sm text-gray-500">
                    No category usage data available
                  </p>
                )}
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
          <LineChart data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
    </div>
  );
};

// Main Analysis Page Component
const AnalysisPage = () => {
  const { currentUser } = userStore();
  const [filters, setFilters] = useState({
    startValue: dayjs().startOf("month"),
    endValue: dayjs().endOf("month"),
    selectedYear: dayjs().year(),
  });
  const [activeTab, setActiveTab] = useState("expense");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [cachedData, setCachedData] = useState({
    incomeTotals: {},
    expenseTotals: {},
  });
  const isSmallScreen = windowWidth <= 768;

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

  const userId = currentUser?._id;
  const professionId = currentUser?.profession;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch analysis data
  const fetchAnalysisData = debounce(async () => {
    try {
      if (activeTab === "income") {
        await getIncomeAnalysis(
          userId,
          filters.startValue.format("DD-MM-YYYY"),
          filters.endValue.format("DD-MM-YYYY"),
          professionId
        );
      } else {
        await fetchExpenseAnalysis(
          userId,
          filters.startValue.format("DD-MM-YYYY"),
          filters.endValue.format("DD-MM-YYYY")
        );
      }
    } catch (error) {
      console.error("Error fetching analysis data:", error);
    }
  }, 300);

  // Fetch monthly totals with caching
  const fetchMonthlyTotals = debounce(async (year) => {
    try {
      if (cachedData.incomeTotals[year] && cachedData.expenseTotals[year]) {
        return;
      }

      const [incomeData, expenseData] = await Promise.all([
        getMonthlyIncome(userId, year),
        getMonthlyExpenseTotals(userId, year),
      ]);

      setCachedData((prev) => ({
        incomeTotals: { ...prev.incomeTotals, [year]: incomeData },
        expenseTotals: { ...prev.expenseTotals, [year]: expenseData },
      }));
    } catch (error) {
      console.error("Error fetching monthly totals:", error);
    }
  }, 300);

  // Initial data fetch
  useEffect(() => {
    fetchAnalysisData();
    fetchMonthlyTotals(filters.selectedYear);
  }, [activeTab, filters.startValue, filters.endValue, userId, professionId]);

  console.log(expenseAnalysis);

  // Handle date range change
  const handleDateRangeChange = ([start, end]) => {
    setFilters((prev) => ({
      ...prev,
      startValue: start || dayjs().startOf("month"),
      endValue: end || dayjs().endOf("month"),
    }));
  };

  // Handle year change
  const handleYearChange = (year) => {
    setFilters((prev) => ({ ...prev, selectedYear: year }));
    fetchMonthlyTotals(year);
  };

  // Effective totals from cache or store
  const effectiveIncomeTotals =
    cachedData.incomeTotals[filters.selectedYear] || monthlyIncomeTotals || [];
  const effectiveExpenseTotals =
    cachedData.expenseTotals[filters.selectedYear] ||
    monthlyExpenseTotals ||
    [];

  const isInitialLoading =
    (activeTab === "income" && incomeLoading && !userIncomes) ||
    (activeTab === "expense" && expenseLoading && !expenseAnalysis);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 text-gray-800">
      <div className="w-full px-2 md:px-4 mb-6">
        <div className="p-4 md:p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
            <div
              className={`flex ${
                isSmallScreen ? "flex-col space-y-2" : "flex-row space-x-4"
              } border-b border-gray-200 pb-2`}
            >
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
              startValue={filters.startValue}
              endValue={filters.endValue}
              onChange={handleDateRangeChange}
            />
          </div>
        </div>
      </div>

      {isInitialLoading ? (
        <AnalysisSectionSkeleton isSmallScreen={isSmallScreen} />
      ) : (
        <div className="w-full px-2 md:px-4">
          {activeTab === "income" && userIncomes ? (
            <AnalysisSection
              activeTab={activeTab}
              analysisData={userIncomes}
              monthlyIncomeTotals={effectiveIncomeTotals}
              monthlyExpenseTotals={effectiveExpenseTotals}
              isSmallScreen={isSmallScreen}
              selectedYear={filters.selectedYear}
              setSelectedYear={handleYearChange}
            />
          ) : activeTab === "expense" && expenseAnalysis ? (
            <AnalysisSection
              activeTab={activeTab}
              analysisData={expenseAnalysis}
              monthlyIncomeTotals={effectiveIncomeTotals}
              monthlyExpenseTotals={effectiveExpenseTotals}
              isSmallScreen={isSmallScreen}
              selectedYear={filters.selectedYear}
              setSelectedYear={handleYearChange}
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
