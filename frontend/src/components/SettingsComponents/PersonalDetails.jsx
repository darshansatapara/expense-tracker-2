import React, { useEffect, useState } from "react";
import { TextInputField, DropdownInputField, NumberInputField } from "./InputField";
import useUserProfileStore from "../../store/UserStore/UserProfileStore";

const PersonalDetails = ({ userId }) => {
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfileStore();

  // Local state for managing form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile_no: "",
    dob: "",
    profession: "",
  });
  console.log("Form Data:", formData);
  console.log("Form Data DOB:", formData.dob);

  useEffect(() => {
    // Fetch the user profile based on the userId
    const userId = "679a8b3e3ff0f2bdb0c9780c"; // You can also pass the userId as a prop
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId, fetchUserProfile]);

  useEffect(() => {
    if (userProfile?.data) {
      setFormData({
        username: userProfile.data.username || "",
        email: userProfile.data.email || "",
        mobile_no: userProfile.data.mobile_no || "",
        dob: userProfile.data.date_of_birth || "", // Fixing the key name
        profession: userProfile.data.profession?.name || "", // Fixing the profession structure
      });
    }
    if (error) {
      console.error("Error fetching data:", error);
    }
  }, [userProfile, error]);
  

  // Log the fetched data to verify it
  useEffect(() => {
    if (userProfile) {
      console.log("Fetched user profile data:", userProfile);
    }
  }, [userProfile]);

  const professions = [
    { id: 1, name: "Software Engineer" },
    { id: 2, name: "Doctor" },
    { id: 3, name: "Teacher" },
  ];

  // Handle change in the input fields and update the state
  const handleChange = (key, value) => {
    console.log("Updating:", key, value); 
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  useEffect(() => {
    console.log("FormData:", formData);
  }, [formData]);

  // Loading and error handling
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error fetching data: {error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-8">
      {/* Header Section */}
      <div className="w-full flex justify-start items-start mb-8">
        <div className="text-left">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Personal Details</h2>
          <p className="text-md text-gray-700">Edit your personal details here.</p>
          <hr className="w-25 my-4 border-gray-300" />
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative flex flex-col items-center -mt-20 mb-8">
        <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl">
          <img
            src={userProfile?.data?.profilePic || "/images/user.png"}
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-3xl font-semibold text-gray-900 mt-4">
          {userProfile?.data?.username|| "N/A"}
        </h3>   
        <p>{userProfile?.data?.profession?.name || "N/A"}</p>
      </div>

      {/* Details Section */}
      <div className="w-full max-w-2xl space-y-7">
        <TextInputField
          label="Username"
          value={formData.username}
          onChange={(val) => handleChange("username", val)}
        />

        <TextInputField
          label="Email"
          value={formData.email}
          onChange={(val) => handleChange("email", val)}
        />
        <NumberInputField
          label="Mobile Number"
          value={formData.mobile_no}
          onChange={(val) => handleChange("mobile_no", val)}
        />
        <TextInputField
          label="Date of Birth"
          value={formData.dob}
          onChange={(val) => handleChange("dob", val)}
        />

        {/* Dropdown with Keyed Mapping */}
        <DropdownInputField
          label="Profession"
          options={professions.map((p) => p.name)}
          value={formData.profession}
          onChange={(name) => {
            const selectedProfession = professions.find((p) => p.name === name);
            handleChange("profession", selectedProfession?.name || "");
          }}
        />
      </div>
    </div>
  );
};

export default PersonalDetails;
