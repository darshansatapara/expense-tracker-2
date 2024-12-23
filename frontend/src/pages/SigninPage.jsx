
import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Mail, Lock } from "lucide-react";
import { userStore } from "../store/userStore.js";
import Signup from "../components/signupComponents/SignUpInContent/Signup_Left.jsx";
import { useNavigate } from "react-router-dom";
import OAuth2 from "../components/signinComponent/GoogleSignin.jsx";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin, isSigningIn } = userStore(); // Access store

  const [email, setEmail] = useState(""); // Local state for email input
  const [password, setPassword] = useState(""); // Local state for password input

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }
    const payload = {
      email,
      password,
    };

    try {
      await signin(payload); // Call the store's signin function
      message.success("Profile saved successfully!");
      navigate("/");
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      {/* Left section */}
      <div className="hidden lg:block px-20 justify-center items-center">
        <Signup />
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
            Sign In
          </h2>
          <form onSubmit={handleSignIn}>
            <div className="mb-7">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<Mail className="text-blue-500" />}
                placeholder="Email"
                size="large"
                className="rounded-md"
                disabled={isSigningIn} // Disable input while signing in
              />
            </div>
            <div className="mb-7">
              <Input.Password
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<Lock className="text-yellow-500" />}
                placeholder="Password"
                size="large"
                className="rounded-md"
                disabled={isSigningIn} // Disable input while signing in
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
              loading={isSigningIn} // Show loading spinner
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
            <OAuth2 />
          </form>
          {/* <OAuth /> */}
          <div className="text-center mt-7">
            <p className="text-gray-600">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
