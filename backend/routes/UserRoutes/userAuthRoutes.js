import express from "express";
import {
  signUp,
  signIn,
  getUserById,
  googlesignin,
  signOut,
} from "../../controllers/UserController/userAuthController.js";

const userAuthRoute = (userDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }

  const router = express.Router();

  // Pass the controller functions as references, not invoked immediately
  router.post("/signup", (req, res) => signUp(req, res, userDbConnection));
  router.post("/signin", (req, res) => signIn(req, res, userDbConnection));
  router.post("/googlesignin", (req, res) =>
    googlesignin(req, res, userDbConnection)
  );
  router.post("/signout", signOut); // Assuming signOut doesn't require the database connection
  router.get("/user/:userId", (req, res) =>
    getUserById(req, res, userDbConnection)
  );

  return router;
};

export default userAuthRoute;
