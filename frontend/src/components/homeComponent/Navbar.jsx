import React, { useState, useEffect } from "react";
import { Layout, Typography, Button } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ selectedItem }) {
  const [currentContent, setCurrentContent] = useState(0);

  // Define dynamic content
  const content = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];

  // Cycle through content every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % content.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [content.length]);

  // Map icons based on selected item
  const iconMap = {
    Home: <HomeOutlined className="text-lg text-gray-700" />,
    Analysis: <BarChartOutlined className="text-lg text-gray-700" />,
    History: <HistoryOutlined className="text-lg text-gray-700" />,
    Settings: <SettingOutlined className="text-lg text-gray-700" />,
    Reports: <FileTextOutlined className="text-lg text-gray-700" />,
  };

  return (
    <Header className="bg-[#B0D4F7] flex items-center justify-between px-4 py-2 shadow-md fixed top-0 left-72 w-[calc(100%-18rem)] h-16 z-20">
      {/* Selected Item with Icon */}
      <div className="flex items-center space-x-2">
        {iconMap[selectedItem]}
        <Text className="text-gray-700 text-sm font-semibold">{selectedItem}</Text>
      </div>

      {/* Dynamic Content */}
      <Text className="text-gray-500 text-xs truncate text-center">
        {content[currentContent]}
      </Text>

      {/* Sign Out Button */}
      <Button
        type="primary"
        className="bg-red-500 text-white hover:bg-red-600 text-xs px-4 py-1"
      >
        Sign Out
      </Button>
    </Header>
  );
}
