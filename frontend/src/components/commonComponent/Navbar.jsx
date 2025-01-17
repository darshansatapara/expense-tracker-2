import React, { useEffect, useState } from "react";

const Navbar = () => {
  const dialogs = [
    "Hi, I am Expense Tracker. How may I help you?",
    "Track your expenses effortlessly!",
    "Stay on top of your finances!",
  ];

  const [dialogIndex, setDialogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDialogIndex((prevIndex) => (prevIndex + 1) % dialogs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dialogs.length]);

  return (
    <div className="w-full bg-gray-100 shadow-md">
      <nav className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-300 p-2 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
          </div>
          <span className="text-lg font-semibold">Expense Tracker</span>
        </div>

        {/* Middle Section */}
        <div className="hidden md:flex justify-center flex-grow">
          <div className="text-center text-sm md:text-lg font-medium text-gray-600 transition-opacity">
            {dialogs[dialogIndex]}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button className="relative">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-500 hover:text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 7 7.388 7 9v5.159c0 .538-.214 1.055-.595 1.436L5 17h5m5 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          <div className="bg-yellow-400 rounded-full h-8 w-8 flex items-center justify-center">
            <span className="font-bold text-white">U</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
