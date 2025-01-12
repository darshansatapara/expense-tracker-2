import React from "react";
import { useNavigate } from "react-router-dom";

const Settings_Lower = () => {
  const navigate = useNavigate();

  // Define the list of options with labels and corresponding navigation paths
  const options = [
    { label: "Personal Details", path: "/settings/personal-details" },
    { label: "Theme Settings", path: "/settings/theme-settings" },
    { label: "Category Management", path: "/settings/category-management" },
    { label: "Subcategory Management", path: "/settings/subcategory-management" },
    { label: "Currency Management", path: "/settings/currency-management" },
    { label: "Budget Management", path: "/settings/budget-management" },
    { label: "Contact Us", path: "/settings/contact-us" },
    { label: "Help & Support", path: "/settings/help-support" },
    { label: "Privacy Policy", path: "/settings/privacy-policy" },
  ];

  return (
    <div className="bg-[#E5E1DA] p-7 rounded-lg shadow-md font-nunito mt-4">
      <ul className="space-y-4">
        {/* Loop through options to render each navigation item */}
        {options.map((option, index) => (
          <li
            key={index}
            className="flex justify-between items-center cursor-pointer p-2 hover:bg-gray-200 rounded-md"
            onClick={() => {
  console.log('Navigating to:', option.path);
  navigate(option.path);
}} // Navigate to the specified path
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
