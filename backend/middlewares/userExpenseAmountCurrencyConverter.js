// import CurrencyDailyRateModel from "../models/CommonModel/CurrencyDailyRatesModel.js";

// export const getExchangeRate = async (dbConnection, date, currencyId) => {
//   console.log("script run");
//   if (!currencyId) return null;

//   const CurrencyRateModel = CurrencyDailyRateModel(dbConnection);
//   const [day, month, year] = date.split("-");
//   const rateData = await CurrencyRateModel.findOne({ year });

//   if (!rateData) return null;

//   const monthData = rateData.months.find(
//     (m) => m.startMonth.includes(month) || m.endMonth.includes(month)
//   );
//   if (!monthData) return null;
//   // Log all days to debug
//   // console.log(
//   //   "Available days in monthData:",
//   //   monthData.days.map((d) => d.date)
//   // );
//   const dayData = monthData.days.find((d) => d.date === normalizedDate);
//   if (!dayData || !dayData.rates.length) {
//     console.log(`No day data found for date: ${normalizedDate}`);
//     return null;
//   }
//   console.log("dayData:", dayData);

//   const currencyRate = dayData.rates.find(
//     (r) => r.currency.toString() === currencyId.toString()
//   );

//   return currencyRate ? parseFloat(currencyRate.value) : null;
// };

// export const userExpenseAmountCurrencyConverter = async (
//   adminDbConnection,
//   date,
//   amount,
//   expenseCurrencyId,
//   defaultCurrencyId
// ) => {
//   if (!expenseCurrencyId || !defaultCurrencyId) return "Unavailable";

//   // If both currencies are the same, return the amount directly
//   if (expenseCurrencyId.toString() === defaultCurrencyId.toString()) {
//     return parseFloat(amount).toFixed(2);
//   }

//   try {
//     // Fetch exchange rates for the expense currency and default currency (both against USD)
//     const [expenseToUsdRate, defaultToUsdRate] = await Promise.all([
//       getExchangeRate(adminDbConnection, date, expenseCurrencyId), // Expense currency → USD
//       getExchangeRate(adminDbConnection, date, defaultCurrencyId), // Default currency → USD
//     ]);

//     // Ensure both rates exist before proceeding
//     if (!expenseToUsdRate || !defaultToUsdRate) return "Unavailable";

//     // Step 1: Convert amount from expense currency to USD
//     const amountInUsd = parseFloat(amount) / expenseToUsdRate;

//     // Step 2: Convert amount from USD to the default currency
//     const convertedAmount = (amountInUsd * defaultToUsdRate).toFixed(2);

//     return convertedAmount;
//   } catch (error) {
//     console.error("Error in currency conversion:", error);
//     return "Unavailable";
//   }
// };


import CurrencyDailyRateModel from "../models/CommonModel/CurrencyDailyRatesModel.js";

export const getExchangeRate = async (dbConnection, date, currencyId) => {
  console.log("script run");
  if (!currencyId) return null;

  const CurrencyRateModel = CurrencyDailyRateModel(dbConnection);

  // Step 1: Extract year from date and match it in the database
  const [day, month, year] = date.split("-"); // Assuming date is "DD-MM-YYYY", e.g., "03-02-2025"
  const rateData = await CurrencyRateModel.findOne({ year });

  if (!rateData) {
    console.log(`No data found for year: ${year}`);
    return null;
  }

  // Step 2: Match the month by comparing with startMonth and endMonth
  const monthData = rateData.months.find((m) => {
    const startMonthParts = m.startMonth.split("-"); // e.g., ["01", "02", "2025"]
    const endMonthParts = m.endMonth.split("-");     // e.g., ["28", "02", "2025"]
    const monthToFind = month;                       // e.g., "02"
    return startMonthParts[1] === monthToFind && endMonthParts[1] === monthToFind;
  });

  if (!monthData) {
    console.log(`No month data found for month: ${month}`);
    return null;
  }

  // Step 3: Match the exact date in the days array
  const normalizedDate = `${day}-${month}-${year}`; // Ensure format is "DD-MM-YYYY", e.g., "03-02-2025"
  const dayData = monthData.days.find((d) => d.date === normalizedDate);
  if (!dayData || !dayData.rates.length) {
    console.log(`No day data found for date: ${normalizedDate}`);
    // Uncomment for debugging
    // console.log("Available days in monthData:", monthData.days.map((d) => d.date));
    return null;
  }
  console.log("dayData:", dayData);

  // Find the currency rate for the given currencyId
  const currencyRate = dayData.rates.find(
    (r) => r.currency.toString() === currencyId.toString()
  );

  return currencyRate ? parseFloat(currencyRate.value) : null;
};

export const userExpenseAmountCurrencyConverter = async (
  adminDbConnection,
  date,
  amount,
  expenseCurrencyId,
  defaultCurrencyId
) => {
  if (!expenseCurrencyId || !defaultCurrencyId) return "Unavailable";

  // If both currencies are the same, return the amount directly
  if (expenseCurrencyId.toString() === defaultCurrencyId.toString()) {
    return parseFloat(amount).toFixed(2);
  }

  try {
    // Fetch exchange rates for the expense currency and default currency (both against USD)
    const [expenseToUsdRate, defaultToUsdRate] = await Promise.all([
      getExchangeRate(adminDbConnection, date, expenseCurrencyId), // Expense currency → USD
      getExchangeRate(adminDbConnection, date, defaultCurrencyId), // Default currency → USD
    ]);

    // Ensure both rates exist before proceeding
    if (!expenseToUsdRate || !defaultToUsdRate) return "Unavailable";

    // Step 1: Convert amount from expense currency to USD
    const amountInUsd = parseFloat(amount) / expenseToUsdRate;

    // Step 2: Convert amount from USD to the default currency
    const convertedAmount = (amountInUsd * defaultToUsdRate).toFixed(2);

    return convertedAmount;
  } catch (error) {
    console.error("Error in currency conversion:", error);
    return "Unavailable";
  }
};