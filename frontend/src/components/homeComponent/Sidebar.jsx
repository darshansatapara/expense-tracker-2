import React from "react";
import { Layout, Menu, Avatar, Divider } from "antd";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons"; // Importing icons from Ant Design

const { Sider } = Layout;

export default function Sidebar({ onSelectItem, username = "User Name" }) {
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
        >
          {/* Home */}
          <Menu.Item key="Home" icon={<HomeOutlined />} className="font-nunito">
            Home
          </Menu.Item>

          {/* Analysis */}
          <Menu.Item
            key="Analysis"
            icon={<BarChartOutlined />}
            className="font-nunito"
          >
            Analysis
          </Menu.Item>

          {/* History */}
          <Menu.Item
            key="History"
            icon={<HistoryOutlined />}
            className="font-nunito"
          >
            History
          </Menu.Item>

          {/* Settings */}
          <Menu.Item
            key="Settings"
            icon={<SettingOutlined />}
            className="font-nunito"
          >
            Settings
          </Menu.Item>

          {/* Reports */}
          <Menu.Item
            key="Reports"
            icon={<FileTextOutlined />}
            className="font-nunito"
          >
            Reports
          </Menu.Item>
        </Menu>

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
