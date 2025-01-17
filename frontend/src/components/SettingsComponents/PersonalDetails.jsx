import React from "react";
import { FaUser, FaEdit } from "react-icons/fa";

const PersonDetails = () => {
  return (
    <div className="min-h-screen flex justify-center items-start pt-12 bg-gray-100">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg mx-auto p-8">
        {/* Header Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Personal Details</h2>
          <p className="text-gray-500 mt-2">
            Update your Photo and Personal Details here.
          </p>
          <hr className="border-gray-300 mt-4" />
        </div>

        {/* Content Section */}
        <div className="mt-8 flex flex-col items-center">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex justify-center items-center">
              <FaUser className="text-6xl text-gray-400" />
            </div>
            <button className="mt-4 bg-[#DAD5D5] text-black py-2 px-4 rounded-lg shadow-md hover:bg-gray-200 transition duration-300">
              Update Your Profile
            </button>
          </div>

          {/* Personal Details Section */}
          <div className="mt-8 w-full max-w-md p-6 bg-[#F4F2F2] rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">UserName</h3>
              <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition duration-200">
                <FaEdit />
                <span>Edit</span>
              </button>
            </div>
            <div className="space-y-4">
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
    </div>
  );
};

export default PersonDetails;
