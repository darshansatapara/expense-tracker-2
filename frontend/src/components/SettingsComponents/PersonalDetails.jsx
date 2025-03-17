import React, { useEffect, useState, useRef } from "react";
import useUserProfileStore from "../../store/UserStore/userProfileStore.js";
import { Input, Button, message, DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function PersonalDetails() {
  const { fetchUserProfile, updateUserProfile } = useUserProfileStore();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const userId = "67932feef0d689eeeaddcf86";

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile(userId);
        setUserProfile(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getUserProfile();
    }
  }, [userId, fetchUserProfile]);

  const handleInputChange = (field, value) => {
    setUserProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date, dateString) => {
    // Convert to ISO format (YYYY-MM-DD) for backend
    const isoDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setUserProfile((prev) => ({
      ...prev,
      date_of_birth: isoDate,
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({
          ...prev,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    setIsUpdating(true);
    try {
      const updatedData = {
        profilePic: userProfile.profilePic,
        username: userProfile.username,
        email: userProfile.email,
        mobile_no: userProfile.mobile_no,
        date_of_birth: userProfile.date_of_birth, // Now in YYYY-MM-DD format
      };

      await updateUserProfile(userId, updatedData);
      message.success("Profile updated successfully");
    } catch (err) {
      message.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white">Personal Details</h2>
            <p className="text-blue-100 mt-1">Your profile information</p>
          </div>

          <div className="p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <img
                  src={userProfile?.profilePic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handleImageClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  value={userProfile?.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full rounded-md"
                  size="large"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  value={userProfile?.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full rounded-md"
                  size="large"
                  type="email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <Input
                  value={userProfile?.mobile_no || ""}
                  onChange={(e) =>
                    handleInputChange("mobile_no", e.target.value)
                  }
                  className="w-full rounded-md"
                  size="large"
                  type="tel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <DatePicker
                  value={
                    userProfile?.date_of_birth
                      ? dayjs(userProfile.date_of_birth) // Parse ISO or DD/MM/YYYY if stored differently
                      : null
                  }
                  onChange={handleDateChange}
                  format="DD/MM/YYYY" // Display format for user
                  className="w-full rounded-md"
                  size="large"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                type="primary"
                size="large"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={handleSaveChanges}
                loading={isUpdating}
                disabled={isUpdating}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
