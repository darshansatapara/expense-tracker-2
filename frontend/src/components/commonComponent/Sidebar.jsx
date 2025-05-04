import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useUserProfileStore from "../../store/UserStore/userProfileStore.js";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { LogOut } from "lucide-react";
import { userStore } from "../../store/UserStore/userAuthStore.js";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const handleClickOutside = (e) => {
    if (e.target.id === "sidebar-overlay") toggleSidebar();
  };

  return (
    <>
      {/* Sidebar for Large Screens */}
      <div className="hidden lg:grid w-64 bg-white border-r shadow-md">
        <SidebarContent toggleSidebar={toggleSidebar} />
      </div>

      {/* Sidebar for Small Screens (Overlay Drawer) */}
      {isSidebarOpen && (
        <div
          id="sidebar-overlay"
          className="fixed inset-0 bg-black bg-opacity-40 z-50"
          onClick={handleClickOutside}
        >
          <div className="fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md transform transition-transform duration-300">
            <button
              className="absolute top-4 right-4 text-gray-600"
              onClick={toggleSidebar}
            >
              <CloseOutlined className="text-xl" />
            </button>
            <SidebarContent
              toggleSidebar={toggleSidebar}
              isSmallScreen={true}
            />
          </div>
        </div>
      )}
    </>
  );
};

const SidebarContent = ({ toggleSidebar, isSmallScreen }) => {
  const { fetchUserProfile } = useUserProfileStore();
  const { currentUser, signout } = userStore();
  const [userProfile, setUserProfile] = useState(null);

  const userId = currentUser?._id;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signout(); // Call the signout function from the store
   
      if (isSmallScreen) toggleSidebar(); // Close sidebar on small screens
      navigate("/signin"); // Redirect to signin page
    } catch (error) {
      console.error("Signout error in handleSignOut:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  useEffect(() => {
    const getUserProfile = async () => {
      if (!userId) return; // Skip if no userId
      try {
        const response = await fetchUserProfile(userId);
        setUserProfile(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    getUserProfile();
  }, [userId, fetchUserProfile]);

  return (
    <div className="grid h-screen">
      {/* Top Section */}
      <div className="flex flex-col items-center py-6 bg-white">
        <div className="flex rounded-full items-center justify-center border-2 border-indigo-400">
          <img
            src={userProfile?.profilePic || "/images/default-profile.jpg"} // Fallback image
            alt="User"
            className="rounded-full h-20 w-20"
          />
        </div>
        <span className="mt-4 text-lg font-semibold text-gray-700">
          {userProfile?.username || "Username"}
        </span>
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="flex flex-col items-center space-y-8 sm:space-y-6 py-4 overflow-y-auto">
        {[
          {
            name: "Home",
            icon: <HomeOutlined className="text-lg text-gray-700" />,
            to: "/",
          },
          {
            name: "History",
            icon: <HistoryOutlined className="text-lg text-gray-700" />,
            to: "/history",
          },
          {
            name: "Analysis",
            icon: <BarChartOutlined className="text-lg text-gray-700" />,
            to: "/analysis",
          },
          {
            name: "Reports",
            icon: <FileTextOutlined className="text-lg text-gray-700" />,
            to: "/reports",
          },
          {
            name: "Settings",
            icon: <SettingOutlined className="text-lg text-gray-700" />,
            to: "/settings",
          },
        ].map(({ name, icon, to }) => (
          <NavLink
            key={name}
            to={to}
            className={({ isActive }) =>
              `w-[85%] flex items-center gap-2 py-2 px-2 font-bold rounded-xl text-gray-600 text-md ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 border-2 border-indigo-600"
                  : "hover:bg-gray-200"
              }`
            }
            onClick={() => {
              if (isSmallScreen) toggleSidebar();
            }}
          >
            {icon} <span>{name}</span>
          </NavLink>
        ))}
        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          className="w-[85%] flex items-center space-x-2 py-2 px-2  lg:hidden rounded-xl text-gray-600 text-md font-bold hover:bg-gray-200"
        >
          <LogOut className="text-lg text-gray-700" />
          <span>Logout</span>
        </button>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center py-6 bg-white">
        <div className="flex items-center justify-center">
          <img
            src="/images/applogo.jpg"
            className="h-16 w-auto rounded-2xl"
            alt="App Logo"
          />
        </div>
        <span className="text-center text-xs text-gray-500 mt-2">
          © 2025 Expense Tracker. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
