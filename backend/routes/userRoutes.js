// Import required modules using ES module syntax
import express from "express";

import {
  signUp,
  signIn,
  getUserById,
  googlesignin,
  signOut,
  updateUserProfile,
} from "../controllers/userController.js";
// Create a router instance
const router = express.Router();

// Define routes and map them to controller functions
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/googlesignin", googlesignin);
router.post("/signout", signOut);
router.get("/user/:userId", getUserById);
// Update user profile route
router.put("/updateuserprofile/:id", updateUserProfile);

export default router;
