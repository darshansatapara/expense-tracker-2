import NodeCache from "node-cache";
import CurrencyDailyRateModel from "../models/CommonModel/CurrencyDailyRatesModel.js";

const rateCache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

// Helper function to build a map for quick lookups
const buildDayRateMap = (rateData) => {
  const monthMap = new Map();
  for (const month of rateData.months) {
    const key = month.startMonth.split("-")[1]; // month number
    const dayMap = new Map();
    for (const day of month.days) {
      dayMap.set(
        day.date,
        new Map(
          day.rates.map((rate) => [
            rate.currency.toString(),
            parseFloat(rate.value),
          ])
        )
      );
    }
    monthMap.set(key, dayMap);
  }
  return monthMap;
};

// Batch fetch exchange rates for multiple dates
export const getExchangeRatesForDates = async (dbConnection, dates, year) => {
  const cacheKey = `rates_${year}`;
  let monthMap = rateCache.get(cacheKey);

  if (!monthMap) {
    const CurrencyRateModel = CurrencyDailyRateModel(dbConnection);
    const rateData = await CurrencyRateModel.findOne({ year });
    if (!rateData) return new Map();

    monthMap = buildDayRateMap(rateData);
    rateCache.set(cacheKey, monthMap);
  }

  const rateMap = new Map();
  for (const date of dates) {
    const [day, month] = date.split("-");
    const dayMap = monthMap.get(month);
    if (dayMap && dayMap.get(date)) {
      rateMap.set(date, dayMap.get(date));
    }
  }
  return rateMap;
};

// Optimized getExchangeRate (used as fallback or for single lookups)
export const getExchangeRate = async (dbConnection, date, currencyId) => {
  if (!currencyId) return null;

  const [day, month, year] = date.split("-");
  const rates = await getExchangeRatesForDates(dbConnection, [date], year);
  const rateMap = rates.get(date);

  return rateMap ? rateMap.get(currencyId.toString()) || null : null;
};

// Optimized currency converter
export const userExpenseAmountCurrencyConverter = async (
  adminDbConnection,
  date,
  amount,
  expenseCurrencyId,
  defaultCurrencyId,
  exchangeRates // Pre-fetched rates
) => {
  if (!expenseCurrencyId || !defaultCurrencyId) return "Unavailable";

  if (expenseCurrencyId.toString() === defaultCurrencyId.toString()) {
    return parseFloat(amount).toFixed(2);
  }

  try {
    let expenseToUsdRate, defaultToUsdRate;

    if (exchangeRates && exchangeRates.get(date)) {
      const rateMap = exchangeRates.get(date);
      expenseToUsdRate = rateMap.get(expenseCurrencyId.toString());
      defaultToUsdRate = rateMap.get(defaultCurrencyId.toString());
    } else {
      // Fallback to single query
      [expenseToUsdRate, defaultToUsdRate] = await Promise.all([
        getExchangeRate(adminDbConnection, date, expenseCurrencyId),
        getExchangeRate(adminDbConnection, date, defaultCurrencyId),
      ]);
    }

    if (!expenseToUsdRate || !defaultToUsdRate) return "Unavailable";

    const amountInUsd = parseFloat(amount) / expenseToUsdRate;
    const convertedAmount = (amountInUsd * defaultToUsdRate).toFixed(2);

    return convertedAmount;
  } catch (error) {
    console.error("Error in currency conversion:", error);
    return "Unavailable";
  }
};
