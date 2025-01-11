import React, { useEffect } from "react";
import { Layout, Menu, Avatar, Drawer } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

export default function Sidebar({
  onSelectItem,
  username = "User Name",
  isVisible,
  onClose,
}) {
  const location = useLocation();

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

  // Get the selected key from localStorage or from the current pathname
  const selectedKey =
    localStorage.getItem("selectedItem") ||
    menuItems.find((item) => item.route === location.pathname)?.key;

  useEffect(() => {
    // On component mount, set the selectedItem if it's saved in localStorage
    const savedSelectedItem = localStorage.getItem("selectedItem");
    if (savedSelectedItem) {
      onSelectItem(savedSelectedItem);
    }
  }, [onSelectItem]);

  const sidebarContent = (
    <div className="flex flex-col h-full ">
      <div className="mb-4 flex flex-col items-center">
        <Avatar
          size={80}
          icon={<img src="/images/user.png" alt="profile" />}
          className="mt-6"
        />
        <span className="mt-4 text-lg font-bold text-gray-700">{username}</span>
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]} // The selected menu item
        onClick={({ key }) => {
          onSelectItem(key);
          localStorage.setItem("selectedItem", key); // Save the selected key to localStorage
          onClose(); // Close the drawer after selecting an item
        }}
        className="bg-transparent border-none flex-1 space-y-4 py-4 px-6"
        items={menuItems.map((item) => ({
          key: item.key,
          icon: <span className="text-xl">{item.icon}</span>, // Adjust icon size for better visibility
          label: (
            <Link
              to={item.route}
              className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 ease-in-out"
            >
              {item.label}
            </Link>
          ), // Wrap the label with Link for navigation and added hover effects
        }))}
      />

      {/* Logo for Sidebar only, hidden in Drawer */}
      <div className=" justify-start items-center  mb-7 hidden lg:block ml-10">
        <img src="/images/applogo.jpg" alt="App Logo" className="w-30 h-20" />
      </div>
      {/* Footer Text */}
      <div className="flex justify-center items-center text-sm text-gray-600 font-nunito mb-8 whitespace-nowrap ">
        <span>© 2025 Expense Tracker. All rights reserved.</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - visible on medium and larger screens */}
      <div className="fixed top-0 left-0 h-full w-72 bg-[#B0D4F7] hidden lg:block p-4">
        {sidebarContent}
      </div>

      {/* Mobile Drawer - visible on smaller screens */}
      <Drawer
        placement="left"
        onClose={onClose}
        open={isVisible} // Controlled by the parent component
        width={"50%"} // You can adjust the width here
        className="!bg-[#B0D4F7] !border-none !bg-opacity-80" // Apply custom Tailwind styles to the drawer
      >
        {sidebarContent}
      </Drawer>
    </>
  );
}
