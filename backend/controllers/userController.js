import User from "../models/userModel.js";
import UserCredential from "../models/UserCredential.js";
import bcrypt from "bcryptjs";
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
    profession,
  } = req.body;

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
      message: "Please provide all required fields",
    });
  }

  try {
    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      profilePic,
      username,
      email,
      name,
      mobile_no,
      date_of_birth,
      profession,
    });

    // Save the new user in the database
    const savedUser = await newUser.save();

    // If user is saved successfully, save credentials
    const userCredential = new UserCredential({
      email: savedUser.email, // Ensure it matches the User model
      password: hashedPassword, // Use the hashed password
    });

    await userCredential.save();

    // Generate a JWT token for the user
    generateToken(savedUser._id, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        username: savedUser.username,
        email: savedUser.email,
        mobile_no: savedUser.mobile_no,
        date_of_birth: savedUser.date_of_birth,
        profession: savedUser.profession,
      },
    });
  } catch (err) {
    // Check for duplicate email error in either User or UserCredential
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already exists. Please use a different email.",
      });
    }

    next(err); // Pass errors to the error-handling middleware
  }
};

// Sign-in controller
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user credentials and populate the associated user details
    const userCredential = await UserCredential.findOne({ email }).populate({
      path: "email", // Path to the referenced User model
      model: "User", // Specify the model explicitly (User)
    });

    if (!userCredential) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userCredential.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // `userCredential.email` contains the populated user details
    const user = userCredential.email;

    // Generate a JWT token for the user
    generateToken(user._id, res);

    // Return user details
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
    next(error); // Pass the error to the error-handling middleware
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
    // Check if the user exists in UserCredential and populate the related User document
    const userCredential = await UserCredential.findOne({ email }).populate({
      path: "email", // Populate the User document
      model: "User",
    });

    if (!userCredential) {
      // If user does not exist, send error response
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    // `userCredential.email` now contains the User document
    const user = userCredential.email;

    // Generate a token for the user using the User model's `_id`
    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      message: "Google Sign-In successful",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        profilePic: user.profilePic,
        mobile_no: user.mobile_no,
        date_of_birth: user.date_of_birth,
        profession: user.profession,
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
        profession: user.profession,
      },
    });
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};
