import jwt from "jsonwebtoken";
import UserProfile from "../../models/UserModel/UserProfileModel.js";

export const protect = (userDbConnection) => async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token, authorization denied" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid token, authorization denied",
        });
    }

    // Get the user model for this database connection
    const UserProfileModel = UserProfile(userDbConnection);
    const user = await UserProfileModel.findById(decoded.id).select(
      "-password"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};
