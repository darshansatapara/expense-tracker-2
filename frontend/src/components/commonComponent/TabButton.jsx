import React from "react";

export const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`relative px-6 py-2 text-lg font-semibold transition-all duration-300 ${
        isActive ? "text-black" : "text-gray-500"
      } flex flex-col items-center`}
      onClick={onClick}
    >
      {label}
      {isActive && (
        <div className="absolute top-10 w-[100%] -translate-x-1/2 left-1/2 h-1 bg-black rounded-full shadow-md"></div>
      )}
    </button>
  );
};
