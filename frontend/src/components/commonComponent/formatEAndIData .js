import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format the data in the store (add the data if not existing in database and sort according to the date)

export const formatExpensesData = (expenses, startDate, endDate) => {
  // Helper function to parse and format dates
  const parseDate = (dateStr) =>
    new Date(dateStr.split("-").reverse().join("-"));
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;

  // Sort expenses by date
  expenses.sort((a, b) => parseDate(a.date) - parseDate(b.date));

  // Create a map for existing dates
  const dateMap = new Map(expenses.map((item) => [item.date, item]));

  // Generate the date range
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  const formattedExpenses = [];

  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = formatDate(date);
    if (dateMap.has(dateStr)) {
      // Use existing data if available
      formattedExpenses.push(dateMap.get(dateStr));
    } else {
      // Add an empty object for missing dates
      formattedExpenses.push({
        date: dateStr,
        online: [],
        offline: [],
        _id: { $oid: null },
      });
    }
  }

  // console.log(formattedExpenses, "absvk");
  return formattedExpenses;
};

//**************************************/
// formate the data according the currentday , yesterday , month with the total of expenses

// Helper function to parse a date string (DD-MM-YYYY) into a Date object
// Import dayjs and plugins

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);

/**
 * Filters and processes the given data based on the date range and rules.
 * @param {Array} data - Array of expense objects containing online and offline transactions.
 * @returns {Object} Filtered and processed data categorized by date ranges.
 */
export function filterDataByDateRange(data) {
  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");
  const startOfWeek = today.startOf("week");
  const endOfWeek = today.endOf("week");
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");

  // Helper function to filter expenses by date range
  const filterByDateRange = (date, start, end) => {
    // console.log("data", date);
    return (
      dayjs(date, "DD-MM-YYYY").isSameOrAfter(start) &&
      dayjs(date, "DD-MM-YYYY").isSameOrBefore(end)
    );
  };

  // Helper function to calculate totals for a given expense array
  const calculateTotals = (expenses) => {
    const offlineTotal = expenses
      .flatMap((item) => item.offline || [])
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
    const onlineTotal = expenses
      .flatMap((item) => item.online || [])
      .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

    return {
      offlineTotal,
      onlineTotal,
      bothTotal: offlineTotal + onlineTotal,
    };
  };

  // Filter data for each case
  const todayData = data.filter((item) =>
    filterByDateRange(item.date, today, today)
  );
  const yesterdayData = data.filter((item) =>
    filterByDateRange(item.date, yesterday, yesterday)
  );
  const currentWeekData = data.filter((item) =>
    filterByDateRange(item.date, startOfWeek, endOfWeek)
  );
  const currentMonthData = data.filter((item) =>
    filterByDateRange(item.date, startOfMonth, endOfMonth)
  );

  console.log("Filtering today data", todayData,yesterdayData);
  return {
    today: {
      data: todayData,
      totals: calculateTotals(todayData),
    },
    yesterday: {
      data: yesterdayData,
      totals: calculateTotals(yesterdayData),
    },
    currentWeek: {
      data: currentWeekData,
      totals: calculateTotals(currentWeekData),
    },
    currentMonth: {
      data: currentMonthData,
      totals: calculateTotals(currentMonthData),
    },
  };
}
