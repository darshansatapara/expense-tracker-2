import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TransactionList } from "./TransactionList";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore";
import { userStore } from "../../store/UserStore/userAuthStore";
export const HistoryEntry = ({
  entry,
  isExpanded,
  toggleExpand,
  isExpense,
  loading, // New loading prop
}) => {
  const [defaultCurrencySymbol, setDefaultCurrencySymbol] = useState("");
  const { currentUser } = userStore();
  const userId = currentUser?._id;
  const { fetchCurrencyAndBudget } = userCategoryStore();
  useEffect(() => {
    const fetchDefaultCurrency = async () => {
      const defaultCurrency = await fetchCurrencyAndBudget(userId);

      setDefaultCurrencySymbol(defaultCurrency.defaultCurrency.symbol);
    };
    fetchDefaultCurrency();
  }, [fetchCurrencyAndBudget, userId]);

  if (loading) {
    return (
      <div className="mb-4 border rounded-lg overflow-hidden animate-pulse">
        <div className="bg-gray-200 p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
        </div>
        {isExpanded && (
          <div className="p-4 space-y-2">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-300 rounded"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
        <span className="text-gray-600">Date: {entry.date}</span>
        <span className="text-gray-600 transition-all duration-500 ">
          Offline Total: {defaultCurrencySymbol}
          {entry.offlineTotal.toFixed(2)}
        </span>
        <span className="text-gray-600 transition-all duration-500 ">
          Online Total: {defaultCurrencySymbol}
          {entry.onlineTotal.toFixed(2)}
        </span>
        <button
          onClick={toggleExpand}
          className="text-gray-600 focus:outline-none justify-self-end"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      {isExpanded && (
        <TransactionList
          transactions={entry.transactions}
          isExpense={isExpense}
        />
      )}
    </div>
  );
};
