import axios from "axios";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectAdminDatabase } from "../config/database.js";
import { AdminCurrencyCategory } from "../models/AdminModel/AdminCategoryModels.js";
import CurrencyDailyRateModel from "../models/CommonModel/CurrencyDailyRatesModel.js";

dotenv.config(); // Load environment variables

// Retrieve the API key from environment variables
const CURRENCYBEACON_API_KEY = process.env.CURRENCYBEACON_API_KEY; // Replace with your actual API key
const API_URL = "https://api.currencybeacon.com/v1/historical";

// Define dynamic start and end dates using environment variables or defaults (format: "YYYY-MM-DD")
const DYNAMIC_START_DATE = process.env.DYNAMIC_START_DATE || "2025-04-15";
const DYNAMIC_END_DATE = process.env.DYNAMIC_END_DATE || formatDate(new Date());

console.log("Date Range:", DYNAMIC_START_DATE, DYNAMIC_END_DATE);

// Format a Date object as "YYYY-MM-DD" using local time.
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

// Convert a date string from "YYYY-MM-DD" to "DD-MM-YYYY" for storage in DB.
function formatToLocalDate(dateStr) {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
}

// Generate an array of dates (in "YYYY-MM-DD" format) between two dates (inclusive).
// Here we calculate the difference in days and then create new Date instances for each day.
function getAllDatesInRange(startDateStr, endDateStr) {
  const dates = [];
  const [startYear, startMonth, startDay] = startDateStr.split("-").map(Number);
  const [endYear, endMonth, endDay] = endDateStr.split("-").map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  const diffDays = Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1; // inclusive

  for (let i = 0; i < diffDays; i++) {
    const current = new Date(start.getTime() + i * 86400000);
    dates.push(formatDate(current));
  }
  console.log("Generated dates:", dates);
  return dates;
}

// Fetch exchange rates for a specific date from the CurrencyBeacon API.
async function fetchCurrencyRates(date) {
  try {
    console.log(`🔄 Fetching currency rates for ${date}...`);
    const response = await axios.get(
      `${API_URL}?api_key=${CURRENCYBEACON_API_KEY}&date=${date}`
    );
    if (response?.data && response.data.rates) {
      return response.data.rates;
    }
    throw new Error("Invalid response from CurrencyBeacon API.");
  } catch (error) {
    console.error(
      `❌ Error fetching exchange rates for ${date}:`,
      error.message
    );
    return null;
  }
}

// Helper function to save a Mongoose document with retry logic.
async function saveWithRetry(doc, maxRetries = 3, retryDelay = 1000) {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      await doc.save();
      console.log("✅ Document saved successfully.");
      return true;
    } catch (error) {
      attempts++;
      console.error(
        `❌ Error saving document (Attempt ${attempts}): ${error.message}`
      );
      if (attempts < maxRetries) {
        console.log(`🔄 Retrying in ${retryDelay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }
  }
  console.error("❌ Maximum save attempts reached. Moving on...");
  return false;
}

// Sorting helper: sorts the days array in a month subdocument by the day value.
// Since date is stored as "DD-MM-YYYY", we extract the day portion for comparison.
function sortDays(days) {
  return days.sort((a, b) => {
    const dayA = parseInt(a.date.split("-")[0], 10);
    const dayB = parseInt(b.date.split("-")[0], 10);
    return dayA - dayB;
  });
}

// Process a single date: fetch rates and store into the corresponding year/month document.
async function processSingleDate(adminDbConnection, apiDate) {
  const localDate = formatToLocalDate(apiDate);
  const [year, month] = apiDate.split("-");
  const startMonth = `01-${month}-${year}`;
  // Calculate the last day of the month. (new Date(year, month, 0) returns the last day of month)
  const lastDay = new Date(year, month, 0)
    .getDate()
    .toString()
    .padStart(2, "0");
  const endMonth = `${lastDay}-${month}-${year}`;

  // Get the Mongoose model for currency rates.
  const CurrencyRateModel = CurrencyDailyRateModel(adminDbConnection);

  // Find (or create) the year document.
  let currencyRate = await CurrencyRateModel.findOne({ year });
  if (!currencyRate) {
    currencyRate = new CurrencyRateModel({
      year,
      months: [],
    });
    console.log(`Created new year document for ${year}`);
  }

  // Find (or create) the month subdocument.
  let monthData = currencyRate.months.find(
    (m) => m.startMonth === startMonth && m.endMonth === endMonth
  );
  if (!monthData) {
    monthData = { startMonth, endMonth, days: [] };
    currencyRate.months.push(monthData);
    console.log(`Created new month data for ${startMonth} to ${endMonth}`);
  }

  // If this date already exists, skip processing.
  if (monthData.days.some((d) => d.date === localDate)) {
    console.log(`✅ Rates for ${localDate} already exist. Skipping...`);
    return;
  }

  // Fetch rates from the API.
  const rates = await fetchCurrencyRates(apiDate);
  let mappedRates = [];
  if (rates) {
    const currencyDocs = await AdminCurrencyCategory(adminDbConnection).find({
      currency: { $in: Object.keys(rates) },
    });
    mappedRates = currencyDocs.map((currency) => ({
      currency: currency._id,
      value: rates[currency.currency].toString(),
    }));
  } else {
    console.warn(`⚠️ No rates for ${localDate}. Storing with empty rates.`);
  }

  // Add the new day object.
  monthData.days.push({ date: localDate, rates: mappedRates });
  // Sort the days so that the dates are always in order.
  monthData.days = sortDays(monthData.days);
  console.log(`Added and sorted day ${localDate} in monthData.days`);

  // Mark the 'months' field as modified so Mongoose registers the change.
  currencyRate.markModified("months");

  // Save the document with retry logic.
  const saved = await saveWithRetry(currencyRate);
  if (saved) {
    console.log(`✅ Exchange rates stored for ${localDate}`);
  } else {
    console.error(`❌ Failed to save the rates for ${localDate}.`);
  }
}

// Phase 1: Process all dates in the provided range.
async function storeRatesForRange(adminDbConnection, startDateStr, endDateStr) {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(startDateStr) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(endDateStr)
  ) {
    throw new Error("Dates must be in YYYY-MM-DD format.");
  }
  const allDates = getAllDatesInRange(startDateStr, endDateStr);
  for (const apiDate of allDates) {
    await processSingleDate(adminDbConnection, apiDate);
  }
}

// Phase 2: Compute and process any missing dates using a set–difference approach.
async function processMissingDates(
  adminDbConnection,
  startDateStr,
  endDateStr
) {
  const expectedDates = getAllDatesInRange(startDateStr, endDateStr).map(
    formatToLocalDate
  );
  const missingDates = new Set(expectedDates);

  // Query all year documents in the range (assuming the range spans few years).
  const [startYear] = startDateStr.split("-");
  const [endYear] = endDateStr.split("-");
  const CurrencyRateModel = CurrencyDailyRateModel(adminDbConnection);
  const yearDocs = await CurrencyRateModel.find({
    year: { $gte: startYear, $lte: endYear },
  });

  // Remove the existing dates from the missingDates set.
  for (const yearDoc of yearDocs) {
    for (const monthData of yearDoc.months) {
      for (const day of monthData.days) {
        missingDates.delete(day.date);
      }
    }
  }

  if (missingDates.size === 0) {
    console.log("✅ No missing dates found in Phase 2.");
    return;
  }

  console.log(
    "⚠️ Missing dates detected in Phase 2:",
    Array.from(missingDates)
  );

  // For each missing date, convert back to "YYYY-MM-DD" to fetch data correctly.
  for (const localDate of missingDates) {
    const [day, month, year] = localDate.split("-");
    const apiDate = `${year}-${month}-${day}`;
    await processSingleDate(adminDbConnection, apiDate);
  }
}

// Main function: Connect to the Admin Database and process the rates in two phases.
async function startFetchingRates() {
  console.log("🚀 Connecting to Admin Database...");
  const adminDbConnection = await connectAdminDatabase();

  if (!adminDbConnection) {
    console.error("❌ Failed to connect to Admin Database. Exiting...");
    process.exit(1);
  }
  console.log("✅ Connected to Admin Database!");

  try {
    // Phase 1: Process all dates in the range.
    await storeRatesForRange(
      adminDbConnection,
      DYNAMIC_START_DATE,
      DYNAMIC_END_DATE
    );
    // Phase 2: Identify and process any missing dates.
    await processMissingDates(
      adminDbConnection,
      DYNAMIC_START_DATE,
      DYNAMIC_END_DATE
    );

    console.log(
      `🎉 Completed storing rates from ${DYNAMIC_START_DATE} to ${DYNAMIC_END_DATE}.`
    );
  } catch (error) {
    console.error("❌ Error during rate fetching process:", error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

// Execute the script.
startFetchingRates();
