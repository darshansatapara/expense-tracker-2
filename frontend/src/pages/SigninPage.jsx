import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Mail, Lock } from "lucide-react";
import { userStore } from "../store/UserStore/userAuthStore.js";
import Signup from "../components/signupComponents/SignUpInContent/Signup_Left.jsx";
import { useNavigate } from "react-router-dom";
import OAuth2 from "../components/signinComponent/GoogleSignin.jsx";

export default function SignInPage() {
  const navigate = useNavigate();
  const { signin, isSigningIn } = userStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await signin({ email, password });
      const user = response.user;

      if (!user.profile_complated) {
        if (!user.category_completed) {
          // console.log("Navigating to /category with user ID:", user._id);
          navigate("/category", { state: { userId: user._id } });
        } else {
          // console.log(
          //   "Navigating to /category/currencyBudgetSelection with user ID:",
          //   user._id
          // );
          navigate("/category/currencyBudgetSelection", {
            state: { userId: user._id },
          });
        }
      } else {
        message.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || "Failed to sign in. Please try again.";
      setError(errorMessage);
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      <div className="hidden lg:block px-20 justify-center items-center">
        <Signup />
      </div>
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
            Sign In
          </h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSignIn}>
            <div className="mb-7">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<Mail className="text-blue-500" />}
                placeholder="Email"
                size="large"
                className="rounded-md"
                disabled={isSigningIn}
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
                disabled={isSigningIn}
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
              loading={isSigningIn}
            >
              {isSigningIn ? "Signing In..." : "Sign In"}
            </Button>
            <OAuth2 />
          </form>
          <div className="text-center mt-7">
            <p className="text-gray-600">
              Forgot your password?{" "}
              <a
                href="/forgot-password"
                className="text-blue-500 hover:underline"
              >
                Reset it here
              </a>
            </p>
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
