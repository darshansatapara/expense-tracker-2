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
          size={90}
          icon={
            <img
              src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              alt="profile"
            />
          }
          className="mt-6 border-2 border-indigo-500 shadow-md"
        />
        <span className="mt-4 text-lg font-bold text-[#696d75]">
          {username}
        </span>
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
          icon: <span className="text-2xl text-[#696d75] ">{item.icon}</span>, // Adjust icon size for better visibility
          label: (
            <Link
              to={item.route}
              className="text-[#696d75] text-lg hover:text-blue-600 font-semibold transition-all duration-300 ease-in-out"
            >
              {item.label}
            </Link>
          ), // Wrap the label with Link for navigation and added hover effects
        }))}
      />

      {/* Logo for Sidebar only, hidden in Drawer */}
      <div className=" justify-start items-center mb-7 hidden lg:block ml-10">
        <img
          src="/images/applogo.jpg"
          alt="App Logo"
          className="w-30 h-20 rounded-lg"
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - visible on medium and larger screens */}
      <div className="fixed top-0 left-0 h-full w-72 bg-[#fff]  border hidden lg:block p-4">
        {sidebarContent}
      </div>

      {/* Mobile Drawer - visible on smaller screens */}
      <Drawer
  placement="left"
  onClose={onClose}
  open={isVisible}
  width="35%"
  overlayClassName="!bg-transparent !backdrop-blur-md z-50"  // Overlay is now transparent and blurred
>
  {sidebarContent}
</Drawer>

   {/* // Apply custom Tailwind styles to the drawer contentt */}


    </>
  );
}
