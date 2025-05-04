// import React, { useEffect, useState } from "react";
// import { Bar, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import * as XLSX from "xlsx";
// import useFinancialReportStore from "../store/UserStore/useFinancialReportStore.js";
// import { userStore } from "../store/UserStore/userAuthStore";
// // Register ChartJS components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );

// const ReportPage = () => {
//   const {
//     monthlyExpenses,
//     monthlyIncomes,
//     expenseAnalysis,
//     incomeAnalysis,
//     loading,
//     error,
//     fetchReportData,
//   } = useFinancialReportStore();
//   const { currentUser } = userStore();
//   const userId = currentUser?._id;
//   const professionId = currentUser?.profession;
//   const userName = currentUser?.name;

//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from(
//     { length: currentYear - 1999 },
//     (_, i) => currentYear - i
//   );
//   const [year, setYear] = useState(currentYear.toString());

//   useEffect(() => {
//     fetchReportData(userId, year, professionId);
//   }, [year, fetchReportData, userId, professionId]);

//   // Calculate totals
//   const totalIncome = incomeAnalysis?.totalIncome?.amount || "0.00";
//   const totalExpenses = expenseAnalysis?.totalExpense?.amount || "0.00";
//   const netBalance = (parseFloat(totalIncome) - parseFloat(totalExpenses)).toFixed(2);
//   const currency = monthlyExpenses[0]?.currency || "₹";

//   // Chart Data
//   const monthlyChartData = {
//     labels: monthlyExpenses.map((m) => m.monthName),
//     datasets: [
//       { label: "Income", data: monthlyIncomes.map((m) => m.total), backgroundColor: "rgba(75, 192, 192, 0.6)" },
//       { label: "Expenses", data: monthlyExpenses.map((m) => m.total), backgroundColor: "rgba(255, 99, 132, 0.6)" },
//     ],
//   };

//   const incomePieData = {
//     labels: incomeAnalysis?.categoryBreakdown.map((c) => c.category) || [],
//     datasets: [
//       {
//         data: incomeAnalysis?.categoryBreakdown.map((c) => c.percentage) || [],
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//       },
//     ],
//   };

//   const expensePieData = {
//     labels: expenseAnalysis?.categoryBreakdown.map((c) => c.category) || [],
//     datasets: [
//       {
//         data: expenseAnalysis?.categoryBreakdown.map((c) => c.percentage) || [],
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//       },
//     ],
//   };

//   // Separate Currency Pie Charts
//   const incomeCurrencyPieData = {
//     labels: incomeAnalysis?.currencyBreakdown.map((c) => c.currency) || [],
//     datasets: [
//       {
//         data: incomeAnalysis?.currencyBreakdown.map((c) => c.percentage) || [],
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//       },
//     ],
//   };

//   const expenseCurrencyPieData = {
//     labels: expenseAnalysis?.currencyBreakdown.map((c) => c.currency) || [],
//     datasets: [
//       {
//         data: expenseAnalysis?.currencyBreakdown.map((c) => c.percentage) || [],
//         backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
//       },
//     ],
//   };

//   // Additional Insights
//   const highestSpendingMonth = monthlyExpenses.reduce(
//     (max, curr) => (parseFloat(curr.total) > parseFloat(max.total) ? curr : max),
//     monthlyExpenses[0] || { monthName: "N/A", total: "0.00" }
//   );
//   const highestIncomeMonth = monthlyIncomes.reduce(
//     (max, curr) => (parseFloat(curr.total) > parseFloat(max.total) ? curr : max),
//     monthlyIncomes[0] || { monthName: "N/A", total: "0.00" }
//   );
//   const mostUsedIncomeCategory = incomeAnalysis?.categoryBreakdown.reduce(
//     (max, curr) => (curr.usageCount > max.usageCount ? curr : max),
//     incomeAnalysis?.categoryBreakdown[0] || { category: "N/A", usageCount: 0 }
//   );
//   const mostUsedExpenseCategory = expenseAnalysis?.categoryBreakdown.reduce(
//     (max, curr) => (curr.usageCount > max.usageCount ? curr : max),
//     expenseAnalysis?.categoryBreakdown[0] || { category: "N/A", usageCount: 0 }
//   );

//   // PDF Export with Improved Header
//   const exportToPDF = async () => {
//     const pdf = new jsPDF("p", "mm", "a4");
//     const pageWidth = 210;
//     const pageHeight = 297;
//     const margin = 10;
//     const headerHeight = 25;
//     let yPosition = headerHeight + margin;

//     const addSection = async (elementId, title) => {
//       const element = document.getElementById(elementId);
//       if (!element) return;

//       const canvas = await html2canvas(element, { scale: 2 });
//       const imgData = canvas.toDataURL("image/png");
//       const imgHeight = (canvas.height * (pageWidth - 2 * margin)) / canvas.width;

//       if (yPosition + imgHeight + 20 > pageHeight - margin) {
//         pdf.addPage();
//         yPosition = headerHeight + margin;
//       }

//       pdf.setFontSize(14);
//       pdf.setTextColor(0, 102, 204);
//       pdf.text(title, margin, yPosition);
//       yPosition += 10;

//       pdf.addImage(imgData, "PNG", margin, yPosition, pageWidth - 2 * margin, imgHeight);
//       yPosition += imgHeight + 10;
//     };

//     const addHeaderFooter = () => {
//       const pageCount = pdf.internal.getNumberOfPages();
//       for (let i = 1; i <= pageCount; i++) {
//         pdf.setPage(i);
//         pdf.setFillColor(240, 248, 255);
//         pdf.rect(0, 0, pageWidth, headerHeight, "F");
//         pdf.setFontSize(18);
//         pdf.setTextColor(0, 102, 204);
//         pdf.text("Expense Tracker Report", margin, 15);
//         pdf.setFontSize(10);
//         pdf.setTextColor(100);
//         pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 22);
//         pdf.setFontSize(10);
//         pdf.setTextColor(150);
//         pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 5, { align: "right" });
//       }
//     };

//     await addSection("summary-section", "Summary");
//     await addSection("monthly-chart-section", "Monthly Income vs Expenses");
//     await addSection("monthly-table-section", "Monthly Summary");
//     await addSection("income-section", "Income Categories");
//     await addSection("expense-section", "Expense Categories");
//     await addSection("income-currency-section", "Income Currency Usage");
//     await addSection("expense-currency-section", "Expense Currency Usage");
//     await addSection("insights-section", "Additional Insights");

//     addHeaderFooter();
//     pdf.save(`Financial_Report_${year}.pdf`);
//   };

//   // Updated Excel Export
//   const exportToExcel = () => {
//     const wb = XLSX.utils.book_new();
//     const wsData = [];

//     wsData.push(["Financial Report", "", "", ""]);
//     wsData.push(["Total Income", `${currency}${totalIncome}`, "", ""]);
//     wsData.push(["Total Expenses", `${currency}${totalExpenses}`, "", ""]);
//     wsData.push(["Net Balance", `${currency}${netBalance}`, "", ""]);
//     wsData.push([]);

//     wsData.push(["Monthly Summary", "", "", "", ""]);
//     wsData.push(["Month #", "Month Name", "Income", "Expenses", "Net"]);
//     monthlyIncomes.forEach((income, index) => {
//       wsData.push([
//         income.monthNumber,
//         income.monthName,
//         income.total,
//         monthlyExpenses[index].total,
//         (parseFloat(income.total) - parseFloat(monthlyExpenses[index].total)).toFixed(2),
//       ]);
//     });
//     wsData.push([]);

//     wsData.push(["Monthly Chart Data", "", "", ""]);
//     wsData.push(["Month Name", "Income", "Expenses"]);
//     monthlyExpenses.forEach((m, index) => {
//       wsData.push([m.monthName, monthlyIncomes[index].total, m.total]);
//     });
//     wsData.push([]);

//     wsData.push(["Income Categories", "", "", "", ""]);
//     wsData.push(["Index", "Category", "Total", "Percentage", "Usage Count"]);
//     incomeAnalysis?.categoryBreakdown.forEach((c) => {
//       wsData.push([c.index, c.category, c.total, c.percentage, c.usageCount]);
//     });
//     wsData.push([]);

//     wsData.push(["Income Pie Chart Data", "", "", ""]);
//     wsData.push(["Category", "Percentage"]);
//     incomeAnalysis?.categoryBreakdown.forEach((c) => {
//       wsData.push([c.category, c.percentage]);
//     });
//     wsData.push([]);

//     wsData.push(["Expense Categories", "", "", "", ""]);
//     wsData.push(["Index", "Category", "Total", "Percentage", "Usage Count"]);
//     expenseAnalysis?.categoryBreakdown.forEach((c) => {
//       wsData.push([c.index, c.category, c.total, c.percentage, c.usageCount]);
//     });
//     wsData.push([]);

//     wsData.push(["Expense Pie Chart Data", "", "", ""]);
//     wsData.push(["Category", "Percentage"]);
//     expenseAnalysis?.categoryBreakdown.forEach((c) => {
//       wsData.push([c.category, c.percentage]);
//     });
//     wsData.push([]);

//     // Separate Income Currency Usage
//     wsData.push(["Income Currency Usage", "", "", "", ""]);
//     wsData.push(["Currency", "Total Amount", "Percentage", "Transaction Count"]);
//     incomeAnalysis?.currencyBreakdown.forEach((c) => {
//       wsData.push([c.currency, c.total, c.percentage, c.usageCount]);
//     });
//     wsData.push([]);

//     wsData.push(["Income Currency Pie Chart Data", "", "", ""]);
//     wsData.push(["Currency", "Percentage"]);
//     incomeAnalysis?.currencyBreakdown.forEach((c) => {
//       wsData.push([c.currency, c.percentage]);
//     });
//     wsData.push([]);

//     // Separate Expense Currency Usage
//     wsData.push(["Expense Currency Usage", "", "", "", ""]);
//     wsData.push(["Currency", "Total Amount", "Percentage", "Transaction Count"]);
//     expenseAnalysis?.currencyBreakdown.forEach((c) => {
//       wsData.push([c.currency, c.total, c.percentage, c.usageCount]);
//     });
//     wsData.push([]);

//     wsData.push(["Expense Currency Pie Chart Data", "", "", ""]);
//     wsData.push(["Currency", "Percentage"]);
//     expenseAnalysis?.currencyBreakdown.forEach((c) => {
//       wsData.push([c.currency, c.percentage]);
//     });
//     wsData.push([]);

//     wsData.push(["Additional Insights", "", "", ""]);
//     wsData.push(["Insight", "Value"]);
//     wsData.push(["Highest Spending Month", `${highestSpendingMonth.monthName}: ${currency}${highestSpendingMonth.total}`]);
//     wsData.push(["Highest Income Month", `${highestIncomeMonth.monthName}: ${currency}${highestIncomeMonth.total}`]);
//     wsData.push(["Most Used Income Category", `${mostUsedIncomeCategory.category} (${mostUsedIncomeCategory.usageCount} transactions)`]);
//     wsData.push(["Most Used Expense Category", `${mostUsedExpenseCategory.category} (${mostUsedExpenseCategory.usageCount} transactions)`]);

//     const ws = XLSX.utils.aoa_to_sheet(wsData);
//     wsData.forEach((row, rowIndex) => {
//       if (row.length >= 2 && rowIndex > 0 && (row[0] === "Month #" || row[0] === "Index" || row[0] === "Currency" || row[0] === "Insight")) {
//         for (let col = 0; col < Math.min(row.length, 5); col++) {
//           const cell = XLSX.utils.encode_cell({ r: rowIndex, c: col });
//           ws[cell].s = { font: { bold: true }, fill: { fgColor: { rgb: "D3D3D3" } } };
//         }
//       }
//     });
//     XLSX.utils.book_append_sheet(wb, ws, "Financial Report");
//     XLSX.writeFile(wb, `Financial_Report_${year}.xlsx`);
//   };

//   if (loading)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//           <strong className="font-bold">Error:</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       </div>
//     );

//   return (
//     <div id="report-page" className="bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <header className="bg-white shadow-md p-4 md:p-6 mb-6">
//         <div className="container mx-auto">
//           <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
//               Financial Report for {userName} - {year}
//             </h1>
//             <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//               <div className="flex items-center">
//                 <label className="mr-2 text-gray-700">Year: </label>
//                 <select
//                   value={year}
//                   onChange={(e) => setYear(e.target.value)}
//                   className="border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   {yearOptions.map((yr) => (
//                     <option key={yr} value={yr}>
//                       {yr}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex gap-2">
//                 <button
//                   onClick={exportToPDF}
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                     />
//                   </svg>
//                   PDF
//                 </button>
//                 <button
//                   onClick={exportToExcel}
//                   className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
//                 >
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-4 w-4 mr-1"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                     />
//                   </svg>
//                   Excel
//                 </button>
//               </div>
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">Generated on {new Date().toLocaleDateString()}</p>
//         </div>
//       </header>

//       {/* Main Content */}
//       <div className="container mx-auto px-4 pb-12">
//         <section id="summary-section" className="mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
//               <p className="text-sm text-gray-500 mb-1">Total Income</p>
//               <p className="text-2xl font-bold text-gray-800">{currency}{totalIncome}</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
//               <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
//               <p className="text-2xl font-bold text-gray-800">{currency}{totalExpenses}</p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//               <p className="text-sm text-gray-500 mb-1">Net Balance</p>
//               <p className={`text-2xl font-bold ${parseFloat(netBalance) >= 0 ? "text-green-600" : "text-red-600"}`}>
//                 {currency}{netBalance}
//               </p>
//             </div>
//           </div>
//         </section>

//         <section id="monthly-chart-section" className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Income vs Expenses</h2>
//           <div className="h-64 md:h-80">
//             <Bar
//               data={monthlyChartData}
//               options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } } }}
//             />
//           </div>
//         </section>

//         <section id="monthly-table-section" className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Summary</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month #</th>
//                   <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month Name</th>
//                   <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income ({currency})</th>
//                   <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses ({currency})</th>
//                   <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net ({currency})</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {monthlyIncomes.map((income, index) => (
//                   <tr key={income.monthNumber} className="hover:bg-gray-50">
//                     <td className="py-2 px-3 text-sm text-gray-500">{income.monthNumber}</td>
//                     <td className="py-2 px-3 text-sm text-gray-800">{income.monthName}</td>
//                     <td className="py-2 px-3 text-sm text-gray-800">{income.total}</td>
//                     <td className="py-2 px-3 text-sm text-gray-800">{monthlyExpenses[index].total}</td>
//                     <td className="py-2 px-3 text-sm text-gray-800">
//                       {(parseFloat(income.total) - parseFloat(monthlyExpenses[index].total)).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//           <section id="income-section" className="bg-white rounded-lg shadow-md p-4 md:p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Income Categories</h2>
//             <div className="h-64 sm:h-72 mb-6">
//               <Pie
//                 data={incomePieData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "right", labels: { boxWidth: 12 } } },
//                 }}
//               />
//             </div>
//             <div className="overflow-x-auto">
//               <div className="h-[25vh] overflow-x-auto overflow-y-auto">
//                 <table className="min-w-full bg-white">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ({currency})</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {incomeAnalysis?.categoryBreakdown.map((c) => (
//                       <tr key={c.index} className="hover:bg-gray-50">
//                         <td className="py-2 px-3 text-sm text-gray-500">{c.index}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.category}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.total}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.percentage}%</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.usageCount}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>

//           <section id="expense-section" className="bg-white rounded-lg shadow-md p-4 md:p-6">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Categories</h2>
//             <div className="h-64 sm:h-72 mb-6">
//               <Pie
//                 data={expensePieData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "right", labels: { boxWidth: 12 } } },
//                 }}
//               />
//             </div>
//             <div className="overflow-x-auto">
//               <div className="h-[25vh] overflow-x-auto overflow-y-auto">
//                 <table className="min-w-full bg-white">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total ({currency})</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
//                       <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {expenseAnalysis?.categoryBreakdown.map((c) => (
//                       <tr key={c.index} className="hover:bg-gray-50">
//                         <td className="py-2 px-3 text-sm text-gray-500">{c.index}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.category}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.total}</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.percentage}%</td>
//                         <td className="py-2 px-3 text-sm text-gray-800">{c.usageCount}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </section>
//         </div>

//         {/*Currency Usage Section */}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           <section id="income-currency-section" className="bg-white rounded-lg shadow-md p-4 md:p-6">

//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Income Currency Usage</h2>
//             <div className="h-64 md:h-72 mb-6">
//               <Pie
//                 data={incomeCurrencyPieData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "right", labels: { boxWidth: 12 } } },
//                 }}
//               />
//             </div>

//             <div className="h-[25vh] overflow-x-auto overflow-y-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount ({currency})</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Count</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {incomeAnalysis?.currencyBreakdown.map((c, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.currency}</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.total}</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.percentage}%</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.usageCount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </section>

//           <section id="expense-currency-section" className="bg-white rounded-lg shadow-md p-4 md:p-6">

//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Currency Usage</h2>
//             <div className="h-64 md:h-72 mb-6">
//               <Pie
//                 data={expenseCurrencyPieData}
//                 options={{
//                   responsive: true,
//                   maintainAspectRatio: false,
//                   plugins: { legend: { position: "right", labels: { boxWidth: 12 } } },
//                 }}
//               />
//             </div>

//             <div className="h-[25vh] overflow-x-auto overflow-y-auto">
//               <table className="min-w-full bg-white">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Currency</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount ({currency})</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
//                     <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Count</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {expenseAnalysis?.currencyBreakdown.map((c, index) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.currency}</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.total}</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.percentage}%</td>
//                       <td className="py-2 px-3 text-sm text-gray-800">{c.usageCount}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//           </section>

//         </div>

//         <section id="insights-section" className="mt-8">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Insights</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white rounded-lg shadow-md p-4">
//               <p className="text-sm text-gray-500">Highest Spending Month</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {highestSpendingMonth?.monthName}: {currency}{highestSpendingMonth?.total}
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-4">
//               <p className="text-sm text-gray-500">Highest Income Month</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {highestIncomeMonth?.monthName}: {currency}{highestIncomeMonth?.total}
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-4">
//               <p className="text-sm text-gray-500">Most Used Income Category</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {mostUsedIncomeCategory?.category} ({mostUsedIncomeCategory?.usageCount} transactions)
//               </p>
//             </div>
//             <div className="bg-white rounded-lg shadow-md p-4">
//               <p className="text-sm text-gray-500">Most Used Expense Category</p>
//               <p className="text-lg font-semibold text-gray-800">
//                 {mostUsedExpenseCategory?.category} ({mostUsedExpenseCategory?.usageCount} transactions)
//               </p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default ReportPage;

import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ExcelJS from "exceljs";
import useFinancialReportStore from "../store/UserStore/useFinancialReportStore.js";
import { userStore } from "../store/UserStore/userAuthStore";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportPage = () => {
  const {
    monthlyExpenses,
    monthlyIncomes,
    expenseAnalysis,
    incomeAnalysis,
    loading,
    error,
    fetchReportData,
  } = useFinancialReportStore();
  const { currentUser } = userStore();
  const userId = currentUser?._id;
  const professionId = currentUser?.profession;
  const userName = currentUser?.name;

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: currentYear - 1999 },
    (_, i) => currentYear - i
  );
  const [year, setYear] = useState(currentYear.toString());

  useEffect(() => {
    fetchReportData(userId, year, professionId);
  }, [year, fetchReportData, userId, professionId]);

  // Calculate totals
  const totalIncome = incomeAnalysis?.totalIncome?.amount || "0.00";
  const totalExpenses = expenseAnalysis?.totalExpense?.amount || "0.00";
  const netBalance = (
    parseFloat(totalIncome) - parseFloat(totalExpenses)
  ).toFixed(2);
  const currency = monthlyExpenses[0]?.currency || "₹";

  // Chart Data
  const monthlyChartData = {
    labels: monthlyExpenses.map((m) => m.monthName),
    datasets: [
      {
        label: "Income",
        data: monthlyIncomes.map((m) => m.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "Expenses",
        data: monthlyExpenses.map((m) => m.total),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  const incomePieData = {
    labels: incomeAnalysis?.categoryBreakdown.map((c) => c.category) || [],
    datasets: [
      {
        data: incomeAnalysis?.categoryBreakdown.map((c) => c.percentage) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const expensePieData = {
    labels: expenseAnalysis?.categoryBreakdown.map((c) => c.category) || [],
    datasets: [
      {
        data: expenseAnalysis?.categoryBreakdown.map((c) => c.percentage) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Separate Currency Pie Charts
  const incomeCurrencyPieData = {
    labels: incomeAnalysis?.currencyBreakdown.map((c) => c.currency) || [],
    datasets: [
      {
        data: incomeAnalysis?.currencyBreakdown.map((c) => c.percentage) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  const expenseCurrencyPieData = {
    labels: expenseAnalysis?.currencyBreakdown.map((c) => c.currency) || [],
    datasets: [
      {
        data: expenseAnalysis?.currencyBreakdown.map((c) => c.percentage) || [],
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
      },
    ],
  };

  // Additional Insights
  const highestSpendingMonth = monthlyExpenses.reduce(
    (max, curr) =>
      parseFloat(curr.total) > parseFloat(max.total) ? curr : max,
    monthlyExpenses[0] || { monthName: "N/A", total: "0.00" }
  );
  const highestIncomeMonth = monthlyIncomes.reduce(
    (max, curr) =>
      parseFloat(curr.total) > parseFloat(max.total) ? curr : max,
    monthlyIncomes[0] || { monthName: "N/A", total: "0.00" }
  );
  const mostUsedIncomeCategory = incomeAnalysis?.categoryBreakdown.reduce(
    (max, curr) => (curr.usageCount > max.usageCount ? curr : max),
    incomeAnalysis?.categoryBreakdown[0] || { category: "N/A", usageCount: 0 }
  );
  const mostUsedExpenseCategory = expenseAnalysis?.categoryBreakdown.reduce(
    (max, curr) => (curr.usageCount > max.usageCount ? curr : max),
    expenseAnalysis?.categoryBreakdown[0] || { category: "N/A", usageCount: 0 }
  );

  // PDF Export with Improved Header
  const exportToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 10;
    const headerHeight = 25;
    let yPosition = headerHeight + margin;

    const addSection = async (elementId, title) => {
      const element = document.getElementById(elementId);
      if (!element) return;

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgHeight =
        (canvas.height * (pageWidth - 2 * margin)) / canvas.width;

      if (yPosition + imgHeight + 20 > pageHeight - margin) {
        pdf.addPage();
        yPosition = headerHeight + margin;
      }

      pdf.setFontSize(14);
      pdf.setTextColor(0, 102, 204);
      pdf.text(title, margin, yPosition);
      yPosition += 10;

      pdf.addImage(
        imgData,
        "PNG",
        margin,
        yPosition,
        pageWidth - 2 * margin,
        imgHeight
      );
      yPosition += imgHeight + 10;
    };

    const addHeaderFooter = () => {
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFillColor(240, 248, 255);
        pdf.rect(0, 0, pageWidth, headerHeight, "F");
        pdf.setFontSize(18);
        pdf.setTextColor(0, 102, 204);
        pdf.text("Expense Tracker Report", margin, 15);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 22);
        pdf.setFontSize(10);
        pdf.setTextColor(150);
        pdf.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - margin,
          pageHeight - 5,
          { align: "right" }
        );
      }
    };

    await addSection("summary-section", "Summary");
    await addSection("monthly-chart-section", "Monthly Income vs Expenses");
    await addSection("monthly-table-section", "Monthly Summary");
    await addSection("income-section", "Income Categories");
    await addSection("expense-section", "Expense Categories");
    await addSection("income-currency-section", "Income Currency Usage");
    await addSection("expense-currency-section", "Expense Currency Usage");
    await addSection("insights-section", "Additional Insights");

    addHeaderFooter();
    pdf.save(`Financial_Report_${year}.pdf`);
  };

  // Updated Excel Export using exceljs
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Financial Report");

    // Define column headers
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Value", key: "value", width: 20 },
      { header: "", key: "spacer1", width: 10 },
      { header: "", key: "spacer2", width: 10 },
      { header: "", key: "spacer3", width: 10 },
    ];

    // Helper function to add a row with optional styling
    const addRow = (data, isHeader = false) => {
      const row = worksheet.addRow(data);
      if (isHeader) {
        row.eachCell((cell) => {
          cell.font = { bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFD3D3D3" },
          };
        });
      }
      return row;
    };

    // Financial Report Summary
    addRow(["Financial Report"]);
    addRow(["Total Income", `${currency}${totalIncome}`]);
    addRow(["Total Expenses", `${currency}${totalExpenses}`]);
    addRow(["Net Balance", `${currency}${netBalance}`]);
    addRow([]);

    // Monthly Summary
    addRow(["Monthly Summary"]);
    addRow(["Month #", "Month Name", "Income", "Expenses", "Net"], true);
    monthlyIncomes.forEach((income, index) => {
      addRow([
        income.monthNumber,
        income.monthName,
        income.total,
        monthlyExpenses[index].total,
        (
          parseFloat(income.total) - parseFloat(monthlyExpenses[index].total)
        ).toFixed(2),
      ]);
    });
    addRow([]);

    // Monthly Chart Data
    addRow(["Monthly Chart Data"]);
    addRow(["Month Name", "Income", "Expenses"], true);
    monthlyExpenses.forEach((m, index) => {
      addRow([m.monthName, monthlyIncomes[index].total, m.total]);
    });
    addRow([]);

    // Income Categories
    addRow(["Income Categories"]);
    addRow(["Index", "Category", "Total", "Percentage", "Usage Count"], true);
    incomeAnalysis?.categoryBreakdown.forEach((c) => {
      addRow([c.index, c.category, c.total, c.percentage, c.usageCount]);
    });
    addRow([]);

    // Income Pie Chart Data
    addRow(["Income Pie Chart Data"]);
    addRow(["Category", "Percentage"], true);
    incomeAnalysis?.categoryBreakdown.forEach((c) => {
      addRow([c.category, c.percentage]);
    });
    addRow([]);

    // Expense Categories
    addRow(["Expense Categories"]);
    addRow(["Index", "Category", "Total", "Percentage", "Usage Count"], true);
    expenseAnalysis?.categoryBreakdown.forEach((c) => {
      addRow([c.index, c.category, c.total, c.percentage, c.usageCount]);
    });
    addRow([]);

    // Expense Pie Chart Data
    addRow(["Expense Pie Chart Data"]);
    addRow(["Category", "Percentage"], true);
    expenseAnalysis?.categoryBreakdown.forEach((c) => {
      addRow([c.category, c.percentage]);
    });
    addRow([]);

    // Income Currency Usage
    addRow(["Income Currency Usage"]);
    addRow(
      ["Currency", "Total Amount", "Percentage", "Transaction Count"],
      true
    );
    incomeAnalysis?.currencyBreakdown.forEach((c) => {
      addRow([c.currency, c.total, c.percentage, c.usageCount]);
    });
    addRow([]);

    // Income Currency Pie Chart Data
    addRow(["Income Currency Pie Chart Data"]);
    addRow(["Currency", "Percentage"], true);
    incomeAnalysis?.currencyBreakdown.forEach((c) => {
      addRow([c.currency, c.percentage]);
    });
    addRow([]);

    // Expense Currency Usage
    addRow(["Expense Currency Usage"]);
    addRow(
      ["Currency", "Total Amount", "Percentage", "Transaction Count"],
      true
    );
    expenseAnalysis?.currencyBreakdown.forEach((c) => {
      addRow([c.currency, c.total, c.percentage, c.usageCount]);
    });
    addRow([]);

    // Expense Currency Pie Chart Data
    addRow(["Expense Currency Pie Chart Data"]);
    addRow(["Currency", "Percentage"], true);
    expenseAnalysis?.currencyBreakdown.forEach((c) => {
      addRow([c.currency, c.percentage]);
    });
    addRow([]);

    // Additional Insights
    addRow(["Additional Insights"]);
    addRow(["Insight", "Value"], true);
    addRow([
      "Highest Spending Month",
      `${highestSpendingMonth.monthName}: ${currency}${highestSpendingMonth.total}`,
    ]);
    addRow([
      "Highest Income Month",
      `${highestIncomeMonth.monthName}: ${currency}${highestIncomeMonth.total}`,
    ]);
    addRow([
      "Most Used Income Category",
      `${mostUsedIncomeCategory.category} (${mostUsedIncomeCategory.usageCount} transactions)`,
    ]);
    addRow([
      "Most Used Expense Category",
      `${mostUsedExpenseCategory.category} (${mostUsedExpenseCategory.usageCount} transactions)`,
    ]);

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Financial_Report_${year}.xlsx`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );

  return (
    <div id="report-page" className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 md:p-6 mb-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Financial Report for {userName} - {year}
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex items-center">
                <label className="mr-2 text-gray-700">Year: </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {yearOptions.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportToPDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Excel
                </button>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Generated on {new Date().toLocaleDateString()}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        <section id="summary-section" className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
              <p className="text-sm text-gray-500 mb-1">Total Income</p>
              <p className="text-2xl font-bold text-gray-800">
                {currency}
                {totalIncome}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
              <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-800">
                {currency}
                {totalExpenses}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500 mb-1">Net Balance</p>
              <p
                className={`text-2xl font-bold ${
                  parseFloat(netBalance) >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {currency}
                {netBalance}
              </p>
            </div>
          </div>
        </section>

        <section
          id="monthly-chart-section"
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Income vs Expenses
          </h2>
          <div className="h-64 md:h-80">
            <Bar
              data={monthlyChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </section>

        <section
          id="monthly-table-section"
          className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Monthly Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month #
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Month Name
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Income ({currency})
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expenses ({currency})
                  </th>
                  <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net ({currency})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {monthlyIncomes.map((income, index) => (
                  <tr key={income.monthNumber} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-sm text-gray-500">
                      {income.monthNumber}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-800">
                      {income.monthName}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-800">
                      {income.total}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-800">
                      {monthlyExpenses[index].total}
                    </td>
                    <td className="py-2 px-3 text-sm text-gray-800">
                      {(
                        parseFloat(income.total) -
                        parseFloat(monthlyExpenses[index].total)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <section
            id="income-section"
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Income Categories
            </h2>
            <div className="h-64 sm:h-72 mb-6">
              <Pie
                data={incomePieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right", labels: { boxWidth: 12 } },
                  },
                }}
              />
            </div>
            <div className="overflow-x-auto">
              <div className="h-[25vh] overflow-x-auto overflow-y-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Index
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total ({currency})
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {incomeAnalysis?.categoryBreakdown.map((c) => (
                      <tr key={c.index} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm text-gray-500">
                          {c.index}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.category}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.total}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.percentage}%
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.usageCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section
            id="expense-section"
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Expense Categories
            </h2>
            <div className="h-64 sm:h-72 mb-6">
              <Pie
                data={expensePieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right", labels: { boxWidth: 12 } },
                  },
                }}
              />
            </div>
            <div className="overflow-x-auto">
              <div className="h-[25vh] overflow-x-auto overflow-y-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Index
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total ({currency})
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {expenseAnalysis?.categoryBreakdown.map((c) => (
                      <tr key={c.index} className="hover:bg-gray-50">
                        <td className="py-2 px-3 text-sm text-gray-500">
                          {c.index}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.category}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.total}
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.percentage}%
                        </td>
                        <td className="py-2 px-3 text-sm text-gray-800">
                          {c.usageCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Currency Usage Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section
            id="income-currency-section"
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Income Currency Usage
            </h2>
            <div className="h-64 md:h-72 mb-6">
              <Pie
                data={incomeCurrencyPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right", labels: { boxWidth: 12 } },
                  },
                }}
              />
            </div>
            <div className="h-[25vh] overflow-x-auto overflow-y-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount ({currency})
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {incomeAnalysis?.currencyBreakdown.map((c, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.currency}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.total}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.percentage}%
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.usageCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            id="expense-currency-section"
            className="bg-white rounded-lg shadow-md p-4 md:p-6"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Expense Currency Usage
            </h2>
            <div className="h-64 md:h-72 mb-6">
              <Pie
                data={expenseCurrencyPieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: "right", labels: { boxWidth: 12 } },
                  },
                }}
              />
            </div>
            <div className="h-[25vh] overflow-x-auto overflow-y-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount ({currency})
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {expenseAnalysis?.currencyBreakdown.map((c, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.currency}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.total}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.percentage}%
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-800">
                        {c.usageCount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section id="insights-section" className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Additional Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-500">Highest Spending Month</p>
              <p className="text-lg font-semibold text-gray-800">
                {highestSpendingMonth?.monthName}: {currency}
                {highestSpendingMonth?.total}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-500">Highest Income Month</p>
              <p className="text-lg font-semibold text-gray-800">
                {highestIncomeMonth?.monthName}: {currency}
                {highestIncomeMonth?.total}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-500">Most Used Income Category</p>
              <p className="text-lg font-semibold text-gray-800">
                {mostUsedIncomeCategory?.category} (
                {mostUsedIncomeCategory?.usageCount} transactions)
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4">
              <p className="text-sm text-gray-500">
                Most Used Expense Category
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {mostUsedExpenseCategory?.category} (
                {mostUsedExpenseCategory?.usageCount} transactions)
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReportPage;
