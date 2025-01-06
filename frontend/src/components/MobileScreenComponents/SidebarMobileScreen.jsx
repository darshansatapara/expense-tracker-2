import React from "react";
import { Menu, Avatar, Divider } from "antd";
import {
  CloseOutlined,
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function MobileSidebar({ onClose, username = "User Name" }) {
  return (
    <div className="fixed top-0 left-0 w-64 h-full bg-[#D9EAFD] opacity-75 md:hidden shadow-lg z-50">
      {/* Close Icon */}
      <div className="flex justify-end p-4">
        <CloseOutlined
          onClick={onClose}
          className="text-red-500 text-2xl cursor-pointer"
        />
      </div>

      {/* Sidebar Content */}
      <div className="flex flex-col h-full p-4 text-white">
        {/* Profile Section */}
        <div className="mb-4 flex flex-col items-center">
          <Avatar
            size={80}
            icon={<img src="/images/user.png" alt="profile" />}
          />
          <span className="mt-7 text-lg font-bold text-gray-600">
            {username}
          </span>
        </div>

        {/* Menu Items */}
        <Menu mode="vertical" className="flex-1 bg-transparent border-none">
          <Menu.Item key="Home" icon={<HomeOutlined />} className="font-nunito">
            Home
          </Menu.Item>
          <Menu.Item
            key="Analysis"
            icon={<BarChartOutlined />}
            className="font-nunito"
          >
            Analysis
          </Menu.Item>
          <Menu.Item
            key="History"
            icon={<HistoryOutlined />}
            className="font-nunito"
          >
            History
          </Menu.Item>
          <Menu.Item
            key="Settings"
            icon={<SettingOutlined />}
            className="font-nunito"
          >
            Settings
          </Menu.Item>
          <Menu.Item
            key="Reports"
            icon={<FileTextOutlined />}
            className="font-nunito"
          >
            Reports
          </Menu.Item>
        </Menu>

        {/* Footer */}
        <Divider />
        <div className="text-center text-sm text-black font-nunito mb-7">
          <p>© 2025 Expense Tracker. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
