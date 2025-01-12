import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TransactionList } from "./TransactionList";

export const HistoryEntry = ({ entry, isExpanded, toggleExpand }) => {
  const [offlineAnimate, setOfflineAnimate] = useState(false);
  const [onlineAnimate, setOnlineAnimate] = useState(false);

  const [prevOfflineTotal, setPrevOfflineTotal] = useState(entry.offlineTotal);
  const [prevOnlineTotal, setPrevOnlineTotal] = useState(entry.onlineTotal);

  useEffect(() => {
    if (prevOfflineTotal !== entry.offlineTotal) {
      setOfflineAnimate(true);
      setTimeout(() => setOfflineAnimate(false), 500); // Reset after animation
      setPrevOfflineTotal(entry.offlineTotal);
    }
  }, [entry.offlineTotal, prevOfflineTotal]);

  useEffect(() => {
    if (prevOnlineTotal !== entry.onlineTotal) {
      setOnlineAnimate(true);
      setTimeout(() => setOnlineAnimate(false), 500); // Reset after animation
      setPrevOnlineTotal(entry.onlineTotal);
    }
  }, [entry.onlineTotal, prevOnlineTotal]);

  return (
    <div className="mb-4 border rounded-lg overflow-hidden">
      <div className="bg-gray-200 p-4 flex justify-between items-center">
        <span className="text-gray-600">Date: {entry.date}</span>
        <span
          className={`text-gray-600 transition-all duration-500 ${
            offlineAnimate ? "transform scale-105 opacity-75" : ""
          }`}
        >
          Offline Total: ₹{entry.offlineTotal}
        </span>
        <span
          className={`text-gray-600 transition-all duration-500 ${
            onlineAnimate ? "transform scale-105 opacity-75" : ""
          }`}
        >
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
