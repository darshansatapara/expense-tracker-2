import React, { useState } from "react";
import { Button, notification } from "antd";
import SignupLeft from "./SignUpInContent/Signup_Left";
import PasswordInput from "../InputComponents/PasswordInput.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { userStore } from "../../store/UserStore/userAuthStore.js"; // Updated import

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updatePassword } = userStore(); // Use the updated store
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const email = location.state?.email || "";

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notification.error({
        message: "Password Mismatch",
        description: "Your passwords do not match. Please try again.",
      });
      return;
    }

    if (password.length < 8) {
      notification.error({
        message: "Invalid Password",
        description: "Password must be at least 8 characters long.",
      });
      return;
    }

    try {
      await updatePassword(email, password);
      notification.success({
        message: "Password Updated",
        description: "Your password has been successfully updated.",
      });
      navigate("/signin");
    } catch (error) {
      notification.error({
        message: "Error",
        description: "Failed to update password. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      <div className="hidden lg:block px-20 justify-center items-center">
        <SignupLeft />
      </div>
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
            Reset Your Password
          </h2>
          <p className="text-gray-600 text-center mb-7">
            Create a strong password to secure your account.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-7">
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>
            <div className="mb-7">
              <PasswordInput
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
              />
            </div>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
            >
              Reset Password
            </Button>
          </form>
          <div className="text-center mt-7">
            <p className="text-gray-600">
              Remembered your password?{" "}
              <a href="/signin" className="text-blue-500 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}