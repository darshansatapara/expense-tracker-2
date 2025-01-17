import { CirclePlus } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/commonComponent/Navbar";
import Sidebar from "../components/commonComponent/Sidebar";

function HomePage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("/expensehome");

  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <>
      <div className="flex flex-col items-center p-4 shadow-lg">
        <div className="w-full mb-4 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <ul className="flex flex-wrap text-lg font-semibold text-center text-gray-500 dark:text-gray-400">
              <li>
                <button
                  onClick={() => handleNavigation("/expensehome")}
                  className={`inline-block p-4 border-b-2 ${
                    activeTab === "/expensehome"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
                >
                  Expense
                </button>
              </li>
              <li className="me-2">
                <button
                  onClick={() => handleNavigation("/incomehome")}
                  className={`inline-block p-4 border-b-2 ${
                    activeTab === "/incomehome"
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  } rounded-t-lg`}
                >
                  Income
                </button>
              </li>
            </ul>

            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 mb-1">
              <CirclePlus className="w-5 h-5" />
              <span>ADD</span>
            </button>
          </div>
        </div>
        <div className="border border-gray-300 rounded-lg w-full overflow-hidden">
          <div className="h-full overflow-y-auto p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
