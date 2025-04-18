import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import {
  ChevronRight,
  TrendingUp,
  ArrowRightCircle,
  DollarSign,
  PieChart as PieChartIcon,
  BarChart2,
  Calendar,
} from "lucide-react";
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

// Card Component with Animation
const AnimatedCard = ({ children, className = "", delay = 0 }) => (
  <div
    className={`bg-white p-5 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:scale-102 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

// Improved Currency Slider Card Component
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
      <AnimatedCard delay={200}>
        <div className="flex items-center gap-3 mb-3">
          <DollarSign className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg md:text-xl font-bold text-gray-800">
            {type === "income" ? "Income" : "Expense"} Currency Breakdown
          </h3>
        </div>
        <Skeleton height={40} width={100} />
      </AnimatedCard>
    );
  }

  return (
    <AnimatedCard
      delay={200}
      className={`${
        type === "income"
          ? "bg-gradient-to-br from-green-50 to-white"
          : "bg-gradient-to-br from-red-50 to-white"
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <DollarSign
          className={`w-5 h-5 ${
            type === "income" ? "text-green-500" : "text-red-500"
          }`}
        />
        <h3 className="text-lg md:text-xl font-bold text-gray-800">
          {type === "income" ? "Income" : "Expense"} Currency Breakdown
        </h3>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-baseline">
          <p className="text-base md:text-3xl font-extrabold text-gray-900">
            {defaultCurrency}
            {parseFloat(currencyBreakdown[currentCurrencyIndex]?.total).toFixed(
              2
            )}
          </p>
          <span className="inline-block px-2 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-700  text-center">
            {currencyBreakdown[currentCurrencyIndex]?.currency}
          </span>
        </div>
        <button
          onClick={handleNextCurrency}
          className={`p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${
            type === "income"
              ? "bg-green-100 hover:bg-green-200"
              : "bg-red-100 hover:bg-red-200"
          }`}
        >
          <ChevronRight
            className={`w-4 h-4 ${
              type === "income" ? "text-green-600" : "text-red-600"
            }`}
          />
        </button>
      </div>
      <p className="text-xs md:text-sm text-gray-500 mt-2">
        Each selected currency is shown, but the total is in you selected
        default currency.
      </p>
    </AnimatedCard>
  );
};

// Skeleton Component for Analysis Section
const AnalysisSectionSkeleton = ({ isSmallScreen }) => (
  <div className=" md:p-6 border-gray-100">
    <div className="flex flex-col space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2 flex flex-col space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Skeleton height={120} borderRadius={16} />
            <Skeleton height={120} borderRadius={16} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Skeleton height={220} borderRadius={16} />
            <Skeleton height={220} borderRadius={16} />
          </div>
        </div>
        <div className="lg:self-start lg:h-full">
          <Skeleton height={360} borderRadius={16} />
        </div>
      </div>
      <Skeleton height={350} borderRadius={16} />
    </div>
  </div>
);

// Improved PieChart Component with Hover Effects
const EnhancedPieChart = ({ labels, data, title, total, isSmallScreen }) => {
  return (
    <div className="relative h-40 md:h-52">
      <PieChart
        labels={labels}
        data={data}
        title={title}
        // total={total}
        isSmallScreen={isSmallScreen}
        options={{
          plugins: {
            tooltip: {
              enabled: true,
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                },
              },
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              padding: 10,
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 12,
              },
              displayColors: true,
              boxPadding: 3,
            },
          },
        }}
      />
    </div>
  );
};

// Analysis Section Component with improved responsiveness
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
  const bgGradient =
    activeTab === "expense"
      ? "bg-gradient-to-br from-red-50 to-white"
      : "bg-gradient-to-br from-green-50 to-white";
  const iconColor = activeTab === "expense" ? "text-red-500" : "text-green-500";
  const accentColor = activeTab === "expense" ? "bg-red-100" : "bg-green-100";
  const hoverColor =
    activeTab === "expense" ? "hover:bg-red-200" : "hover:bg-green-200";

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
            fill: true,
            tension: 0.4,
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
            fill: true,
            tension: 0.4,
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

  // Improved line chart options with better responsiveness
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor:
          activeTab === "expense"
            ? "rgba(239, 68, 68, 0.9)"
            : "rgba(34, 197, 94, 0.9)",
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += `${monthlyDefaultCurrency}${context.parsed.y.toFixed(
                2
              )}`;
            }
            return label;
          },
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function (value) {
            return `${monthlyDefaultCurrency}${value.toFixed(0)}`;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: isSmallScreen ? 9 : 11,
          },
        },
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 3,
      },
    },
    animation: {
      duration: 1500,
      easing: "easeOutQuart",
    },
  };

  return (
    <div className=" md:p-6 border-gray-100">
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <AnimatedCard delay={100} className={bgGradient}>
                <div className="flex items-center gap-3 mb-3">
                  <TrendingUp className={`w-5 h-5 ${iconColor}`} />
                  <h3 className={`text-lg md:text-xl font-bold ${textColor}`}>
                    Total {title}
                  </h3>
                </div>
                <div className="flex items-center flex-wrap gap-2">
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
                </div>
                <p className="text-xs md:text-sm text-gray-500 ">
                  Total is in your default currency .
                </p>
              </AnimatedCard>
              <CurrencySliderCard
                type={activeTab}
                currencyBreakdown={currencyBreakdown}
                isSmallScreen={isSmallScreen}
                defaultCurrency={defaultCurrency}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <AnimatedCard delay={300}>
                <div className="flex items-center gap-3 mb-3">
                  <PieChartIcon className={`w-5 h-5 ${iconColor}`} />
                  <h3 className="text-base md:text-xl font-semibold text-gray-800">
                    Currency Usage ({selectedYear})
                  </h3>
                </div>
                {currencyUsageData.labels.length > 0 ? (
                  <EnhancedPieChart
                    labels={currencyUsageData.labels}
                    data={currencyUsageData.data}
                    title={`Currency Usage (${selectedYear})`}
                    total={currencyUsageData.total}
                    isSmallScreen={isSmallScreen}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">
                      No currency usage data available
                    </p>
                    <ArrowRightCircle className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </AnimatedCard>

              <AnimatedCard delay={400}>
                <div className="flex items-center gap-3 mb-3">
                  <PieChartIcon className={`w-5 h-5 ${iconColor}`} />
                  <h3 className="text-base md:text-xl font-semibold text-gray-800">
                    Category Usage ({selectedYear})
                  </h3>
                </div>
                {categoryData.length > 0 ? (
                  <EnhancedPieChart
                    labels={categoryData.map((item) => item.category)}
                    data={categoryData.map((item) =>
                      parseFloat(item.total.replace("%", ""))
                    )}
                    title={`Category Usage (${selectedYear})`}
                    total={currencyUsageData.total}
                    isSmallScreen={isSmallScreen}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-2">
                      No category usage data available
                    </p>
                    <ArrowRightCircle className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </AnimatedCard>
            </div>
          </div>

          <AnimatedCard delay={500} className="lg:self-start lg:h-full">
            <div className="flex items-center gap-3 mb-4">
              <BarChart2 className={`w-5 h-5 ${iconColor}`} />
              <h3 className="text-base md:text-xl font-semibold text-gray-800">
                Category Breakdown
              </h3>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-100">
              <DataTable
                data={categoryData}
                headers={["Index", "Category", "Total"]}
                defaultPageSize={15}
              />
            </div>
          </AnimatedCard>
        </div>

        <AnimatedCard delay={600} className="overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Calendar className={`w-5 h-5 ${iconColor}`} />
              <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                {selectedYear} - Yearly {title} Trend
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <label
                htmlFor="year-select"
                className="text-sm font-medium text-gray-700"
              >
                Select Year:
              </label>
              <div className="relative">
                <select
                  id="year-select"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className={`appearance-none w-32 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 ${
                    activeTab === "expense"
                      ? "focus:ring-red-500"
                      : "focus:ring-green-500"
                  } focus:border-transparent transition duration-200`}
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
          </div>
          <div className="overflow-x-auto">
            <div
              className="h-80 md:h-96 min-w-full"
              style={{ minWidth: isSmallScreen ? "600px" : "100%" }}
            >
              <LineChart data={lineChartData} options={lineChartOptions} />
            </div>
          </div>
        </AnimatedCard>
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

  // Handle window resize with improved debounce
  useEffect(() => {
    const handleResize = debounce(() => setWindowWidth(window.innerWidth), 100);
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
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="w-full px-2 md:px-4 mb-6">
        <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-6 gap-4">
            <div className="flex items-center">
              {/* Tab Buttons with Animated Underline */}
              <div className="relative flex">
                <button
                  onClick={() => setActiveTab("expense")}
                  className={`px-5 py-2 text-base font-medium transition-colors duration-200 relative ${
                    activeTab === "expense"
                      ? "text-red-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Expense
                  {activeTab === "expense" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 animate-slideIn"></span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("income")}
                  className={`px-5 py-2 text-base font-medium transition-colors duration-200 relative ${
                    activeTab === "income"
                      ? "text-green-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Income
                  {activeTab === "income" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 animate-slideIn"></span>
                  )}
                </button>
              </div>
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
        <div className="w-full px-2 ">
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
            <div className="text-center text-gray-600 py-8">
              No {activeTab} data available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
