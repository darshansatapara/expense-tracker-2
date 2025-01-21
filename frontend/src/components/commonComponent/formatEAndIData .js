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

  console.log(formattedExpenses, "absvk");
  return formattedExpenses;
};
