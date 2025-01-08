import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Settings_Upper from "../components/SettingsComponents/Settings_Upper";
import Settings_Lower from "../components/SettingsComponents/Settings_Lower";
import SettingsMobile from "../components/MobileScreenComponents/SettingsmobileScreen";

const SettingsPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? (
        <div className="p-4">
          <SettingsMobile />
        </div>
      ) : (
        <div className="flex flex-col space-y-6 mt-6 p-3 flex-1">
          <Settings_Upper />
          <Settings_Lower />
          <Outlet /> {/* Render child routes */}
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
