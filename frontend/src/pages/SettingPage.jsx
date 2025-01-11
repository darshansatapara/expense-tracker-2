import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Settings_Upper from "../components/SettingsComponents/Settings_Upper";
import Settings_Lower from "../components/SettingsComponents/Settings_Lower";
import PersonalDetails from "../components/SettingsComponents/PersonalDetails";
import ThemeSettings from "../components/SettingsComponents/Theme";
import CategoryManagement from "../components/SettingsComponents/CategoryManagment";
import SubcategoryManagement from "../components/SettingsComponents/SubCategoryManagment";
import CurrencyManagement from "../components/SettingsComponents/CurrencyManagment";
import BudgetManagement from "../components/SettingsComponents/BudgetManagment";
import ContactUs from "../components/SettingsComponents/Contactus";
import HelpSupport from "../components/SettingsComponents/HelpandSupport";
import PrivacyPolicy from "../components/SettingsComponents/PrivacyAndPolicy";

const SettingsPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? null : <Settings_Upper />}{" "}
      {/* Hide Settings_Upper on mobile */}
      <div
  className={`p-4 ${
    isMobile
      ? "w-full max-w-sm mx-auto" // For mobile: full width with a maximum width
      : "max-w-4xl mx-auto" // For larger screens: centered and max width
  }`}
>
  <Settings_Lower />
</div>

    </div>
  );
};

export default SettingsPage;
