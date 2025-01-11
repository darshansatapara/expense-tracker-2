import React, { useEffect } from "react";
import { Layout, Menu, Avatar } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function Sidebar({ onSelectItem, username = "User Name" }) {
  // Get current location from URL to highlight active menu item
  const location = useLocation();

  // Define menu items and their respective route paths
  const menuItems = [
    { key: "Home", icon: <HomeOutlined />, label: "Home", route: "/" },
    {
      key: "Analysis",
      icon: <BarChartOutlined />,
      label: "Analysis",
      route: "/analysis",
    },
    {
      key: "History",
      icon: <HistoryOutlined />,
      label: "History",
      route: "/history",
    },
    {
      key: "Settings",
      icon: <SettingOutlined />,
      label: "Settings",
      route: "/settings",
    },
    {
      key: "Reports",
      icon: <FileTextOutlined />,
      label: "Reports",
      route: "/reports",
    },
  ];

  // Retrieve selected key from localStorage (if available)
  const selectedKey =
    localStorage.getItem("selectedItem") ||
    menuItems.find((item) => item.route === location.pathname)?.key;

  useEffect(() => {
    // Persist the selected menu item in localStorage
    const savedSelectedItem = localStorage.getItem("selectedItem");
    if (savedSelectedItem) {
      onSelectItem(savedSelectedItem);
    }
  }, [onSelectItem]);

  return (
    <div className="fixed top-0 left-0 h-full w-72  bg-[#B0D4F7] p-4 flex flex-col justify-between z-30 ">
      {/* User Avatar */}
      <div className="mb-4 flex flex-col items-center">
        <Avatar size={80} icon={<img src="/images/user.png" alt="profile" />} />
        <span className="mt-2 text-lg font-bold font-nunito text-gray-700">
          {username}
        </span>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]} // Set the active menu item based on URL or saved key
        onClick={({ key }) => {
          onSelectItem(key);
          // Store the selected item in local storage
          localStorage.setItem("selectedItem", key);
        }}
        className="bg-transparent border-none flex-1"
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: <Link to={item.route}>{item.label}</Link>,
        }))}
      />

      {/* Footer Logo */}
      <div className="flex justify-center items-center mb-4 ">
        <img
          src="/images/applogo.jpg"
          alt="App Logo"
          className="w-30 h-20 rounded-md"
        />
      </div>

      {/* Footer Text */}
      <div className="flex justify-center items-center text-sm text-gray-600 font-nunito">
        <span>© 2025 Expense Tracker. All rights reserved.</span>
      </div>
    </div>
  );
}
