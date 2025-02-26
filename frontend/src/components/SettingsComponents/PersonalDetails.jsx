import React, { useEffect, useState } from "react";
import InputField from "./InputField";
import useUserProfileStore from "../../store/UserStore/userProfileStore";

const PersonalDetails = () => {
  const { userProfile, isLoading, error, fetchUserProfile } = useUserProfileStore((state) => state);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    const userId = "679a8b3e3ff0f2bdb0c9780c";
    if(userId){
      fetchUserProfile(userId);
    } // Replace with actual user ID
  }, [fetchUserProfile]);

  useEffect(() => {
    console.log("User Profile Data:", userProfile);
    setEditedProfile(userProfile); // Update local state when userProfile changes
  }, [userProfile]);

  const handleChange = (key, value) => {
    setEditedProfile((prev) => ({ ...prev, [key]: value }));
  };
   // Function to save updated profile data
  //  const handleSaveProfile = async () => {
  //   const userId = "679a8b3e3ff0f2bdb0c9780c";  // Replace with actual user ID
  //   try {
  //     await updateUserProfile(userId, editedProfile);
  //     alert("Profile updated successfully!");
  //   } catch (error) {
  //     alert("Error updating profile: " + error.message);
  //   }
  // };
  

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

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
            src={editedProfile?.profilePic || "/images/user.png"} 
            alt="Profile"
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-3xl font-semibold text-gray-900 mt-4">{editedProfile?.username
          || "N/A"}</h3>
        <p className="text-gray-500 text-sm">{editedProfile?.profession || "N/A"}</p>
      </div>

      {/* Details Section */}
      <div className="w-full max-w-2xl space-y-6">
        {editedProfile &&
          Object.entries(editedProfile).map(([key, value]) => 
            key !== "profilePic" && (
              <InputField
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} 
                value={value || ""}
                placeholder={`Enter your ${key.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                onChange={(val) => handleChange(key, val)}
             
              />
            )
          )}
      </div>
    </div>
  );
};

export default PersonalDetails;
