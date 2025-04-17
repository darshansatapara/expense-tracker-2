import jwt from "jsonwebtoken";
import UserProfile from "../../models/UserModel/UserProfileModel.js";

export const protect = (userDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }

  return async (req, res, next) => {
    try {
      let token;

      console.log(req.cookies);
      // Check for token in cookies or Authorization header
      if (req.cookies && req.cookies?.token) {
        token = req.cookies.token;
      } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      ) {
        token = req.headers.authorization.split(" ")[1];
        console.log(token);
      }

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "No token provided, authorization denied",
        });
      }

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return res
            .status(401)
            .json({ success: false, message: "Token expired" });
        }
        return res
          .status(401)
          .json({ success: false, message: "Invalid token" });
      }

      // Get the user model for this database connection
      const UserProfileModel = UserProfile(userDbConnection);
      const user = await UserProfileModel.findById(decoded.id).select(
        "-password"
      );
      console.log(user);

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error("Protect middleware error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error during authentication",
      });
    }
  };
};
