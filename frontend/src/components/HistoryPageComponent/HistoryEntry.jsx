import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TransactionList } from "./TransactionList";

export const HistoryEntry = ({ entry, isExpanded, toggleExpand }) => {
  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center">
        <span className="text-gray-600">Date: {entry.date}</span>
        <span className="text-gray-600">
          Offline Total: ₹{entry.offlineTotal}
        </span>
        <span className="text-gray-600">
          Online Total: ₹{entry.onlineTotal}
        </span>
        <button
          onClick={toggleExpand}
          className="text-gray-600 focus:outline-none"
        >
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>
      {isExpanded && <TransactionList transactions={entry.transactions} />}
    </div>
  );
};
