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
