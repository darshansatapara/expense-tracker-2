import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Settings_Upper = () => {
  return (
    <div className="bg-[#dfdbdb] p-6 rounded-lg shadow-md flex items-center space-x-6">
      {/* Icon on the left side */}
      <FaUserCircle className="text-7xl text-gray-700" /> {/* Increased size */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 font-nunito">John Doe</h2> {/* Centered text */}
        <p className="text-gray-600 font-nunito">john.doe@example.com</p>
      </div>
    </div>
  );
};

export default Settings_Upper;
