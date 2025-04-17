import UserProfile from "../../models/UserModel/UserProfileModel.js";
import UserCredential from "../../models/UserModel/UserCredential.js";
import bcrypt from "bcryptjs";
import cloudinary from "../../config/cloudinary.js";
import { generateToken } from "../../config/tokenGenerate.js";

export const signUp = (userDbConnection) => async (req, res, next) => {
  const {
    profilePic,
    username,
    email,
    password,
    mobile_no,
    date_of_birth,
    profession,
  } = req.body;

  // Validate required fields
  if (
    !username ||
    !email ||
    !password ||
    !mobile_no ||
    !date_of_birth ||
    !profession
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  try {
    let profilePhoto =
      profilePic ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    // Upload profilePic to Cloudinary if provided
    if (profilePic) {
      try {
        const uploadProfilePic = await cloudinary.uploader.upload(profilePic, {
          folder: "user_profiles",
        });
        profilePhoto = uploadProfilePic.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload profile picture.",
        });
      }
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);

    // Create a new user in the user database using the model
    const UserProfileModel = UserProfile(userDbConnection); // Get model for this connection

    const newUser = new UserProfileModel({
      profilePic: profilePhoto,
      username,
      email,
      mobile_no,
      date_of_birth,
      profession,
    });

    // Save the user details to the user database
    const savedUser = await newUser.save();

    // Save user credentials to the user database
    const UserCredentialModel = UserCredential(userDbConnection); // Get model for this connection

    const userCredential = new UserCredentialModel({
      email: savedUser.email,
      password: hashedPassword,
    });

    await userCredential.save();
    console.log("user credential saved", savedUser);

    if (savedUser) {
      // Generate JWT Token
      generateToken(savedUser._id, res);

      // Send response
      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        user: {
          _id: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
          mobile_no: savedUser.mobile_no,
          date_of_birth: savedUser.date_of_birth,
          profession: savedUser.profession,
        },
      });
    } else {
      res.status(400).json({ message: "invalid user data" });
    }
  } catch (err) {
    // Handle duplicate errors more precisely
    if (err.code === 11000) {
      const duplicateKey = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message:
          "${duplicateKey} already exists. Please use a different ${duplicateKey}.",
      });
    }

    next(err); // Pass other errors to error-handling middleware
  }
};

// update the profilestatus when complete the signup process
export const updateProfileStatus = (userDbConnection) => async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, error: "Invalid userId" });
  }

  try {
    const UserProfileModel = UserProfile(userDbConnection);
    // Update the profile_complated field to true
    const user = await UserProfileModel.findOneAndUpdate(
      { _id: userId },
      { profile_complated: true },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile marked as completed", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update the profilestatus when complete the signup process
export const updateCategoryStatus = (userDbConnection) => async (req, res) => {
  const { userId } = req.body;

  console.log("userId", userId);

  if (!userId) {
    return res.status(401).json({ success: false, error: "Invalid userId" });
  }

  try {
    const UserProfileModel = UserProfile(userDbConnection);
    // Update the profile_complated field to true
    const user = await UserProfileModel.findOneAndUpdate(
      { _id: userId },
      { category_completed: true },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile marked as completed", user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign-in controller

export const signIn = (userDbConnection) => async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and password are required" });
    }

    const UserCredentialModel = UserCredential(userDbConnection);
    const UserProfileModel = UserProfile(userDbConnection);

    const userCredential = await UserCredentialModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (!userCredential) {
      console.log(`No user found for email: ${email}`);
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    console.log(
      "Input password:",
      password,
      "Stored hash:",
      userCredential.password
    );

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userCredential.password
    );
    if (!isPasswordCorrect) {
      console.log("Password mismatch for email:", email);
      return res
        .status(401)
        .json({ success: false, error: "Invalid password" });
    }

    const user = await UserProfileModel.findOne({
      email: userCredential.email,
    });
    if (!user) {
      console.log(`No user profile found for email: ${email}`);
      return res
        .status(404)
        .json({ success: false, error: "User profile not found" });
    }
    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Sign-in successful",
      user: {
        _id: user._id,
        profilePic: user.profilePic,
        username: user.username,
        email: user.email,
        mobile_no: user.mobile_no,
        date_of_birth: user.date_of_birth,
        profession: user.profession,
        profile_complated: user.profile_complated,
        category_completed: user.category_completed,
      },
    });
  } catch (error) {
    console.error("Sign-in error:", error);
    next(error);
  }
};

// Google sign-in controller
export const googlesignin = (userDbConnection) => async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required" });
  }

  try {
    const UserCredentialModel = UserCredential(userDbConnection);
    const UserProfileModel = UserProfile(userDbConnection);

    const userCredential = await UserCredentialModel.findOne({ email });

    if (!userCredential) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    // Fetch user profile using the UserProfile model
    const user = await UserProfileModel.findOne({
      email: userCredential.email,
    });

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Google Sign-in successful",
      user: {
        _id: user._id,
        profilePic: user.profilePic,
        username: user.username,
        email: user.email,
        mobile_no: user.mobile_no,
        date_of_birth: user.date_of_birth,
        profession: user.profession,
        profile_complated: user.profile_complated,
        category_completed: user.category_completed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign-out controller
export const signOut = () => (req, res) => {
  console.log("Clearing cookie: token"); // Debug log
  res.clearCookie("token", {
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Successfully signed out" });
};

// Get user by ID controller
export const getUserById = (userDbConnection) => async (req, res) => {
  const { userId } = req.params;

  try {
    const UserProfileModel = UserProfile(userDbConnection);
    // Try to find the user by their _id field
    const user = await UserProfileModel.findById(userId);

    // If no user found, return a 404 error
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // If user is found, return the user data
    res.status(200).json({ success: true, user });
  } catch (err) {
    // Log the error to see what is going wrong
    console.error("Error in getUserById:", err);

    // Check if the error is related to the ObjectId format
    if (err.name === "CastError" && err.kind === "ObjectId") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid userId format" });
    }

    // Return generic server error
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const auth = (userDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }

  return async (req, res) => {
    try {
      // Validate req.user from protect middleware
      if (!req.user || !req.user._id) {
        return res
          .status(401)
          .json({ success: false, message: "No authenticated user found" });
      }

      const UserProfileModel = UserProfile(userDbConnection);
      const userProfile = await UserProfileModel.findById(req.user?._id);

      res.json({ success: true, user: userProfile });
    } catch (error) {
      console.error("Error in auth controller:", error.message);
      res
        .status(500)
        .json({ success: false, message: "Server error fetching user data" });
    }
  };
};
