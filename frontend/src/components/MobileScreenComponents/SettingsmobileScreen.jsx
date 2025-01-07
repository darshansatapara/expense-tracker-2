import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SettingsMobile = () => {
  const navigate = useNavigate();

  const options = [
    { label: "Personal Details", path: "/personal-details" },
    { label: "Theme Settings", path: "/theme-settings" },
    { label: "Category Management", path: "/category-management" },
    { label: "Subcategory Management", path: "/subcategory-management" },
    { label: "Currency Management", path: "/currency-management" },
    { label: "Budget Management", path: "/budget-management" },
    { label: "Contact Us", path: "/contact-us" },
    { label: "Help & Support", path: "/help-support" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <div className="bg-[#E5E1DA] min-h-screen p-4 flex flex-col space-y-6">
      {/* Settings Options */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <ul className="space-y-3">
          {options.map((option, index) => (
            <li
              key={index}
              className="flex justify-between items-center cursor-pointer p-3 hover:bg-gray-100 rounded-md"
              onClick={() => navigate(option.path)}
            >
              <span className="text-gray-800">{option.label}</span>
              <span className="text-gray-600">&gt;</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SettingsMobile;
