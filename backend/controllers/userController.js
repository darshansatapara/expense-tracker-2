import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/utils.js";

// Sign-up controller
export const signUp = async (req, res, next) => {
  const {
    profilePic,
    username,
    email,
    password,
    name,
    mobile_no,
    date_of_birth,
    category,
  } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    !mobile_no ||
    !date_of_birth ||
    !category
  ) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    let profilePhoto =
      null ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    // Upload profilePic to Cloudinary if available
    if (profilePic) {
      const uploadProfilePic = await cloudinary.uploader.upload(profilePic, {
        folder: "user_profiles", // Optional: Organize images in a folder on Cloudinary
      });
      profilePhoto = uploadProfilePic.secure_url;
      console.log("Uploaded Profile Photo URL:", profilePhoto);
    }
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      profilePic: profilePhoto,
      username,
      email,
      password: hashedPassword,
      name,
      mobile_no,
      date_of_birth,
      category,
    });

    // console.log(newUser);
    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);

      // save the new user in the database
      await newUser.save();

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          username: newUser.username,
          email: newUser.email,
          mobile_no: newUser.mobile_no,
          date_of_birth: newUser.date_of_birth,
          category: newUser.category,
        },
      });
    }
  } catch (err) {
    next(err); // Pass errors to the error-handling middleware
  }
};

// Sign-in controller
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ email });
    // const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilepic: user.profilePic,
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// google singin
export const googlesignin = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    // Check if the user exists
    const user = await User.findOne({ email: email });

    if (!user) {
      // If user does not exist, send error response
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    // Generate a token for the user
    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Google Sign-In successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Error during Google Sign-In:", err.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// Get user by ID controller
export const getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // Find user by _id
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Send the user details without the password
    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        name: user.name,
        mobile_no: user.mobile_no,
        date_of_birth: user.date_of_birth,
        category: user.category,
      },
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};
