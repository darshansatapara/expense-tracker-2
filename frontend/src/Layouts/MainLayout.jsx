import React, { useState, useEffect } from "react";
import Sidebar from "../components/commonComponent/Sidebar";
import Navbar from "../components/commonComponent/Navbar";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="border-2 h-screen ">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-full ">
        {/* Navbar */}
        <div className="bg-gray-700 ">
          <Navbar toggleSidebar={toggleSidebar} />
        </div>

        {/* Content Box */}
        <div className=" flex-grow overflow-auto h-full bg-red-700 rounded-md">
          {/* The Outlet renders the child route content here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
