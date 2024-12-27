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
      className="h-full p-4 shadow-md"
      style={{ height: "100vh", backgroundColor: "transparent", border: "none" }} // Remove box effect, transparent background
    >
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* User Icon */}
        <div className="mb-4 flex flex-col items-center">
          <Avatar
            size={80} // Increase avatar size
            icon={<img src="/images/user.png" alt="profile" />} // Display user profile picture
            // style={{ backgroundColor: "#f56a00" }} // Default avatar color if no profile image
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
          style={{
            backgroundColor: "transparent", // Remove background color from Menu
            border: "none", // Remove borders
            flex: 1, // Make the menu take up available space
          }}
        >
          {/* Home */}
          <Menu.Item key="Home" icon={<HomeOutlined />} className="font-nunito">
            Home
          </Menu.Item>

          {/* Analysis */}
          <Menu.Item key="Analysis" icon={<BarChartOutlined />} className="font-nunito">
            Analysis
          </Menu.Item>

          {/* History */}
          <Menu.Item key="History" icon={<HistoryOutlined />} className="font-nunito">
            History
          </Menu.Item>

          {/* Settings */}
          <Menu.Item key="Settings" icon={<SettingOutlined />} className="font-nunito">
            Settings
          </Menu.Item>

          {/* Reports */}
          <Menu.Item key="Reports" icon={<FileTextOutlined />} className="font-nunito">
            Reports
          </Menu.Item>
        </Menu>

        {/* Footer Logo */}
        <div className="mt-auto flex justify-center items-center mb-8">
          <img
            src="/images/applogo.jpg"
            alt="App Logo"
            className="w-20 h-20 mx-auto rounded-full" // Ensure logo is round
          />
        </div>

        <Divider />

        {/* Footer Text */}
        <div className="text-center text-sm text-gray-600 font-nunito mb-7">
  <p>© 2025 Expense Tracker. All rights reserved.</p>
</div>

      </div>
    </Sider>
  );
}
