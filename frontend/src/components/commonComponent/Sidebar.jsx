import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const handleClickOutside = (e) => {
    if (e.target.id === "sidebar-overlay") toggleSidebar();
  };

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden lg:grid w-64 bg-white border-r shadow-md">
        <SidebarContent toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar for Small Screens (Overlay Drawer) */}
      {isSidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={handleClickOutside}
        >
          <div className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={toggleSidebar}
            >
              <CloseOutlined className="text-xl" />
            </button>
            <SidebarContent
              toggleSidebar={toggleSidebar}
              isSmallScreen={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

const SidebarContent = ({ toggleSidebar, isSmallScreen }) => {
  return (
    <div className="grid h-screen">
      {/* Top Section */}
      <div className="flex flex-col items-center py-6 bg-white mt-12 lg:mt-10 md:mt-10">
        <div className="flex rounded-full items-center justify-center border-2 border-indigo-400">
          <img
            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
            alt="User"
            className="rounded-full h-20 w-20"
          />
        </div>
        <span className="mt-4 text-lg font-semibold text-gray-700">
          User Name
        </span>
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="flex flex-col items-center space-y-8 sm:space-y-6 py-4 overflow-y-auto">
        {[
          {
            name: "Home",
            icon: <HomeOutlined className="text-lg text-gray-700" />,
            to: "/",
          },
          {
            name: "History",
            icon: <HistoryOutlined className="text-lg text-gray-700" />,
            to: "/history",
          },
          {
            name: "Analysis",
            icon: <BarChartOutlined className="text-lg text-gray-700" />,
            to: "/analysis",
          },
          {
            name: "Reports",
            icon: <FileTextOutlined className="text-lg text-gray-700" />,
            to: "/reports",
          },
          {
            name: "Settings",
            icon: <SettingOutlined className="text-lg text-gray-700" />,
            to: "/settings",
          },
        ].map(({ name, icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `w-[85%] flex items-center space-x-2 py-3 px-4 rounded-xl text-gray-600 text-md font-bold ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                  : "hover:bg-gray-200"
              }`
            }
            onClick={() => {
              if (isSmallScreen) toggleSidebar(); // Only close sidebar on small screens
            }}
          >
            {icon} <span>{name}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center py-6 bg-white">
        <div className="flex items-center justify-center">
          <img
            src="/images/applogo.jpg"
            className="h-16 w-auto rounded-2xl"
            alt="App Logo"
          />
        </div>
        <span className="text-center text-xs text-gray-500 mt-2">
          © 2025 Expense Tracker. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
