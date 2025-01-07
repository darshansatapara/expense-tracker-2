import React, { useState, useEffect } from "react";
import Settings_Upper from "../components/SettingsComponents/Settings_Upper";
import Settings_Lower from "../components/SettingsComponents/Settings_Lower";
import SettingsMobile from "../components/MobileScreenComponents/SettingsmobileScreen";
import Navbar from '../components/homeComponent/Navbar/'

const SettingsPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set breakpoint for mobile
    };

    handleResize(); // Check on initial render
    window.addEventListener("resize", handleResize); // Add event listener

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
    };
  }, []);

  return (
    <div>
      {isMobile ? (
        // Mobile View
        <div className="p-4 bg-gray-50 min-h-screen">
          <SettingsMobile />
        </div>
      ) : (
        // Desktop View
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/6 bg-gray-100 h-screen shadow-md">
            <h2 className="text-lg font-bold p-4">Sidebar</h2>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col  bg-gray-50 min-h-screen">
            {/* Navbar */}
            <div className="bg-white shadow-md p-4 sticky top-0 z-10">
              <h1 className="text-xl font-bold">Navbar</h1>
            </div>

            {/* Content Area */}
            <div className="flex flex-col space-y-6 mt-6">
              <Settings_Upper />
              <Settings_Lower />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
