import React from "react";
import { FaUser, FaEdit } from "react-icons/fa";

const PersonalDetails = () => {
  return (
    <div className="min-h-screen flex flex-col font-nunito pt-12 bg-gradient-to-r from-blue-100 to-indigo-200">
      {/* Header Section on Left */}
      <div className="w-full max-w-4xl flex items-start px-8 mb-8">
        <div className="text-left">
          <h2 className="text-3xl font-extrabold text-gray-900">Personal Details</h2>
          <p className="text-gray-500 mt-2 text-lg">
            Update your photo and personal details here.
          </p>
          <hr className="border-gray-600 mt-4 w-full" />
        </div>
      </div>

      {/* Content Section Centered */}
      <div className="flex flex-col items-center w-full max-w-lg mx-auto">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex justify-center items-center shadow-xl">
            <FaUser className="text-6xl text-white" />
          </div>
          <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
            Update Your Profile
          </button>
        </div>

        {/* Personal Details Section */}
        <div className="w-full p-6 bg-gray-100 rounded-lg shadow-lg border border-gray-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">UserName</h3>
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition duration-200">
              <FaEdit />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-gray-800 font-medium">Profession</p>
              <p className="text-gray-600">Software Engineer</p>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Email</p>
              <p className="text-gray-600">example@example.com</p>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Mobile Number</p>
              <p className="text-gray-600">+123 456 7890</p>
            </div>
            <div>
              <p className="text-gray-800 font-medium">Date of Birth</p>
              <p className="text-gray-600">January 1, 1990</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
