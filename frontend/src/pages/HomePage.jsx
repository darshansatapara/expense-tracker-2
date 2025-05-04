import React, { useState, useEffect, useRef } from "react";
import { CirclePlus } from "lucide-react";
import { TabButton } from "../components/commonComponent/TabButton";
import dayjs from "dayjs";
import useUserExpenseStore from "../store/UserStore/userExpenseStore";
import { filterDataByDateRange } from "../components/commonComponent/formatEAndIData.js";
import useUserIncomeStore from "../store/UserStore/userIncomeStore";
import IncomeAndExpenseHome from "../components/homeComponent/IncomeAndExpenseHome";
import AddIncomeExpenseModel from "../components/commonComponent/AddIncomeExpenseModel";
import { userStore } from "../store/UserStore/userAuthStore.js";

function HomePage() {
  const { userExpenses, fetchUserExpenses } = useUserExpenseStore();
  const { fetchUserIncomes, userIncomes } = useUserIncomeStore();
  const { currentUser } = userStore();

  const userId = currentUser?._id;
  const profession = currentUser?.profession;
  const [option, setOption] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filteredExpense, setFilteredExpense] = useState(null);
  const [filteredIncome, setfilteredIncome] = useState(null);
  const [activeTab, setActiveTab] = useState("Expense");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // get current month of ghe user expense
  const getCurrentMonthDates = () => {
    const startDate = dayjs().startOf("month").format("DD-MM-YYYY"); // Start of the month
    const endDate = dayjs().endOf("month").format("DD-MM-YYYY"); // End of the month
    return { startDate, endDate };
  };
  const { startDate, endDate } = getCurrentMonthDates();

  // call the store to get user expense data of the current month
  if (activeTab === "Expense") {
    useEffect(() => {
      if (userId && startDate && endDate) {
        fetchUserExpenses(userId, startDate, endDate);
      }
    }, [fetchUserExpenses]);
  } else if (activeTab === "Income") {
    useEffect(() => {
      if (userId && startDate && endDate && profession) {
        fetchUserIncomes(userId, startDate, endDate, profession);
      }
    }, [fetchUserIncomes]);
  }

  // console.log("fetched data", userIncomes);
  if (activeTab === "Expense") {
    useEffect(() => {
      if (userExpenses) {
        const data = filterDataByDateRange(userExpenses);
        setFilteredExpense(data);
      }
    }, [userExpenses]);
    // console.log("userExpenses", userExpenses);
  } else if (activeTab === "Income") {
    useEffect(() => {
      if (userIncomes) {
        // console.log("userIncome", userIncomes);
        const data = filterDataByDateRange(userIncomes);
        setfilteredIncome(data);
      }
    }, [userIncomes]);
    // console.log("userIncomes", userIncomes);
  }

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option) => {
    // console.log("handleOptionClick", option);
    // setIsOpen(false);
    if (option) {
      setOption(option);
    } else {
      console.error("please select the option  ");
    }
    setIsModalVisible(true);
    setIsOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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
            <div className="flex md:text-lg  font-semibold text-center text-gray-500 dark:text-gray-400 mb-4">
              <div className="me-2">
                <TabButton
                  label="Expense"
                  isActive={activeTab === "Expense"}
                  onClick={() => setActiveTab("Expense")}
                />
              </div>
              <div className="me-2">
                <TabButton
                  label="Income"
                  isActive={activeTab === "Income"}
                  onClick={() => setActiveTab("Income")}
                />
              </div>
            </div>

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
                    onClick={() => handleOptionClick("Expense")}
                  >
                    Expense
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                    onClick={() => handleOptionClick("Income")}
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
            <IncomeAndExpenseHome
              activeTab={activeTab}
              filteredData={
                activeTab === "Expense" ? filteredExpense : filteredIncome
              }
            />
          </div>
        </div>
      </div>

      <AddIncomeExpenseModel
        option={option}
        isVisible={isModalVisible}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default HomePage;
