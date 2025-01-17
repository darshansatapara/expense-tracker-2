import React, { useState, useEffect } from "react";
import Sidebar from "../components/commonComponent/Sidebar";
import Navbar from "../components/commonComponent/Navbar";
import { Outlet } from "react-router-dom";
const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-100 shadow-md p-4 md:w-1/5 lg:w-1/6">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex flex-col w-3/4 md:w-4/5 lg:w-5/6">
        {/* Navbar */}
        <div className="w-full bg-gray-100 shadow-md">
          <Navbar />
        </div>

        {/* Content Box */}
        <div className="flex-grow p-4 overflow-auto bg-gray-50">
          {/* The Outlet renders the child route content here */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
