import React, { useState } from "react";
import { Layout } from "antd";
import Navbar from "../components/homeComponent/Navbar"; // Assuming Navbar is the component you provided earlier
import Sidebar from "../components/homeComponent/Sidebar";
import Main from "../components/homeComponent/Main"; // Sidebar component as described earlier

const { Content } = Layout;

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState("Home");

  return (
    <Layout className="min-h-screen bg-[#D9EAFD]  ">
      {/* Navbar - Displays dynamic content and selected item */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar selectedItem={selectedItem} />
      </div>

      {/* Sidebar - Positioned below the Navbar */}
      <div className="fixed top-16 left-0 h-full w-72 z-10">
        {" "}
        {/* Adjusted position */}
        <Sidebar onSelectItem={setSelectedItem} />
      </div>
      {/* <Layout></Layout> */}
      <Layout className="pl-82 pt-16">
          <Main />
      </Layout>
    </Layout>
  );
}
