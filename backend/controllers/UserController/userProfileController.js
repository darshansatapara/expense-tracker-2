import UserProfile from "../../models/UserModel/UserProfileModel.js";

// Import necessary modules
export const updateUserProfile = (userDbConnection) => async (req, res) => {
  const { id } = req.params; // The ID of the user to update
  const allowedFields = [
    "profilePic",
    "username",
    "email",
    "mobile_no",
    "date_of_birth",
    "profession",
    "profile_complated",
    "category_completed",
  ];

  // Filter only allowed fields from the request body
  const updateData = Object.keys(req.body).reduce((acc, key) => {
    if (allowedFields.includes(key)) {
      acc[key] = req.body[key];
    }
    return acc;
  }, {});

  // Check if any valid fields are provided
  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "No valid fields provided to update" });
  }

  try {
    // Handle profilePic upload to Cloudinary if provided
    if (updateData.profilePic) {
      try {
        const uploadProfilePic = await cloudinary.uploader.upload(
          updateData.profilePic,
          { folder: "user_profiles" }
        );
        updateData.profilePic = uploadProfilePic.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture.",
        });
      }
    }

    // Perform the update
    const UserProfileModel = UserProfile(userDbConnection);

    const updatedUser = await UserProfileModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true } // `new` to return updated document, `runValidators` for schema validation
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
    // Handle duplicate field errors
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
      error,
    });
  }
};
export const getUserById = (userDbConnection) => async (req, res) => {
  const { id } = req.params; // Get user ID from request

  try {
    const UserProfileModel = UserProfile(userDbConnection);
    const user = await UserProfileModel.findById(id)
      .select("profilePic username email mobile_no date_of_birth profession")  // Include only necessary fields
      .populate("profession", "name"); // Populate profession field with the name
      console.log(user)

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Format the date_of_birth to only return the date part (without the time)
    const formattedUser = {
      ...user.toObject(),
      date_of_birth: user.date_of_birth ? user.date_of_birth.toLocaleDateString("en-GB") : "Unknown", // Format or handle if date_of_birth is null
    };

    // Remove the _id field from the response
    delete formattedUser._id;

    // Send the response with the formatted user data
    res.status(200).json({
      success: true,
      data: formattedUser, // Send the formatted user object
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message, // Provide error message for better debugging
    });
  }
};



