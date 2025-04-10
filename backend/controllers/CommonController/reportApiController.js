// import {
//   getExpenseAnalysis,
//   getMonthlyExpenseTotals,
// } from "../UserController/userExpenseController.js";
// import {
//   getIncomeAnalysis,
//   getMonthlyIncomeTotals,
// } from "../UserController/userIncomeController.js";

// // Helper function to mock res and capture data
// const mockResponse = () => {
//   let capturedData = null;
//   return {
//     status: (code) => ({
//       json: (data) => {
//         capturedData = data; // Capture the response data
//       },
//     }),
//     getData: () => capturedData, // Method to retrieve captured data
//   };
// };

// export const getFinancialReportData =
//   (userDbConnection, adminDbConnection) => async (req, res) => {
//     const { userId, year, professionId } = req.params;

//     try {
//       // Create mock responses for each controller call
//       const monthlyExpensesMock = mockResponse();
//       const monthlyIncomesMock = mockResponse();
//       const expenseAnalysisMock = mockResponse();
//       const incomeAnalysisMock = mockResponse();

//       // Execute all controller functions concurrently
//       await Promise.all([
//         getMonthlyExpenseTotals(userDbConnection, adminDbConnection)(
//           { params: { userId, year } },
//           monthlyExpensesMock
//         ),
//         getMonthlyIncomeTotals(userDbConnection, adminDbConnection)(
//           { params: { userId, year } },
//           monthlyIncomesMock
//         ),
//         getExpenseAnalysis(userDbConnection, adminDbConnection)(
//           {
//             params: {
//               userId,
//               startDate: `01-01-${year}`,
//               endDate: `31-12-${year}`,
//             },
//           },
//           expenseAnalysisMock
//         ),
//         getIncomeAnalysis(userDbConnection, adminDbConnection)(
//           {
//             params: {
//               userId,
//               startDate: `01-01-${year}`,
//               endDate: `31-12-${year}`,
//               professionId,
//             },
//           },
//           incomeAnalysisMock
//         ),
//       ]);

//       // Extract captured data from mock responses
//       const monthlyExpensesData = monthlyExpensesMock.getData();
//       const monthlyIncomesData = monthlyIncomesMock.getData();
//       const expenseAnalysisData = expenseAnalysisMock.getData();
//       const incomeAnalysisData = incomeAnalysisMock.getData();

//       // Check if all data was successfully retrieved
//       if (
//         !monthlyExpensesData ||
//         !monthlyIncomesData ||
//         !expenseAnalysisData ||
//         !incomeAnalysisData
//       ) {
//         throw new Error("One or more data fetches failed");
//       }

//       // Send the combined response
//       res.status(200).json({
//         success: true,
//         message: `Financial report data for ${year} retrieved successfully`,
//         data: {
//           monthlyExpenses: monthlyExpensesData.data.monthlyTotals,
//           monthlyIncomes: monthlyIncomesData.data.monthlyTotals,
//           expenseAnalysis: expenseAnalysisData.data,
//           incomeAnalysis: incomeAnalysisData.data,
//         },
//       });
//     } catch (error) {
//       console.error("Error fetching financial report data:", error);
//       res.status(500).json({
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
  
  export const getFinancialReportData =
    (userDbConnection, adminDbConnection) => async (req, res) => {
      const { userId, year, professionId, startDate, endDate } = req.params;
  
      // Default to full year if startDate and endDate are not provided
      const effectiveStartDate = startDate || `01-01-${year}`;
      const effectiveEndDate = endDate || `31-12-${year}`;
  
      try {
        // Create mock responses for each controller call
        const monthlyExpensesMock = mockResponse();
        const monthlyIncomesMock = mockResponse();
        const expenseAnalysisMock = mockResponse();
        const incomeAnalysisMock = mockResponse();
  
        // Execute all controller functions concurrently
        await Promise.all([
          getMonthlyExpenseTotals(userDbConnection, adminDbConnection)(
            { params: { userId, year } }, // Still year-based for monthly totals
            monthlyExpensesMock
          ),
          getMonthlyIncomeTotals(userDbConnection, adminDbConnection)(
            { params: { userId, year } }, // Still year-based for monthly totals
            monthlyIncomesMock
          ),
          getExpenseAnalysis(userDbConnection, adminDbConnection)(
            {
              params: { userId, startDate: effectiveStartDate, endDate: effectiveEndDate },
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
  
        // Extract captured data from mock responses
        const monthlyExpensesData = monthlyExpensesMock.getData();
        const monthlyIncomesData = monthlyIncomesMock.getData();
        const expenseAnalysisData = expenseAnalysisMock.getData();
        const incomeAnalysisData = incomeAnalysisMock.getData();
  
        // Check if all data was successfully retrieved
        if (
          !monthlyExpensesData ||
          !monthlyIncomesData ||
          !expenseAnalysisData ||
          !incomeAnalysisData
        ) {
          throw new Error("One or more data fetches failed");
        }
  
        // Send the combined response
        res.status(200).json({
          success: true,
          message: `Financial report data for ${year} from ${effectiveStartDate} to ${effectiveEndDate} retrieved successfully`,
          data: {
            monthlyExpenses: monthlyExpensesData.data.monthlyTotals,
            monthlyIncomes: monthlyIncomesData.data.monthlyTotals,
            expenseAnalysis: expenseAnalysisData.data,
            incomeAnalysis: incomeAnalysisData.data,
          },
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