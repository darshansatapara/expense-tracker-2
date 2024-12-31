import React, { useState, useEffect } from "react";
import { Layout, Typography, Button, Image } from "antd"; // Import Image for logo
import { AlignJustify } from "lucide-react";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  // Array of dynamic content to be displayed in the navbar
  const content = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];

  useEffect(() => {
    // Interval for changing content every 2 seconds
    const interval = setInterval(() => {
      setCurrentContent((prev) => (prev + 1) % content.length);
    }, 2000);

    return () => clearInterval(interval); // Clear interval when component unmounts
  }, [content.length]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle the sidebar state
  };

  return (
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
            </Text>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="hidden md:block">
          <Button
            onClick={() => {
              // Add sign out functionality here
              console.log("Signed Out");
            }}
            type="primary"
            className="bg-red-500 text-white hover:bg-red-600 text-xs md:text-sm"
          >
            Sign Out
          </Button>
        </div>

        {/* Hamburger Menu for mobile view */}
        <Button
          type="primary"
          onClick={toggleSidebar} // Toggle sidebar visibility
          icon={<AlignJustify />}
          className="block md:hidden bg-[#cfcfcf] text-red-500 hover:bg-red-600 font-nunito text-lg"
        />
      </Header>

      {/* Sidebar for mobile view */}
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50">
          {/* Add your sidebar menu items here */}
          <Button onClick={() => {}}>Profile</Button>
          <Button onClick={() => {}}>Home</Button>
          <Button onClick={() => {}}>Analysis</Button>
          <Button onClick={() => {}}>History</Button>
          <Button onClick={() => {}}>Settings</Button>
          <Button onClick={() => {}}>Report</Button>
        </div>
      )}
    </Layout>
  );
}
