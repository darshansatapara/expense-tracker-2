import React, { useState } from "react";
import { Input, Button, notification } from "antd";
import { Mail, Key } from "lucide-react";
import Signup from "./leftContent/Signup_Left";
import { useOtpStore } from "../../store/otpStore.js";
import OAuth from "./GoogleAuth.jsx";

export default function First() {
  const {
    sendOtp,
    isSendingOtp,
    otpSent,
    verifyOtp,
    isVerifyingOtp,
    otpVerified,
  } = useOtpStore(); // Access store

  const [email, setEmail] = useState(""); // Local state for email input
  const [otp, setOtp] = useState(""); // Local state for OTP input

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
    });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!email) {
      return openNotification(
        "error",
        "Invalid Input",
        "Please enter a valid email address."
      );
    }

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation regex
      return emailRegex.test(email);
    };

    if (!validateEmail(email)) {
      return openNotification(
        "error",
        "Invalid Email",
        "The email address entered is not valid. Please try again."
      );
    }

    try {
      await sendOtp(email); // Call the store's sendOtp function
      openNotification(
        "success",
        "OTP Sent",
        "The OTP has been sent to your email address."
      );
    } catch (error) {
      openNotification(
        "error",
        "Error",
        "Failed to send OTP. Please try again."
      );
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      return openNotification(
        "error",
        "Invalid Input",
        "Please enter a valid 6-digit OTP."
      );
    }

    try {
      await verifyOtp(email, otp); // Call the store's verifyOtp function
      openNotification(
        "success",
        "Verification Successful",
        "Your OTP has been verified successfully!"
      );
    } catch (error) {
      openNotification(
        "error",
        "Error",
        "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
        {/* Left section */}
        <div className="hidden lg:block px-20 justify-center items-center">
          <Signup />
        </div>

        {/* Right section */}
        <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
          <div className="p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
              {otpVerified
                ? "Verification Successful"
                : "Welcome to Expanse Tracker"}
            </h2>
            <p className="text-gray-600 text-center mb-7">
              {otpVerified
                ? "Your OTP has been verified successfully!"
                : otpSent
                ? "Please enter the OTP sent to your email."
                : "Create your account to continue"}
            </p>
            {!otpVerified && (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                {!otpSent && (
                  <div className="mb-7">
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      prefix={<Mail className="text-blue-500" />}
                      placeholder="Email"
                      size="large"
                      className="rounded-md"
                      disabled={isSendingOtp} // Disable input while sending OTP
                    />
                  </div>
                )}
                {otpSent && (
                  <div className="mb-7">
                    <Input
                      value={otp}
                      onChange={
                        (e) => setOtp(e.target.value.slice(0, 6)) // Restrict input to 6 characters
                      }
                      prefix={<Key className="text-yellow-500" />}
                      placeholder="OTP"
                      size="large"
                      className="rounded-md"
                      disabled={isVerifyingOtp} // Disable input while verifying OTP
                    />
                  </div>
                )}
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
                  loading={isSendingOtp || isVerifyingOtp} // Show loading spinner
                  disabled={otpVerified} // Disable button if OTP is already verified
                >
                  {isSendingOtp
                    ? "Sending..."
                    : isVerifyingOtp
                    ? "Verifying..."
                    : otpSent
                    ? "Verify OTP"
                    : "Send OTP"}
                </Button>
              </form>
            )}
            <OAuth />
            {otpVerified && (
              <div className="text-center mt-7">
                <p className="text-green-600 font-semibold">
                  You can now proceed to the next step.
                </p>
              </div>
            )}
            {!otpVerified && (
              <div className="text-center mt-7">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <a href="/signin" className="text-blue-500 hover:underline">
                    Sign in
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
