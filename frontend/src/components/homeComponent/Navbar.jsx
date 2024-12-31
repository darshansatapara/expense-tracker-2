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
<<<<<<< HEAD
=======
import MobileSidebar from "../homeComponent/Mobilescreen/MobileSidebar"; // Importing the Mobile Sidebar component
>>>>>>> 17a3548ff7a1d3be8fe0678d49185e8061153503

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
<<<<<<< HEAD
    <Layout className="bg-[#D9EAFD] shadow-lg px-4 py-1 font-nunito">
      <Header className="bg-[#D9EAFD] flex items-center justify-between h-12 md:h-14 px-4 rounded-md">
        {/* App Logo for small screen */}
        <div className="block md:hidden mt-7">
          <Image
            src="/images/applogo.jpg" // Update the path to your logo image
            alt="App Logo"
            width={40}
            height={40}
            className="rounded-full" // This class makes the image circular
          />
        </div>

        {/* Selected Item with Icon on the Left */}
        <div className=" items-center space-x-1 hidden md:flex">
          {selectedItem === "Home" && (
            <HomeOutlined className="text-2xl md:text-xl" />
          )}
          {selectedItem === "Analysis" && (
            <BarChartOutlined className="text-2xl md:text-xl" />
          )}
          {selectedItem === "History" && (
            <HistoryOutlined className="text-2xl md:text-xl" />
          )}
          {selectedItem === "Settings" && (
            <SettingOutlined className="text-2xl md:text-xl" />
          )}
          {selectedItem === "Reports" && (
            <FileTextOutlined className="text-2xl md:text-xl" />
          )}
          <Text className="text-gray-700 text-sm md:text-2xl font-semibold">
            {selectedItem}
          </Text>
        </div>

        {/* Dynamic Content in a Box in the Center (only visible on medium and larger screens) */}
        <div className="flex-7  justify-center items-center hidden md:block">
          <div className="bg-white p-4 rounded-md shadow-md max-w-3xl w-full">
            <Text className="text-gray-700 text-xs md:text-sm font-semibold text-center">
              {content[currentContent]}{" "}
              {/* Displaying dynamic content every 2 seconds */}
=======
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
>>>>>>> 17a3548ff7a1d3be8fe0678d49185e8061153503
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
