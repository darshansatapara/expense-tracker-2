import User from "../models/userModel.js";
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
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      profilePic: profilePic,
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

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    generateToken(user._id, res);
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err) {
    next(err); // Pass errors to the error-handling middleware
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
