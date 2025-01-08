import React, { useState } from "react";
import { Layout } from "antd";
import Navbar from "../components/homeComponent/Navbar";
import Sidebar from "../components/homeComponent/Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function MainLayout() {
  const [selectedItem, setSelectedItem] = useState("Home");

  return (
    <Layout className="min-h-screen">
      {/* Sidebar - Fixed on the left */}
      <div className="fixed top-0 left-0 h-full z-30 w-72 bg-white shadow-lg">
        <Sidebar onSelectItem={setSelectedItem} />
      </div>

      {/* Main Content Area */}
      <Layout className="ml-72">
        {/* Navbar - Positioned at the top, right of the Sidebar */}
        <div className="fixed top-0 left-72 z-20 w-[calc(100%-18rem)]  shadow-md">
          <Navbar selectedItem={selectedItem} />
        </div>

        {/* Content - Rendered below the Navbar */}
        <Content className="mt-16 p-4 overflow-y-auto h-[calc(100vh-4rem)] bg-gray-100">
          <Outlet /> {/* Render the content for each route here */}
        </Content>
      </Layout>
    </Layout>
  );
}
