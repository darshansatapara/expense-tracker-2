import { Button } from "antd";
import { AiFillGoogleCircle } from "react-icons/ai";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { app } from "../../utils/firebase.js";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultfromgoogle = await signInWithPopup(auth, provider);

      const user = {
        name: resultfromgoogle.user.displayName,
        email: resultfromgoogle.user.email,
      };

      // Navigate to /signup/profilesignup and pass user data as state
      navigate("/signup/passwordSection", { state: { user: user } });
    } catch (error) {
      console.log(error);
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
