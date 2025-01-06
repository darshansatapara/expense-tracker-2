import React from "react";
import { Layout, Menu, Avatar } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons"; // Importing icons from Ant Design

const { Sider } = Layout;

export default function Sidebar({ onSelectItem, username = "User Name" }) {
  // Menu items array for the new `items` prop
  const menuItems = [
    {
      key: "Home",
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: "Analysis",
      icon: <BarChartOutlined />,
      label: "Analysis",
    },
    {
      key: "History",
      icon: <HistoryOutlined />,
      label: "History",
    },
    {
      key: "Settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: "Reports",
      icon: <FileTextOutlined />,
      label: "Reports",
    },
  ];

  return (
    <Sider
      width={300} // Increase width of the sidebar
      className="fixed top-16 left-0 h-full p-4 shadow-md bg-[#D9EAFD] hidden md:block z-10" // Fixed sidebar, placed below the navbar
    >
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* User Icon */}
        <div className="mb-4 flex flex-col items-center">
          <Avatar
            size={80} // Increase avatar size
            icon={<img src="/images/user.png" alt="profile" />} // Display user profile picture
          />
          {/* Username */}
          <span className="mt-2 text-lg font-bold font-nunito text-gray-700">
            {username}
          </span>
        </div>

        {/* Menu */}
        <Menu
          mode="inline"
          onClick={({ key }) => onSelectItem(key)} // Set selected item to display in Navbar
          className="bg-transparent border-none flex-1"
          items={menuItems} // Updated to use `items` prop
        />

        {/* Footer Logo */}
        <div className="flex justify-center items-center mt-auto mb-7">
          <img
            src="/images/applogo.jpg"
            alt="App Logo"
            className="w-30 h-20" // Adjusted size for a better fit
          />
        </div>

        {/* Footer Text */}
        <div className="flex justify-center items-center text-sm text-gray-600 font-nunito mb-14">
          <span>© 2025 Expense Tracker. All rights reserved.</span>
        </div>
      </div>
    </Sider>
  );
}
