// import express from "express";
// import {
//   signUp,
//   signIn,
//   getUserById,
//   googlesignin,
//   signOut,
//   updateProfileStatus,
//   updateCategoryStatus,
//   auth,
// } from "../../controllers/UserController/userAuthController.js";
// import { protect } from "../../middlewares/userMiddlewares/authMiddleware.js";

// const userAuthRoute = (userDbConnection) => {
//   if (!userDbConnection) {
//     throw new Error("User database connection is undefined");
//   }

//   const router = express.Router();

//   // Pass the controller functions as references, not invoked immediately
//   router.post("/signup", signUp(userDbConnection));
//   router.post("/signin", signIn(userDbConnection));
//   router.post("/googlesignin", googlesignin(userDbConnection));
//   router.post("/signout", signOut); // Assuming signOut doesn't require the database connection
//   router.get("/user/:userId", getUserById(userDbConnection));

//   // update the profile status when the profile is completed
//   router.put("/profilestatus", updateProfileStatus(userDbConnection));

//   // update the Categgory status when the profile is completed
//   router.put("/categorystatus", updateCategoryStatus(userDbConnection));

//   // Fix the /me route to correctly handle the protect and auth middleware
//   router.get("/me", protect(userDbConnection), auth(userDbConnection));
//   return router;
// };

// export default userAuthRoute;

import express from "express";
import {
  signUp,
  signIn,
  getUserById,
  googlesignin,
  signOut,
  updateProfileStatus,
  updateCategoryStatus,
  auth,
} from "../../controllers/UserController/userAuthController.js";
import { protect } from "../../middlewares/userMiddlewares/authMiddleware.js";

const userAuthRoute = (userDbConnection) => {
  if (!userDbConnection) {
    throw new Error("User database connection is undefined");
  }

  const router = express.Router();

  // Pass the controller functions with userDbConnection pre-applied
  router.post("/signup", signUp(userDbConnection));
  router.post("/signin", signIn(userDbConnection));
  router.post("/googlesignin", googlesignin(userDbConnection));
  router.post("/signout", signOut); // Assuming signOut doesn't require the database connection
  router.get("/user/:userId", getUserById(userDbConnection));

  // Update the profile status when the profile is completed
  router.put("/profilestatus", updateProfileStatus(userDbConnection));

  // Update the Category status when the profile is completed
  router.put("/categorystatus", updateCategoryStatus(userDbConnection));

  // Fix the /me route to correctly handle the protect and auth middleware
  router.get("/me", protect(userDbConnection), auth(userDbConnection));

  return router;
};

export default userAuthRoute;
