import express from "express";
import { updateUserProfile } from "../../controllers/UserController/userProfileController.js";

const userProfileRoute = (userDbConnection, adminDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }
  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.put(
    "/update-profile/:id",
    updateUserProfile(userDbConnection, adminDbConnection)
  );

  return router;
};
export default userProfileRoute;
