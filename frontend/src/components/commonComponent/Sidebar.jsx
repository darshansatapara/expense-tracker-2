import React from "react";

const Sidebar = () => {
  return (
    <div className="h-full w-64 bg-gray-100 flex flex-col justify-between shadow-md">
      {/* Top Section */}
      <div className="flex flex-col items-center py-6">
        {/* User Photo */}
        <div className="bg-yellow-400 rounded-full h-20 w-20 flex items-center justify-center">
          <span className="font-bold text-white text-3xl">U</span>
        </div>
        {/* User Name */}
        <span className="mt-4 text-lg font-semibold text-gray-700">
          user12345
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col px-4 space-y-2">
        {["Home", "History", "Analysis", "Reports", "Setting"].map((page) => (
          <button
            key={page}
            className="w-full text-left py-2 px-4 rounded-lg hover:bg-gray-200 text-gray-600 font-medium"
          >
            {page}
          </button>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center py-6">
        {/* Logo */}
        <div className="bg-yellow-400 rounded-lg px-6 py-3 flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 10h11M9 21V3M17 16l4-4m0 0l-4-4m4 4H9"
            />
          </svg>
          <span className="text-white font-bold">Expense Tracker</span>
        </div>

        {/* Privacy Consent */}
        <span className="mt-4 text-sm text-gray-500">
          © 2025 Expense Tracker. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
