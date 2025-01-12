import React, { useState, useEffect } from "react";
import { MenuOutlined } from "@ant-design/icons";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function Navbar({ selectedItem, toggleSidebar }) {
  const [currentContent, setCurrentContent] = useState(0);
  const content = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];
  const iconMap = {
    Home: <HomeOutlined className="text-lg text-gray-700" />,
    Analysis: <BarChartOutlined className="text-lg text-gray-700" />,
    History: <HistoryOutlined className="text-lg text-gray-700" />,
    Settings: <SettingOutlined className="text-lg text-gray-700" />,
    Reports: <FileTextOutlined className="text-lg text-gray-700" />,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % content.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [content.length]);

  return (
    <header className="bg-[fff] bg-opacity-80 backdrop-blur-md shadow-sm flex items-center justify-between px-4 py-2 fixed border top-0 left-0 w-full h-12 lg:left-72 lg:w-[calc(100%-18rem)] lg:h-16 z-30">
      <div className=" justify-start items-center mb-8 lg:hidden block ml-4">
        <img
          src="/images/applogo.jpg"
          alt="App Logo"
          className="w-18 h-10 mt-7"
        />
      </div>

      {/* Selected Item */}
      <div className="md:flex items-center space-x-2">
        {iconMap[selectedItem]}
        <span className=" text-lg font-semibold">{selectedItem}</span>
      </div>

      {/* Dynamic Content */}
      <span className="text-[#696d75] text-lg   truncate hidden lg:block">
        {content[currentContent] || "Default Content"} {/* Safeguard */}
      </span>

      {/* Sign Out Button */}

      <button className="bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 text-white px-5 py-2 text-sm font-semibold rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out hidden lg:block">

        Sign Out
      </button>

      {/* Hamburger Menu for Mobile */}
      <button
        className="lg:hidden text-white focus:outline-none flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 ease-in-out"
        onClick={toggleSidebar}
      >
        <MenuOutlined className="text-lg" /> {/* Ant Design Menu icon */}
      </button>
    </header>
  );
}
