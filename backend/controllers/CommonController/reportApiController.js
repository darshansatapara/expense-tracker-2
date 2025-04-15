import {
  getExpenseAnalysis,
  getMonthlyExpenseTotals,
} from "../UserController/userExpenseController.js";
import {
  getIncomeAnalysis,
  getMonthlyIncomeTotals,
} from "../UserController/userIncomeController.js";

// Helper function to mock res and capture data
const mockResponse = () => {
  let capturedData = null;
  return {
    status: (code) => ({
      json: (data) => {
        capturedData = data; // Capture the response data
      },
    }),
    getData: () => capturedData, // Method to retrieve captured data
  };
};

// Helper function to format date to DD-MM-YYYY
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Helper function to validate date
const isValidDate = (dateStr) => {
  return !isNaN(new Date(dateStr.split("-").reverse().join("-")));
};

export const getFinancialReportData =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId, year, professionId, startDate, endDate } = req.params;

    // Validate inputs
    if (!userId || !year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid userId or year",
      });
    }

    // Default to full year if dates not provided, and format to DD-MM-YYYY
    let effectiveStartDate = startDate || `01-01-${year}`;
    let effectiveEndDate = endDate || `31-12-${year}`;

    // Validate and format dates
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate format. Expected DD-MM-YYYY",
      });
    }
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid endDate format. Expected DD-MM-YYYY",
      });
    }

    // Ensure dates are in DD-MM-YYYY
    effectiveStartDate = startDate
      ? formatDate(startDate.split("-").reverse().join("-"))
      : effectiveStartDate;
    effectiveEndDate = endDate
      ? formatDate(endDate.split("-").reverse().join("-"))
      : effectiveEndDate;

    if (!effectiveStartDate || !effectiveEndDate) {
      return res.status(400).json({
        success: false,
        message: "Failed to parse dates",
      });
    }

    try {
      // Create mock responses
      const monthlyExpensesMock = mockResponse();
      const monthlyIncomesMock = mockResponse();
      const expenseAnalysisMock = mockResponse();
      const incomeAnalysisMock = mockResponse();

      // Execute controller functions concurrently
      await Promise.all([
        getMonthlyExpenseTotals(userDbConnection, adminDbConnection)(
          { params: { userId, year } },
          monthlyExpensesMock
        ),
        getMonthlyIncomeTotals(userDbConnection, adminDbConnection)(
          { params: { userId, year } },
          monthlyIncomesMock
        ),
        getExpenseAnalysis(userDbConnection, adminDbConnection)(
          {
            params: {
              userId,
              startDate: effectiveStartDate,
              endDate: effectiveEndDate,
            },
          },
          expenseAnalysisMock
        ),
        getIncomeAnalysis(userDbConnection, adminDbConnection)(
          {
            params: {
              userId,
              startDate: effectiveStartDate,
              endDate: effectiveEndDate,
              professionId,
            },
          },
          incomeAnalysisMock
        ),
      ]);

      // Extract captured data
      const monthlyExpensesData = monthlyExpensesMock.getData();
      const monthlyIncomesData = monthlyIncomesMock.getData();
      const expenseAnalysisData = expenseAnalysisMock.getData();
      const incomeAnalysisData = incomeAnalysisMock.getData();

      // Initialize response data and warnings
      const responseData = {
        monthlyExpenses: [],
        monthlyIncomes: [],
        expenseAnalysis: null,
        incomeAnalysis: null,
      };
      const warnings = [];

      // Process monthly expenses
      if (monthlyExpensesData && monthlyExpensesData.success) {
        responseData.monthlyExpenses =
          monthlyExpensesData.data?.monthlyTotals || [];
      } else {
        warnings.push(
          `Monthly expense totals unavailable: ${
            monthlyExpensesData?.message || "Unknown error"
          }`
        );
      }

      // Process monthly incomes
      if (monthlyIncomesData && monthlyIncomesData.success) {
        responseData.monthlyIncomes =
          monthlyIncomesData.data?.monthlyTotals || [];
      } else {
        warnings.push(
          `Monthly income totals unavailable: ${
            monthlyIncomesData?.message || "Unknown error"
          }`
        );
      }

      // Process expense analysis
      if (expenseAnalysisData && expenseAnalysisData.success) {
        responseData.expenseAnalysis = expenseAnalysisData.data || null;
      } else {
        warnings.push(
          `Expense analysis unavailable: ${
            expenseAnalysisData?.message || "Unknown error"
          }`
        );
      }

      // Process income analysis
      if (incomeAnalysisData && incomeAnalysisData.success) {
        responseData.incomeAnalysis = incomeAnalysisData.data || null;
      } else {
        warnings.push(
          `Income analysis unavailable: ${
            incomeAnalysisData?.message || "Unknown error"
          }`
        );
      }

      // Check if any data was retrieved
      if (
        responseData.monthlyExpenses.length === 0 &&
        responseData.monthlyIncomes.length === 0 &&
        !responseData.expenseAnalysis &&
        !responseData.incomeAnalysis
      ) {
        return res.status(404).json({
          success: false,
          message: "No financial data available",
          warnings,
        });
      }

      // Add warning about potential skipped conversions
      if (
        responseData.expenseAnalysis?.totalExpense?.amount === "0.00" ||
        responseData.incomeAnalysis?.totalIncome?.amount === "0.00" ||
        responseData.monthlyExpenses.every((m) => m.total === "0.00") ||
        responseData.monthlyIncomes.every((m) => m.total === "0.00")
      ) {
        warnings.push(
          "Some totals may be incomplete due to missing exchange rates for currency conversions"
        );
      }

      // Send combined response
      res.status(200).json({
        success: true,
        message: `Financial report data for ${year} from ${effectiveStartDate} to ${effectiveEndDate} retrieved successfully`,
        data: responseData,
        warnings: warnings.length > 0 ? warnings : undefined,
      });
    } catch (error) {
      console.error("Error fetching financial report data:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching financial report data",
        error: error.message,
      });
    }
  };
