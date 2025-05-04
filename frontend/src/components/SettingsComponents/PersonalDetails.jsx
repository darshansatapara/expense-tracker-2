import React, { useEffect, useState, useRef } from "react";
import useUserProfileStore from "../../store/UserStore/userProfileStore.js";
import { message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import DynamicInputField from "./DynamicInputField"; // Import reusable component
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { userStore } from "../../store/UserStore/userAuthStore";

dayjs.extend(customParseFormat);

export default function PersonalDetails() {
  const { currentUser } = userStore();
  const { fetchUserProfile, updateUserProfile } = useUserProfileStore();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editField, setEditField] = useState(null); // Track which field is being edited
  const fileInputRef = useRef(null);

  const userId = currentUser?._id;

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile(userId);
        // Transform date_of_birth to YYYY-MM-DD for rendering
        const profileData = {
          ...response.data,
          date_of_birth: response.data.date_of_birth
            ? dayjs(response.data.date_of_birth, "DD/MM/YYYY").format(
                "YYYY-MM-DD"
              )
            : "",
        };
        setUserProfile(profileData);
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
        setEditField("profilePic");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveField = async (field) => {
    try {
      let updatedData = {
        [field]: userProfile[field],
      };

      // Transform date_of_birth back to DD/MM/YYYY for the backend
      if (field === "date_of_birth" && userProfile[field]) {
        updatedData[field] = dayjs(userProfile[field]).format("DD/MM/YYYY");
      }

      await updateUserProfile(userId, updatedData);
      message.success(
        `${
          field === "profilePic" ? "Profile picture" : field
        } updated successfully`
      );
      setEditField(null); // Exit edit mode after saving
    } catch (err) {
      message.error(`Failed to update ${field}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-5 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        {/* Title, Subtitle, and Line */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit your personal details here
          </p>
          <div className="border-b border-gray-300 my-4 w-1/6"></div>
        </div>

        {/* Profile Picture, Name, and Profession */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <img
              src={userProfile?.profilePic || "https://via.placeholder.com/100"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover bg-blue-100 cursor-pointer"
              onClick={handleImageClick}
            />
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            {editField === "profilePic" ? (
              <div
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer"
                onClick={() => handleSaveField("profilePic")}
              >
                <SaveOutlined className="text-white text-sm" />
              </div>
            ) : (
              <div
                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 cursor-pointer"
                onClick={handleImageClick}
              >
                <EditOutlined className="text-white text-sm" />
              </div>
            )}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            {userProfile?.username || "John Doe"}
          </h3>
        </div>

        {/* Dynamic Fields - Centered Inputs */}
        <div className="space-y-6 flex flex-col items-center">
          <div className="w-full sm:max-w-md">
            <DynamicInputField
              label="Username"
              value={userProfile?.username || ""}
              field="username"
              onChange={(value) => handleInputChange("username", value)}
              editField={editField}
              setEditField={setEditField}
              type="text"
              icon={<UserOutlined className="text-gray-500 text-lg" />}
              placeholder="Enter your username"
              onSave={() => handleSaveField("username")}
            />
          </div>

          <div className="w-full sm:max-w-md">
            <DynamicInputField
              label="Email"
              value={userProfile?.email || ""}
              field="email"
              onChange={(value) => handleInputChange("email", value)}
              editField={editField}
              setEditField={setEditField}
              type="email"
              icon={<MailOutlined className="text-gray-500 text-lg" />}
              placeholder="Enter your email"
              onSave={() => handleSaveField("email")}
            />
          </div>

          <div className="w-full sm:max-w-md">
            <DynamicInputField
              label="Mobile Number"
              value={userProfile?.mobile_no || ""}
              field="mobile_no"
              onChange={(value) => handleInputChange("mobile_no", value)}
              editField={editField}
              setEditField={setEditField}
              type="tel"
              icon={<PhoneOutlined className="text-gray-500 text-lg" />}
              placeholder="Enter your mobile number"
              onSave={() => handleSaveField("mobile_no")}
            />
          </div>

          <div className="w-full sm:max-w-md">
            <DynamicInputField
              label="Date of Birth"
              value={userProfile?.date_of_birth || ""}
              field="date_of_birth"
              onChange={(value) => handleInputChange("date_of_birth", value)}
              editField={editField}
              setEditField={setEditField}
              type="date"
              icon={<CalendarOutlined className="text-gray-500 text-lg" />}
              placeholder="Select your date of birth"
              onSave={() => handleSaveField("date_of_birth")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
