import { Button, message } from "antd";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { app } from "../../utils/firebase.js";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/UserStore/userAuthStore.js";

export default function OAuth2() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { googlesignin } = userStore();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Sign in with Google
      const resultFromGoogle = await signInWithPopup(auth, provider);

      // Extract user email from Google sign-in response
      const email = resultFromGoogle.user.email;

      // Call the store's googlesignin function with the email
      await googlesignin({ email });

      // Wait for `currentUser` to update
      const waitForCurrentUser = () =>
        new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (userStore.getState().currentUser) {
              clearInterval(interval);
              resolve(userStore.getState().currentUser);
            }
          }, 100); // Check every 100ms

          // Timeout after 5 seconds
          setTimeout(() => {
            clearInterval(interval);
            reject(
              new Error("Failed to fetch currentUser after Google Sign-In.")
            );
          }, 1000);
        });

      const updatedUser = await waitForCurrentUser();

      // Safeguard: Check if updatedUser exists and has the required structure
      if (updatedUser && updatedUser.user) {
        const { user } = updatedUser;
        const userId = user._id;

        if (!user.profile_complated) {
          if (!user.category_completed) {
            
            navigate("/category", { state: { userId: user._id } });
          } else {
            navigate("/category/currencyBudgetSelection", {
              state: { userId: userId },
            });
            
          }
        } else {
          message.success("Signed in successfully!");
          navigate("/");
        }
      } else {
        console.error("currentUser is null or user data is missing.");
        message.error("User data not found. Please try again.");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      message.error("Google Sign-In failed. Please try again.");
    }
  };

  return (
    <Button
      type="button"
      className="w-full h-10 bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600 mt-7"
      onClick={handleGoogleClick}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
}
