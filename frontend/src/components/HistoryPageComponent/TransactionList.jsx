import React from "react";

export const TransactionList = ({ transactions, isExpense }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto p-2">
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex bg-gray-200 font-medium text-gray-700 p-2 rounded-t-lg">
            <div className="w-1/4 p-2 text-left">Amount</div>
            <div className="w-1/4 p-2 text-left">Mode</div>
            <div className="w-1/4 p-2 text-left">Category</div>
            {isExpense && (
              <div className="w-1/4 p-2 text-left">Sub-Category</div>
            )}
            <div className={`${isExpense ? "w-1/4" : "w-1/2"} p-2 text-left`}>
              Actions
            </div>
          </div>
          {/* Transactions */}
          {transactions.map((transaction, tIndex) => (
            <div
              key={tIndex}
              className={`flex items-center p-2 border-b ${
                tIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {/* Amount */}
              <div className="w-1/4 p-2 text-gray-600">
                {transaction.amount
                  ? `₹${parseFloat(transaction.amount).toFixed(2)}`
                  : "N/A"}
              </div>
              {/* Mode */}
              <div className="w-1/4 p-2 text-gray-600">
                {transaction.mode || "N/A"}
              </div>
              {/* Category */}
              <div className="w-1/4 p-2 text-gray-600">
                {transaction.category || "N/A"}
              </div>
              {/* Sub-Category (Only for Expense) */}
              {isExpense && (
                <div className="w-1/4 p-2 text-gray-600">
                  {transaction.subcategory || "N/A"}
                </div>
              )}
              {/* Actions */}
              <div className={`${isExpense ? "w-1/4" : "w-1/2"} p-2`}>
                <button className="text-blue-500 hover:underline">
                  View & Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
