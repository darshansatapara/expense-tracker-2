// import React from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   FaSearch,
//   FaUserAlt,
//   FaPalette,
//   FaFolderOpen,
//   // FaClipboardList,
//   // FaDollarSign,
//   FaChartPie,
//   FaEnvelope,
//   FaQuestionCircle,
//   FaShieldAlt,
//   FaCoins
// } from "react-icons/fa";

// const Settings = () => {
//   const navigate = useNavigate();

//   const options = [
//     {
//       label: "Personal Details",
//       path: "/settings/personal-details",
//       icon: <FaUserAlt />,
//       description: "Edit your personal information",
//     },
//     {
//       label: "Theme Settings",
//       path: "/settings/theme-settings",
//       icon: <FaPalette />,
//       description: "Customize the look of the app",
//     },
//     {
//       label: "Category Management",
//       path: "/settings/category-management",
//       icon: <FaFolderOpen />,
//       description: "Manage categories & SubCategories of data",
//     },
//     // {
//     //   label: "Subcategory Management",
//     //   path: "/settings/subcategory-management",
//     //   icon: <FaClipboardList />,
//     //   description: "Manage subcategories",
//     // },
//     {
//       label: "Currency & Budget Management",
//       path: "/settings/currency-budget-management",
//       icon: < FaCoins  />,
//       description: "Set up your currencies and Budget",
//     },
//     // {
//     //   label: "Budget Management",
//     //   path: "/settings/budget-management",
//     //   icon: <FaChartPie />,
//     //   description: "Track and manage your budget",
//     // },
//     {
//       label: "Contact Us",
//       path: "/settings/contact-us",
//       icon: <FaEnvelope />,
//       description: "Get in touch with support",
//     },
//     {
//       label: "Help & Support",
//       path: "/settings/help-support",
//       icon: <FaQuestionCircle />,
//       description: "Find answers to your questions",
//     },
//     {
//       label: "Privacy Policy",
//       path: "/settings/privacy-policy",
//       icon: <FaShieldAlt />,
//       description: "Read our privacy policy",
//     },
//   ];

//   return (
//     <div className="font-nunito mt-10 px-4">
//       {/* Search Bar */}
//       <div className="relative mb-8 w-full md:w-full lg:w-1/4  ">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-4">
//           <FaSearch className="text-gray-500 text-xl" />
//         </div>
//         <input
//           type="text"
//           placeholder="Search your setting"
//           className="w-full pl-14 py-3 text-lg rounded-full bg-gray-50 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-300"
//         />
//       </div>

//       {/* Grid Layout for Menu List */}
//       <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {options.map((option, index) => (
//           <div
//             key={index}
//             className="flex space-x-4 lg:flex-row lg:items-center space-4  lg:justify-start py-3 px-7 rounded-lg shadow-sm hover:shadow-md bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 cursor-pointer transition-all duration-300 mb-4  "
//             onClick={() => navigate(option.path)}
//           >
//              <div className="flex items-center space-x-4 flex-1">
//         <div className="text-blue-500 text-3xl lg:text-5xl">{option.icon}</div>
//         <div className="flex flex-col  items-center justify-center ml-5">
//           <span className="text-gray-700 text-sm md:text-sm lg:text-lg lg:text-center font-bold ">
//             {option.label}
//           </span>
//           {/* Description visible only on larger screens */}
//           <p className="text-gray-500  text-sm mt-1 hidden lg:block ">
//             {option.description}
//           </p>
//         </div>
//       </div>

//             {/* Arrow visible only on mobile screens */}
//             <span className="text-gray-400 text-lg ml-auto block lg:hidden">
//               &gt;
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Settings;

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
    <div className="font-nunito max-w-6xl mx-auto py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-2">Customize your app experience</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 w-full max-w-lg mx-auto">
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
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {filteredOptions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No settings match your search</p>
        </div>
      )}
    </div>
  );
};

export default Settings;
