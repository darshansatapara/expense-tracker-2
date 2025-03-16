import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserAlt,
  FaPalette,
  FaFolderOpen,
  // FaClipboardList,
  FaDollarSign,
  FaChartPie,
  FaEnvelope,
  FaQuestionCircle,
  FaShieldAlt,
} from "react-icons/fa";

const Settings = () => {
  const navigate = useNavigate();

  const options = [
    {
      label: "Personal Details",
      path: "/settings/personal-details",
      icon: <FaUserAlt />,
      description: "Edit your personal information",
    },
    {
      label: "Theme Settings",
      path: "/settings/theme-settings",
      icon: <FaPalette />,
      description: "Customize the look of the app",
    },
    {
      label: "Category Management",
      path: "/settings/category-management",
      icon: <FaFolderOpen />,
      description: "Manage categories & SubCategories of data",
    },
    // {
    //   label: "Subcategory Management",
    //   path: "/settings/subcategory-management",
    //   icon: <FaClipboardList />,
    //   description: "Manage subcategories",
    // },
    {
      label: "Currency Management",
      path: "/settings/currency-management",
      icon: <FaDollarSign />,
      description: "Set up your currencies",
    },
    {
      label: "Budget Management",
      path: "/settings/budget-management",
      icon: <FaChartPie />,
      description: "Track and manage your budget",
    },
    {
      label: "Contact Us",
      path: "/settings/contact-us",
      icon: <FaEnvelope />,
      description: "Get in touch with support",
    },
    {
      label: "Help & Support",
      path: "/settings/help-support",
      icon: <FaQuestionCircle />,
      description: "Find answers to your questions",
    },
    {
      label: "Privacy Policy",
      path: "/settings/privacy-policy",
      icon: <FaShieldAlt />,
      description: "Read our privacy policy",
    },
  ];

  return (
    <div className="font-nunito mt-10 px-4">
      {/* Search Bar */}
      <div className="relative mb-8 w-full md:w-full lg:w-1/4  ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4">
          <FaSearch className="text-gray-500 text-xl" />
        </div>
        <input
          type="text"
          placeholder="Search your setting"
          className="w-full pl-14 py-3 text-lg rounded-full bg-gray-50 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
        />
      </div>

      {/* Grid Layout for Menu List */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex space-x-4 lg:flex-row lg:items-center space-4  lg:justify-start py-3 px-7 rounded-lg shadow-sm hover:shadow-md bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all duration-300 mb-4  "
            onClick={() => navigate(option.path)}
          >
             <div className="flex items-center space-x-4 flex-1">
        <div className="text-blue-500 text-3xl lg:text-5xl">{option.icon}</div>
        <div className="flex flex-col  items-center justify-center ml-5">
          <span className="text-gray-700 text-sm md:text-sm lg:text-lg lg:text-center font-bold ">
            {option.label}
          </span>
          {/* Description visible only on larger screens */}
          <p className="text-gray-500  text-sm mt-1 hidden lg:block ">
            {option.description}
          </p>
        </div>
      </div>

            {/* Arrow visible only on mobile screens */}
            <span className="text-gray-400 text-lg ml-auto block lg:hidden">
              &gt;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
