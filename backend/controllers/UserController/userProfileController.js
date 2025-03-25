import UserProfile from "../../models/UserModel/UserProfileModel.js";
import cloudinary from "../../config/cloudinary.js";

// Import necessary modules
export const updateUserProfile = (userDbConnection) => async (req, res) => {
  const { id } = req.params;
  const allowedFields = [
    "profilePic",
    "username",
    "email",
    "mobile_no",
    "date_of_birth",
  ];

  const updateData = Object.keys(req.body).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No valid fields provided to update" });
  }

  try {
    // Handle profilePic upload to Cloudinary if provided
    if (
      updateData.profilePic &&
      updateData.profilePic.startsWith("data:image")
    ) {
      const uploadProfilePic = await cloudinary.uploader.upload(
        updateData.profilePic,
        {
          folder: "user_profiles",
          resource_type: "image",
        }
      );
      updateData.profilePic = uploadProfilePic.secure_url;
    } else if (
      updateData.profilePic &&
      !updateData.profilePic.startsWith("http")
    ) {
      delete updateData.profilePic;
    }

    // Transform date_of_birth from DD/MM/YYYY to ISO format
    if (updateData.date_of_birth) {
      const [day, month, year] = updateData.date_of_birth.split("/");
      updateData.date_of_birth = new Date(
        `${year}-${month}-${day}`
      ).toISOString();
    }

    const UserProfileModel = UserProfile(userDbConnection);

    const updatedUser = await UserProfileModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    if (error.code === 11000) {
      const duplicateKey = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateKey} already exists. Please use a different ${duplicateKey}.`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

export const getUserById = (userDbConnection) => async (req, res) => {
  // Check if userDbConnection is provided
  if (!userDbConnection) {
    return res.status(500).json({
      success: false,
      message: "userDbConnection is not provided",
    });
  }

  // Extract user ID from request parameters
  const id = req.params.id;

  try {
    // Log the fetch attempt
    console.log("Fetching user with ID:", id);

    // Create UserProfileModel with userDbConnection
    const UserProfileModel = UserProfile(userDbConnection);

    // Fetch user by ID, selecting specified fields without populating profession
    const user = await UserProfileModel.findById(id).select(
      "profilePic username email mobile_no date_of_birth profession profile_complated category_completed"
    );

    // Handle case where user is not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Format user data for response
    const formattedUser = {
      ...user.toObject(),
      date_of_birth: user.date_of_birth
        ? user.date_of_birth.toLocaleDateString("en-GB")
        : "Unknown",
    };
    delete formattedUser._id;

    // Send successful response with user data
    res.status(200).json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    // Handle errors during fetch
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};
