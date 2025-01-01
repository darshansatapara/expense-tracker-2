import React, { useState, useEffect } from "react";
import { Layout, Typography, Button, Image } from "antd";
import { AlignJustify } from "lucide-react";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import MobileSidebar from "../homeComponent/Mobilescreen/MobileSidebar"; // Importing the Mobile Sidebar component

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ selectedItem, setIsDesktopSidebarOpen }) {
  const [currentContent, setCurrentContent] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const content = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % content.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [content.length]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsDesktopSidebarOpen(false); // Close the desktop sidebar when the mobile sidebar is opened
  };

  return (
    <Layout className="bg-[#D9EAFD] shadow-lg px-2 py-2 font-nunito">
      <Header className="bg-[#D9EAFD] flex items-center justify-between h-10 md:h-12 px-3 rounded-md">
        {/* App Logo */}
        <div className="block md:hidden mt-3 w-12 h-17">
          <Image
            src="/images/applogo.jpg"
            alt="App Logo"
            className="w-2 h-1" // Smaller width and height for the logo
          />
        </div>

        {/* Selected Item */}
        <div className="flex items-center space-x-1 hidden md:flex">
          {selectedItem === "Home" && (
            <HomeOutlined className="text-xl md:text-lg" />
          )}
          {selectedItem === "Analysis" && (
            <BarChartOutlined className="text-xl md:text-lg" />
          )}
          {selectedItem === "History" && (
            <HistoryOutlined className="text-xl md:text-lg" />
          )}
          {selectedItem === "Settings" && (
            <SettingOutlined className="text-xl md:text-lg" />
          )}
          {selectedItem === "Reports" && (
            <FileTextOutlined className="text-xl md:text-lg" />
          )}
          <Text className="text-gray-700 text-xs md:text-sm font-semibold">
            {selectedItem}
          </Text>
        </div>

        {/* Dynamic Content */}
        <div className="flex-7 flex justify-center items-center hidden md:block">
          <div className="bg-white bg-gray-100  shadow-md max-w-4xl w-full">
            <Text className="text-gray-700 p-3 text-xs md:text-sm font-semibold text-center">
              {content[currentContent]}
            </Text>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="hidden md:block">
          <Button
            onClick={() => console.log("Signed Out")}
            type="primary"
            className="bg-red-500 text-white hover:bg-red-600 text-xs md:text-sm"
          >
            Sign Out
          </Button>
        </div>

        {/* Hamburger Menu - Only show when the sidebar is NOT open */}
        {!isSidebarOpen && (
          <Button
            type="primary"
            onClick={toggleSidebar}
            icon={<AlignJustify />}
            className="block md:hidden bg-[#cfcfcf] text-red-500 hover:bg-red-600 font-nunito text-lg"
          />
        )}
      </Header>

      {/* Mobile Sidebar */}
      {isSidebarOpen && <MobileSidebar onClose={toggleSidebar} />}
    </Layout>
  );
}
