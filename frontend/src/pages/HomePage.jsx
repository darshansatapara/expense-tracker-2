import React, { useState } from "react";
import { Layout } from "antd";
import Navbar from "../components/homeComponent/Navbar";  // Assuming Navbar is the component you provided earlier
import Sidebar from "../components/homeComponent/Sidebar";
import Main from "../components/homeComponent/Main"  // Sidebar component as described earlier

const { Content } = Layout;

export default function HomePage() {
  const [selectedItem, setSelectedItem] = useState("Home");

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#D9EAFD" }}>
      {/* Navbar - Displays dynamic content and selected item */}
      <Navbar selectedItem={selectedItem} />

      <Layout style={{ flexDirection: "row", backgroundColor: "#D9EAFD" }}>
        {/* Sidebar - Contains navigation and user profile */}
        <Sidebar onSelectItem={setSelectedItem} />

        {/* Content Area - Displays selected item */}
      <Layout>
        <Main />
      </Layout>
      </Layout>
    </Layout>
  );
}
