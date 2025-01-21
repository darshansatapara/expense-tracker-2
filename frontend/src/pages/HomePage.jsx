import React, { useState, useEffect, useRef } from "react";
import { CirclePlus } from "lucide-react";
import { TabButton } from "../components/commonComponent/TabButton";
import ExpenseHome from "../components/homeComponent/ExpenseHome";
import IncomeHome from "../components/homeComponent/IncomeHome";

function HomePage() {
  const [activeTab, setActiveTab] = useState("Expense");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    console.log(option); // Handle the click (e.g., navigate or show forms)
    setIsOpen(false); // Close the dropdown after selecting an option

    
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col items-center p-4 shadow-lg">
        <div className="w-full border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ul className="flex flex-wrap text-lg font-semibold text-center text-gray-500 dark:text-gray-400">
              <li className="me-2">
                <TabButton
                  label="Expense"
                  isActive={activeTab === "Expense"}
                  onClick={() => setActiveTab("Expense")}
                />
              </li>
              <li className="me-2">
                <TabButton
                  label="Income"
                  isActive={activeTab === "Income"}
                  onClick={() => setActiveTab("Income")}
                />
              </li>
            </ul>

            {/* Add Button */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 mb-1"
                onClick={toggleDropdown}
              >
                <CirclePlus className="w-5 h-5" />
                <span>ADD</span>
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => handleOptionClick("Add Expense")}
                  >
                    Expense
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => handleOptionClick("Add Income")}
                  >
                    Income
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="border border-gray-300 rounded-lg w-full">
          <div className="h-full overflow-auto p-4">
            {activeTab === "Expense" ? <ExpenseHome /> : <IncomeHome />}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
