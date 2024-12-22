import { Button, message } from "antd";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { app } from "../../utils/firebase.js";
import { useNavigate } from "react-router-dom";
import { userStore } from "../../store/userStore";

export default function OAuth2() {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const { googlesignin } = userStore();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultfromgoogle = await signInWithPopup(auth, provider);

      // Extract user email from Google sign-in response
      const email = resultfromgoogle.user.email;

      // Call the store's googlesignin function with email
      await googlesignin({ email });

      // Redirect to the /category page on success
      navigate("/");

      // Show success message
      message.success("Signed in successfully!");
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed. Please try again.");
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
