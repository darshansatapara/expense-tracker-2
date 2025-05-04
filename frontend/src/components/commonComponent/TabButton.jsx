import React from "react";

export const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`inline-block p-4 text-md md:text-lg  font-semibold transition-all duration-300 ${
        isActive
          ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-500 dark:border-blue-500"
          : "text-gray-500 hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 border-b-2 border-transparent"
      } rounded-t-lg flex flex-col items-center`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
