import User from "../../models/UserModel/UserProfileModel.js";
import UserCredential from "../../models/UserModel/UserCredential.js";
import bcrypt from "bcryptjs";
import cloudinary from "../../config/cloudinary.js";
import { generateToken } from "../../config/tokenGenerate.js";

// Sign-up controller
export const signUp = (userDbConnection) => async (req, res, next) => {
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
    let profilePhoto =
      null ||
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    // Upload profilePic to Cloudinary if available
    if (profilePic) {
      const uploadProfilePic = await cloudinary.uploader.upload(profilePic, {
        folder: "user_profiles",
      });
      profilePhoto = uploadProfilePic.secure_url;
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      profilePic: profilePhoto,
      username,
      email,
      name,
      mobile_no,
      date_of_birth,
      profession,
    });

    // Save the new user in the database
    const savedUser = await newUser.save({
      session: userDbConnection.startSession(),
    });

    // If user is saved successfully, save credentials
    const userCredential = new UserCredential({
      email: savedUser.email,
      password: hashedPassword,
    });

    await userCredential.save({
      session: userDbConnection.startSession(),
    });

    // Generate a JWT token for the user
    generateToken(savedUser._id, res);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
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
export const signIn = (userDbConnection) => async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const UserCredentialModel = userDbConnection.model(
      "UserCredential",
      UserCredential.schema
    );
    const UserModel = userDbConnection.model("User", User.schema);

    const userCredential = await UserCredentialModel.findOne({
      email,
    }).populate({
      path: "email",
      model: UserModel,
    });

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

    const user = userCredential.email;

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
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const UserCredentialModel = userDbConnection.model(
      "UserCredential",
      UserCredential.schema
    );
    const UserModel = userDbConnection.model("User", User.schema);

    const userCredential = await UserCredentialModel.findOne({ email }).populate({
      path: "email",
      model: UserModel,
    });

    if (!userCredential) {
      return res.status(404).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    const user = userCredential.email;

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
    const user = await userDbConnection.model("User", User.schema).findById(
      userId
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
