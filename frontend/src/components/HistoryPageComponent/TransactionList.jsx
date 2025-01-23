import React from "react";

export const TransactionList = ({ transactions, isExpense }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden p-2">
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border ">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-200 font-medium text-gray-700">
              <th className="w-1/4 p-3 text-left border ">Amount</th>
              <th className="w-1/4 p-3 text-left border ">Mode</th>
              <th className="w-1/4 p-3 text-left border ">Category</th>
              {isExpense && (
                <th className="w-1/4 p-3 text-left border ">Sub-Category</th>
              )}
              <th
                className={`${
                  isExpense ? "w-1/4" : "w-1/2"
                } p-3 text-left border `}
              >
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {transactions.map((transaction, tIndex) => (
              <tr
                key={tIndex}
                className={`${
                  tIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {/* Amount */}
                <td className="p-3 text-gray-700  ">
                  ₹
                  {transaction.amount
                    ? parseFloat(transaction.amount).toFixed(2)
                    : "N/A"}
                </td>
                {/* Mode */}
                <td className="p-3 text-gray-700  ">
                  {transaction.mode || "N/A"}
                </td>
                {/* Category */}
                <td className="p-3 text-gray-700  ">
                  {transaction.category || "N/A"}
                </td>
                {/* Sub-Category (Only for Expense) */}
                {isExpense && (
                  <td className="p-3 text-gray-700  ">
                    {transaction.subcategory || "N/A"}
                  </td>
                )}
                {/* Actions */}
                <td className="p-3  ">
                  <button className="text-blue-500 hover:underline">
                    View & Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
