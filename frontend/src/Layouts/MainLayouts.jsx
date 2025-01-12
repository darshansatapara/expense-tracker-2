import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Navbar from "../components/homeComponent/Navbar";
import Sidebar from "../components/homeComponent/Sidebar";
import { Outlet } from "react-router-dom";
import "../App.css"

const { Content } = Layout;

export default function MainLayout() {
  const [selectedItem, setSelectedItem] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar for Desktop */}
      <div className="w-72 hidden lg:block">
        <Sidebar onSelectItem={setSelectedItem} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar
          selectedItem={selectedItem}
          toggleSidebar={toggleSidebar}
          className="top-0 left-72 "
        />

        {/* Sidebar Drawer for Mobile */}
        <Sidebar
          isVisible={isSidebarOpen}
          onClose={closeSidebar}
          onSelectItem={(key) => {
            setSelectedItem(key);
            // closeSidebar(); // Close drawer on selection
          }}
        />

        {/* Page Content */}


        <Content className="flex-1 bg-red p-4 mt-12">
          <Outlet />
        </Content>
      </div>
    </div>
  );
}
