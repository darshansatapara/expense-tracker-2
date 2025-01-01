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
    console.log("user saved");

    // Save user credentials to the user database
    const UserCredentialModel = UserCredential(userDbConnection); // Get model for this connection

    const userCredential = new UserCredentialModel({
      email: savedUser.email,
      password: hashedPassword,
    });

    await userCredential.save();
    console.log("user credential saved");

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
  } catch (err) {
    // Handle duplicate errors more precisely
    if (err.code === 11000) {
      const duplicateKey = Object.keys(err.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateKey} already exists. Please use a different ${duplicateKey}.`,
      });
    }

    next(err); // Pass other errors to error-handling middleware
  }
};

// Sign-in controller
export const signIn = (userDbConnection) => async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const UserCredentialModel = UserCredential(userDbConnection);
    const UserProfileModel = UserProfile(userDbConnection);


    const userCredential = await UserCredentialModel.findOne({ email });

    if (!userCredential) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userCredential.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Fetch user profile using the UserProfile model
    const user = await UserProfileModel.findOne({
      email: userCredential.email,
    });

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
      },
    });
  } catch (error) {
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
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sign-out controller
export const signOut = () => (req, res) => {
  res.clearCookie("token");
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
