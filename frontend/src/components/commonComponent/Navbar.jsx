import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  BarChartOutlined,
  HistoryOutlined,
  SettingOutlined,
  FileTextOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { BellPlus, LogOut, ShieldQuestion } from "lucide-react";
import NotificationModal from "../NotificationComponents/Notification"; // Import the new modal component
import { userStore } from "../../store/UserStore/userAuthStore.js";
const Navbar = ({ toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signout } = userStore();
  const pathMap = {
    "/": {
      name: "Home",
      icon: <HomeOutlined className="text-lg text-gray-700" />,
    },
    "/analysis": {
      name: "Analysis",
      icon: <BarChartOutlined className="text-lg text-gray-700" />,
    },
    "/history": {
      name: "History",
      icon: <HistoryOutlined className="text-lg text-gray-700" />,
    },
    "/settings": {
      name: "Settings",
      icon: <SettingOutlined className="text-lg text-gray-700" />,
    },
    "/reports": {
      name: "Reports",
      icon: <FileTextOutlined className="text-lg text-gray-700" />,
    },
  };
  
  const handleSignOut = async () => {
    try {
      const result = await signout();
    
      navigate("/signin");
    } catch (error) {
      console.error("Signout error in handleSignOut:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  };

  const mainPath = location.pathname.split("/")[1];
  const { name, icon } = pathMap[`/${mainPath}`] || {
    name: "Unknown",
    icon: <ShieldQuestion />,
  };

  const dialogs = [
    "Track your daily expenses effortlessly!",
    "Save more with smarter budgeting.",
    "Plan your finances for a brighter future.",
    "Stay on top of your spending habits.",
    "Visualize your financial goals today!",
  ];

  const [dialogIndex, setDialogIndex] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDialogIndex((prevIndex) => (prevIndex + 1) % dialogs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [dialogs.length]);

  // Add a mock notification when the user lands on the homepage
  useEffect(() => {
    const currentDate = new Date();
    setNotifications([
      {
        message: "Welcome to Expense Tracker!",
        time: `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`,
      },
    ]);
  }, []);

  return (
    <div className="w-full bg-white border-b-2">
      <nav className="flex items-center justify-between px-4 py-2 md:px-8">
        {/* Left Section */}
        <div className="flex items-center space-x-2">
          <div className="p-2">
            <div className="flex items-center space-x-2">
              {icon}
              <span className="text-lg font-semibold">{name}</span>
            </div>
          </div>
        </div>

        {/* Middle Section (Hidden on small screens) */}
        <div className="hidden md:flex justify-center flex-grow">
          <div className="text-center text-sm md:text-lg font-medium text-gray-600 transition-opacity">
            {dialogs[dialogIndex]}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <button
            className="relative hover:cursor-pointer"
            onClick={() => setShowNotification(true)} // Show modal on click
          >
            <BellPlus />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full"></span>
            )}
          </button>
          {/* Logout Button Hidden on Small Screens */}
          <div
            className="hidden lg:flex hover:cursor-pointer rounded-md h-8 w-8 items-center justify-center"
            onClick={handleSignOut}
          >
            <LogOut />
          </div>
          {/* Hamburger Menu for Small Screens */}
          <button
            className="lg:hidden p-2 bg-gray-100 rounded-md shadow-lg"
            onClick={toggleSidebar}
          >
            <MenuOutlined className="text-xl text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Notification Modal Box */}
      <NotificationModal
        showModal={showNotification} // Pass modal visibility
        notifications={notifications} // Pass notifications data
        onClose={() => setShowNotification(false)} // Pass close handler
      />
    </div>
  );
};

export default Navbar;
