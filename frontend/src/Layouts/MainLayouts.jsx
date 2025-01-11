import React, { useState, useEffect } from "react";
import { Layout } from "antd";
import Navbar from "../components/homeComponent/Navbar";
import Sidebar from "../components/homeComponent/Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
  const [selectedItem, setSelectedItem] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
<<<<<<< HEAD
    <Layout className="min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <div className="fixed top-0 left-0 h-full z-30 w-72 bg-white shadow-lg ">
=======
    <div className="flex h-screen">
      {/* Sidebar for Desktop */}
      <div className="w-72 hidden md:block">
>>>>>>> 35f9a147fbfe3dc61b0c9c738c8e5ec594599a39
        <Sidebar onSelectItem={setSelectedItem} />
      </div>

      {/* Main Content Area */}
<<<<<<< HEAD
      <Layout className="ml-72">
        {/* Navbar - Positioned at the top, right of the Sidebar */}
        <div className="fixed top-0 left-72 z-20 w-[calc(100%-18rem)] shadow-md bg-white">
          <Navbar selectedItem={selectedItem} />
        </div>

        {/* Content - Adjust spacing for Navbar and Sidebar */}
        <Content
          className="p-4 overflow-y-auto bg-gray-100"
          style={{
            marginTop: "4rem", // To account for Navbar height
            marginLeft: "18rem", // To account for Sidebar width
            height: "calc(100vh - 4rem)", // Full height minus Navbar
          }}
        >
          <Outlet /> {/* Render the content for each route here */}
=======
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
        <Content className="flex-1 bg-gray-100 p-4 mt-12 overflow-y-auto ">
          <Outlet  />
>>>>>>> 35f9a147fbfe3dc61b0c9c738c8e5ec594599a39
        </Content>
      </div>
    </div>
  );
}
