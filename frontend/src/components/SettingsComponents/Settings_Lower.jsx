import React from "react";
import { useNavigate } from "react-router-dom";

const Settings_Lower = () => {
  const navigate = useNavigate();

  const options = [
    { label: "Personal Details", path: "/settings/personal-details" },
    { label: "Theme Settings", path: "/settings/theme-settings" },
    { label: "Category Management", path: "/settings/category-management" },
    { label: "Subcategory Management", path: "/settings/subcategory-management" },
    { label: "Currency Management", path: "/settings/currency-management" },
    { label: "Budget Management", path: "/settings/budget-management" },
    { label: "Contact Us", path: "/settings/contact-us" },
    { label: "Help & Support", path: "/settings/help-support" },
    { label: "Privacy Policy", path: "/privacy-policy" },
  ];
  

  return (
    <div className="bg-[#E5E1DA] p-6 rounded-lg shadow-md font-nunito">
      <ul className="space-y-4">
        {options.map((option, index) => (
          <li
            key={index}
            className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-200 rounded-md"
            onClick={() => navigate(option.path)}
          >
            <span className="text-gray-800">{option.label}</span>
            <span className="text-gray-600">&gt;</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Settings_Lower;
