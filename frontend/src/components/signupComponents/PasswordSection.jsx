import React, { useState } from "react";
import { Button, Input, notification } from "antd";
import SignupLeft from "./SignUpInContent/Signup_Left";
import { useLocation, useNavigate } from "react-router-dom";

export default function PasswordSection() {
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const userMail = location.state?.user?.email || location.state?.email || "";

  // console.log("userMail", userMail); // For debugging, check what email is passed

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      notification.error({
        message: "Password Mismatch",
        description: "Your passwords do not match. Please try again.",
      });
      return;
    }

    // Assuming you have the user's email and password
    const userCredentials = {
      email: userMail, // Use the email passed through state
      password: password, // Use the password from the form
    };

    notification.success({
      message: "Password Updated",
      description: "Your password has been successfully updated.",
    });

    // Navigate to /signup/profilesignup and pass user credentials as state
    navigate("/signup/profileSection", { state: { userCredentials } });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
        {/* Left section */}
        <div className="hidden lg:block px-20 justify-center items-center">
          <SignupLeft />
        </div>

        {/* Right section */}
        <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
          <div className="p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
              Set Your Password
            </h2>
            <p className="text-gray-600 text-center mb-7">
              Create a strong password to secure your account.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-7">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  size="large"
                  className="rounded-md"
                  required
                />
              </div>
              <div className="mb-7">
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  size="large"
                  className="rounded-md"
                  required
                />
              </div>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
              >
                Set Password
              </Button>
            </form>
            {/* <div className="text-center mt-7">
              <p className="text-gray-600">
                Already have an account?{" "}
                <a href="/signin" className="text-blue-500 hover:underline">
                  Sign in
                </a>
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}
