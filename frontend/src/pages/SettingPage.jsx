import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Settings from "../components/SettingsComponents/SettingComponent.jsx";
import ContactUs from "../components/SettingsComponents/Contactus.jsx";
import PersonalDetails from "../components/SettingsComponents/PersonalDetails.jsx";
// import ThemeSettings from "../components/SettingsComponents/Theme.jsx";
import CategoryManagement from "../components/SettingsComponents/CategoryManagment.jsx";
// import SubcategoryManagement from "../components/SettingsComponents/SubCategoryManagment.jsx";
import CurrencyManagement from "../components/SettingsComponents/CurrencyBudgetManagment.jsx";
// import BudgetManagement from "../components/SettingsComponents/BudgetManagment.jsx";
import HelpSupport from "../components/SettingsComponents/HelpandSupport.jsx";
import PrivacyPolicy from "../components/SettingsComponents/PrivacyAndPolicy.jsx";

const SettingsPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if the current route is the main settings page
  const isMainSettingsPage = location.pathname === "/settings";

  return (
    <div className="min-h-screen mr-5">
      {/* {!isMobile && isMainSettingsPage && <Settings_Upper />} */}

      <div
        className={` ${
          isMobile
            ? "max-w-full " // Mobile-specific styles
            : "max-w-full  " // Larger screens
        }`}
      >
        {isMainSettingsPage ? (
          // Render Settings_Lower only on the main settings page
          <Settings />
        ) : (
          // Render Routes for submenu items
          <Routes>
            <Route path="contact-us" element={<ContactUs />} />
            <Route path="personal-details" element={<PersonalDetails />} />
            {/* <Route path="theme-settings" element={<ThemeSettings />} /> */}
            <Route path="category-management" element={<CategoryManagement />} />
            {/* <Route path="subcategory-management" element={<SubcategoryManagement />} /> */}
            <Route path="currency-budget-management" element={<CurrencyManagement />} />
            {/* <Route path="budget-management" element={<BudgetManagement />} /> */}
            <Route path="help-support" element={<HelpSupport />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
