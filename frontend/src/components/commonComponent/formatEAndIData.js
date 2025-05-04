import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";

// format the data in the store (add the data if not existing in database and sort according to the date)

export function formatData(data, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Generate a map of existing dates in the data
  const existingDates = new Set(data.map((item) => item.date));

  // Generate all dates within the range
  const dateRange = [];
  for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
    const formattedDate = new Date(d); // Clone the date object to avoid mutation
    formattedDate.setDate(formattedDate.getDate() + 1); // Add 1 day to the formatted date

    const formattedString = formattedDate
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-");
    // console.log(formattedString, "datevrfjavdfj  ");
    if (!existingDates.has(formattedString)) {
      dateRange.push({
        date: formattedString,
        online: [],
        offline: [],
        _id: { $oid: generateObjectId() },
      });
    }
  }

  // Combine and sort the data
  const combinedData = [...data, ...dateRange];
  combinedData.sort((a, b) => {
    const dateA = new Date(a.date.split("-").reverse().join("-"));
    const dateB = new Date(b.date.split("-").reverse().join("-"));
    return dateA - dateB;
  });

  return combinedData;
}

function generateObjectId() {
  return (
    Date.now().toString(16) + Math.random().toString(16).substring(2, 8)
  ).substring(0, 24);
}

//**************************************/
// formate the data according the currentday , yesterday , month with the total of expenses
// for home page ...................
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

  // // Helper function to calculate totals for a given expense array
  // const calculateTotals = (expenses) => {
  //   // console.log(expenses);
  //   const offlineTotal = expenses
  //     .flatMap((item) => item.offline || [])
  //     .reduce((sum, exp) => sum + parseFloat(exp.convertedAmount || 0), 0);
  //   const onlineTotal = expenses
  //     .flatMap((item) => item.online || [])
  //     .reduce((sum, exp) => sum + parseFloat(exp?.convertedAmount || 0), 0);

  //   console.log(offlineTotal);
  //   console.log(onlineTotal);
  //   return {
  //     offlineTotal,
  //     onlineTotal,
  //     bothTotal: offlineTotal + onlineTotal,
  //   };
  // };

  const calculateTotals = (expenses) => {
    const offlineTotal = expenses
      .flatMap((item) => item.offline || [])
      .reduce((sum, exp) => {
        const amount = parseFloat(exp.convertedAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

    const onlineTotal = expenses
      .flatMap((item) => item.online || [])
      .reduce((sum, exp) => {
        const amount = parseFloat(exp.convertedAmount);
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

    return {
      offlineTotal,
      onlineTotal,
      bothTotal: offlineTotal + onlineTotal,
    };
  };

  // Filter data for each case
  const todayData = data?.filter((item) =>
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
