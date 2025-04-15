// import {
//   getExpenseAnalysis,
//   getMonthlyExpenseTotals,
// } from "../UserController/userExpenseController.js";
// import {
//   getIncomeAnalysis,
//   getMonthlyIncomeTotals,
// } from "../UserController/userIncomeController.js";

// const mockResponse = () => {
//   let capturedData = null;
//   return {
//     status: () => ({
//       json: (data) => {
//         capturedData = data;
//       },
//     }),
//     getData: () => capturedData,
//   };
// };

// const formatDate = (dateStr) => {
//   const date = new Date(dateStr);
//   if (isNaN(date)) return null;
//   const [day, month, year] = [
//     String(date.getDate()).padStart(2, "0"),
//     String(date.getMonth() + 1).padStart(2, "0"),
//     date.getFullYear(),
//   ];
//   return `${day}-${month}-${year}`;
// };

// const isValidDate = (dateStr) => {
//   const isoDate = dateStr.split("-").reverse().join("-");
//   return !isNaN(new Date(isoDate));
// };

// export const getFinancialReportData =
//   (userDbConnection, adminDbConnection) => async (req, res) => {
//     const { userId, year, professionId, startDate, endDate } = req.params;

//     if (!userId || !year || isNaN(year)) {
//       return res.status(400).json({
//         success: false,
//         message: "Missing or invalid userId or year",
//       });
//     }

//     let effectiveStartDate = startDate || `01-01-${year}`;
//     let effectiveEndDate = endDate || `31-12-${year}`;

//     if (
//       (startDate && !isValidDate(startDate)) ||
//       (endDate && !isValidDate(endDate))
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid startDate or endDate format. Expected DD-MM-YYYY",
//       });
//     }

//     effectiveStartDate = formatDate(
//       effectiveStartDate.split("-").reverse().join("-")
//     );
//     effectiveEndDate = formatDate(
//       effectiveEndDate.split("-").reverse().join("-")
//     );

//     if (!effectiveStartDate || !effectiveEndDate) {
//       return res.status(400).json({
//         success: false,
//         message: "Failed to parse dates",
//       });
//     }

//     try {
//       const mocks = {
//         monthlyExpenses: mockResponse(),
//         monthlyIncomes: mockResponse(),
//         expenseAnalysis: mockResponse(),
//         incomeAnalysis: mockResponse(),
//       };

//       const tasks = [
//         getMonthlyExpenseTotals(userDbConnection, adminDbConnection)(
//           { params: { userId, year } },
//           mocks.monthlyExpenses
//         ),
//         getMonthlyIncomeTotals(userDbConnection, adminDbConnection)(
//           { params: { userId, year } },
//           mocks.monthlyIncomes
//         ),
//         getExpenseAnalysis(userDbConnection, adminDbConnection)(
//           {
//             params: {
//               userId,
//               startDate: effectiveStartDate,
//               endDate: effectiveEndDate,
//             },
//           },
//           mocks.expenseAnalysis
//         ),
//         getIncomeAnalysis(userDbConnection, adminDbConnection)(
//           {
//             params: {
//               userId,
//               startDate: effectiveStartDate,
//               endDate: effectiveEndDate,
//               professionId,
//             },
//           },
//           mocks.incomeAnalysis
//         ),
//       ];

//       await Promise.allSettled(tasks);

//       const responseData = {
//         monthlyExpenses:
//           mocks.monthlyExpenses.getData()?.data?.monthlyTotals || [],
//         monthlyIncomes:
//           mocks.monthlyIncomes.getData()?.data?.monthlyTotals || [],
//         expenseAnalysis: mocks.expenseAnalysis.getData()?.data || null,
//         incomeAnalysis: mocks.incomeAnalysis.getData()?.data || null,
//       };

//       const warnings = [];

//       const addWarningIfFail = (mock, label) => {
//         const data = mock.getData();
//         if (!data?.success) {
//           warnings.push(
//             `${label} unavailable: ${data?.message || "Unknown error"}`
//           );
//         }
//       };

//       addWarningIfFail(mocks.monthlyExpenses, "Monthly expense totals");
//       addWarningIfFail(mocks.monthlyIncomes, "Monthly income totals");
//       addWarningIfFail(mocks.expenseAnalysis, "Expense analysis");
//       addWarningIfFail(mocks.incomeAnalysis, "Income analysis");

//       const allZero =
//         responseData.monthlyExpenses.every((m) => m.total === "0.00") &&
//         responseData.monthlyIncomes.every((m) => m.total === "0.00") &&
//         responseData.expenseAnalysis?.totalExpense?.amount === "0.00" &&
//         responseData.incomeAnalysis?.totalIncome?.amount === "0.00";

//       if (allZero) {
//         warnings.push(
//           "Some totals may be incomplete due to missing exchange rates for currency conversions"
//         );
//       }

//       const noData =
//         !responseData.monthlyExpenses.length &&
//         !responseData.monthlyIncomes.length &&
//         !responseData.expenseAnalysis &&
//         !responseData.incomeAnalysis;

//       if (noData) {
//         return res.status(404).json({
//           success: false,
//           message: "No financial data available",
//           warnings,
//         });
//       }

//       return res.status(200).json({
//         success: true,
//         message: `Financial report data for ${year} from ${effectiveStartDate} to ${effectiveEndDate} retrieved successfully`,
//         data: responseData,
//         warnings: warnings.length ? warnings : undefined,
//       });
//     } catch (error) {
//       console.error("Error fetching financial report data:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Error fetching financial report data",
//         error: error.message,
//       });
//     }
//   };

import {
  getExpenseAnalysis,
  getMonthlyExpenseTotals,
} from "../UserController/userExpenseController.js";
import {
  getIncomeAnalysis,
  getMonthlyIncomeTotals,
} from "../UserController/userIncomeController.js";
import { getExchangeRatesForDates } from "../../middlewares/userExpenseAmountCurrencyConverter.js";
import {
  UserCurrencyAndBudgetModel,
  UserExpenseCategoryModel,
  UserIncomeCategoryModel,
} from "../../models/UserModel/UserCategoryModels.js";
import { AdminCurrencyCategory } from "../../models/AdminModel/AdminCategoryModels.js";

const mockResponse = () => {
  let capturedData = null;
  return {
    status: () => ({
      json: (data) => {
        capturedData = data;
      },
    }),
    getData: () => capturedData,
  };
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return null;
  const [day, month, year] = [
    String(date.getDate()).padStart(2, "0"),
    String(date.getMonth() + 1).padStart(2, "0"),
    date.getFullYear(),
  ];
  return `${day}-${month}-${year}`;
};

const isValidDate = (dateStr) => {
  const isoDate = dateStr.split("-").reverse().join("-");
  return !isNaN(new Date(isoDate));
};

export const getFinancialReportData =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId, year, professionId, startDate, endDate } = req.params;

    if (!userId || !year || isNaN(year)) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid userId or year",
      });
    }

    let effectiveStartDate = startDate || `01-01-${year}`;
    let effectiveEndDate = endDate || `31-12-${year}`;

    if (
      (startDate && !isValidDate(startDate)) ||
      (endDate && !isValidDate(endDate))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid startDate or endDate format. Expected DD-MM-YYYY",
      });
    }

    effectiveStartDate = formatDate(
      effectiveStartDate.split("-").reverse().join("-")
    );
    effectiveEndDate = formatDate(
      effectiveEndDate.split("-").reverse().join("-")
    );

    if (!effectiveStartDate || !effectiveEndDate) {
      return res.status(400).json({
        success: false,
        message: "Failed to parse dates",
      });
    }

    try {
      // Fetch common data
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);
      const userCurrencyData = await UserCurrencyAndBudget.findOne({
        userId,
      }).populate({
        path: "defaultCurrency",
        model: AdminCurrencyCategoryModel,
        select: "symbol name",
      });

      if (!userCurrencyData) {
        return res.status(404).json({
          success: false,
          message: "User currency data not found",
        });
      }

      // Fetch incomes and expenses to get unique dates
      const [incomesAgg, expensesAgg] = await Promise.all([
        UserIncomeCategoryModel(userDbConnection).aggregate([
          { $match: { userId } },
          { $unwind: "$incomes" },
          {
            $match: {
              "incomes.date": {
                $regex: `^\\d{2}-\\d{2}-${year}`,
              },
            },
          },
          { $project: { date: "$incomes.date" } },
        ]),
        UserExpenseCategoryModel(userDbConnection).aggregate([
          { $match: { userId } },
          { $unwind: "$expenses" },
          {
            $match: {
              "expenses.date": {
                $regex: `^\\d{2}-\\d{2}-${year}`,
              },
            },
          },
          { $project: { date: "$expenses.date" } },
        ]),
      ]);

      const uniqueDates = new Set([
        ...incomesAgg.map((inc) => inc.date),
        ...expensesAgg.map((exp) => exp.date),
      ]);
      const exchangeRates = await getExchangeRatesForDates(
        adminDbConnection,
        uniqueDates,
        year
      );

      const mocks = {
        monthlyExpenses: mockResponse(),
        monthlyIncomes: mockResponse(),
        expenseAnalysis: mockResponse(),
        incomeAnalysis: mockResponse(),
      };

      // Pass shared context to APIs
      const context = { userCurrencyData, exchangeRates };

      const tasks = [
        getMonthlyExpenseTotals(userDbConnection, adminDbConnection)(
          { params: { userId, year }, context },
          mocks.monthlyExpenses
        ),
        getMonthlyIncomeTotals(userDbConnection, adminDbConnection)(
          { params: { userId, year }, context },
          mocks.monthlyIncomes
        ),
        getExpenseAnalysis(userDbConnection, adminDbConnection)(
          {
            params: {
              userId,
              startDate: effectiveStartDate,
              endDate: effectiveEndDate,
            },
            context,
          },
          mocks.expenseAnalysis
        ),
        getIncomeAnalysis(userDbConnection, adminDbConnection)(
          {
            params: {
              userId,
              startDate: effectiveStartDate,
              endDate: effectiveEndDate,
              professionId,
            },
            context,
          },
          mocks.incomeAnalysis
        ),
      ];

      await Promise.allSettled(tasks);

      const responseData = {
        monthlyExpenses:
          mocks.monthlyExpenses.getData()?.data?.monthlyTotals || [],
        monthlyIncomes:
          mocks.monthlyIncomes.getData()?.data?.monthlyTotals || [],
        expenseAnalysis: mocks.expenseAnalysis.getData()?.data || null,
        incomeAnalysis: mocks.incomeAnalysis.getData()?.data || null,
      };

      const warnings = [];

      const addWarningIfFail = (mock, label) => {
        const data = mock.getData();
        if (!data?.success) {
          warnings.push(
            `${label} unavailable: ${data?.message || "Unknown error"}`
          );
        }
      };

      addWarningIfFail(mocks.monthlyExpenses, "Monthly expense totals");
      addWarningIfFail(mocks.monthlyIncomes, "Monthly income totals");
      addWarningIfFail(mocks.expenseAnalysis, "Expense analysis");
      addWarningIfFail(mocks.incomeAnalysis, "Income analysis");

      const allZero =
        responseData.monthlyExpenses.every((m) => m.total === "0.00") &&
        responseData.monthlyIncomes.every((m) => m.total === "0.00") &&
        responseData.expenseAnalysis?.totalExpense?.amount === "0.00" &&
        responseData.incomeAnalysis?.totalIncome?.amount === "0.00";

      if (allZero) {
        warnings.push(
          "Some totals may be incomplete due to missing exchange rates for currency conversions"
        );
      }

      const noData =
        !responseData.monthlyExpenses.length &&
        !responseData.monthlyIncomes.length &&
        !responseData.expenseAnalysis &&
        !responseData.incomeAnalysis;

      if (noData) {
        return res.status(404).json({
          success: false,
          message: "No financial data available",
          warnings,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Financial report data for ${year} from ${effectiveStartDate} to ${effectiveEndDate} retrieved successfully`,
        data: responseData,
        warnings: warnings.length ? warnings : undefined,
      });
    } catch (error) {
      console.error("Error fetching financial report data:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching financial report data",
        error: error.message,
      });
    }
  };
