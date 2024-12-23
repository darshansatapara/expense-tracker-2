import React from "react";
import Sidebar from "../components/homeComponent/Sidebar";
import Navbar from "../components/homeComponent/Navbar";
import Main from "../components/homeComponent/Main";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Sidebar />
      <Main />
    </>
  );
}
