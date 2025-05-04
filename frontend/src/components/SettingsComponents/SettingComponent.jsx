import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserAlt,
  FaPalette,
  FaFolderOpen,
  FaChartPie,
  FaEnvelope,
  FaQuestionCircle,
  FaShieldAlt,
  FaCoins,
  FaAngleRight,
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const options = [
    {
      label: "Personal Details",
      path: "/settings/personal-details",
      icon: <FaUserAlt />,
      description: "Edit your personal information",
      color: "bg-blue-100",
    },
    // {
    //   label: "Theme Settings",
    //   path: "/settings/theme-settings",
    //   icon: <FaPalette />,
    //   description: "Customize the look of the app",
    //   color: "bg-purple-100",
    // },
    {
      label: "Category Management",
      path: "/settings/category-management",
      icon: <FaFolderOpen />,
      description: "Manage categories & SubCategories of data",
      color: "bg-green-100",
    },
    {
      label: "Currency & Budget",
      path: "/settings/currency-budget-management",
      icon: <FaCoins />,
      description: "Set up your currencies and Budget",
      color: "bg-yellow-100",
    },
    {
      label: "Contact Us",
      path: "/settings/contact-us",
      icon: <FaEnvelope />,
      description: "Get in touch with support",
      color: "bg-pink-100",
    },
    {
      label: "Help & Support",
      path: "/settings/help-support",
      icon: <FaQuestionCircle />,
      description: "Find answers to your questions",
      color: "bg-indigo-100",
    },
    {
      label: "Privacy Policy",
      path: "/settings/privacy-policy",
      icon: <FaShieldAlt />,
      description: "Read our privacy policy",
      color: "bg-red-100",
    },
  ];

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="font-nunito py-10 px-4 sm:px-6">
    {/* Search Bar */}
    <div className="relative mb-8 w-full max-w-lg">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <FaSearch className="text-gray-500" />
      </div>
      <input
        type="text"
        placeholder="Search settings..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-xl bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
      />
    </div>
  
    {/* Grid Layout for Menu List */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
      {filteredOptions.map((option, index) => (
        <div
          key={index}
          onClick={() => navigate(option.path)}
          className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white cursor-pointer"
        >
          <div className="flex items-center p-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${option.color} text-gray-800 group-hover:scale-110 transition-transform duration-300`}
            >
              <span className="text-xl">{option.icon}</span>
            </div>
  
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                {option.label}
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                {option.description}
              </p>
            </div>
  
            <div className="text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
              <FaAngleRight className="text-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Settings;
