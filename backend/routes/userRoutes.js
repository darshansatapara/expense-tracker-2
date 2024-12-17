// Import required modules using ES module syntax
import express from "express";

import { signUp, signIn, getUserById } from "../controllers/userController.js";
// Create a router instance
const router = express.Router();

// Define routes and map them to controller functions
router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/user/:userId", getUserById);

export default router;
