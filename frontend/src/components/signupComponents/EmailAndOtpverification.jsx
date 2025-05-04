import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { Button, Input, notification } from "antd";
import { Mail } from "lucide-react";
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";
import { useOtpStore } from "../../store/otpStore.js";
import OAuth from "./GoogleAuth.jsx";
import { useNavigate } from "react-router-dom";

export default function EmailAndOtpVerification({ isForgotPassword = false }) {
  const {
    sendOtp,
    isSendingOtp,
    otpSent,
    verifyOtp,
    isVerifyingOtp,
    otpVerified,
  } = useOtpStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
      await sendOtp(email);
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
      await verifyOtp(email, otp);
      openNotification(
        "success",
        "Verification Successful",
        "Your OTP has been verified successfully!"
      );
      // Redirect based on whether it's forgot password or signup
      const redirectPath = isForgotPassword
        ? "/forgot-password/reset"
        : "/signup/passwordSection";
      navigate(redirectPath, { state: { email } });
    } catch (error) {
      openNotification(
        "error",
        "Error",
        "OTP verification failed. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      {/* Left section */}
      <div className="hidden lg:block px-20 justify-center items-center">
        <SignupLeft />
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-0">
        <div className="p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">
            {otpVerified
              ? "Verification Successful"
              : isForgotPassword
              ? "Reset Your Password"
              : "Welcome to Expanse Tracker"}
          </h2>
          <p className="text-gray-600 text-center mb-7">
            {otpVerified
              ? "Your OTP has been verified successfully!"
              : otpSent
              ? "Please enter the OTP sent to your email."
              : isForgotPassword
              ? "Enter your email to receive an OTP to reset your password."
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
                    disabled={isSendingOtp}
                  />
                </div>
              )}
              {otpSent && (
                <div className="mb-7">
                  <OTPInput
                    value={otp}
                    onChange={(otp) => setOtp(otp)}
                    numInputs={6}
                    separator={<span>-</span>}
                    renderInput={(props) => <input {...props} />}
                    inputStyle={{
                      width: "3rem",
                      height: "3rem",
                      margin: "0.5rem",
                      fontSize: "1.5rem",
                      textAlign: "center",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              )}
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 border-none text-white font-semibold rounded-md hover:from-purple-600 hover:to-pink-600"
                loading={isSendingOtp || isVerifyingOtp}
                disabled={otpVerified}
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
          {!isForgotPassword && <OAuth />}
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
                {isForgotPassword ? (
                  <>
                    Remembered your password?{" "}
                    <a href="/signin" className="text-blue-500 hover:underline">
                      Sign in
                    </a>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <a href="/signin" className="text-blue-500 hover:underline">
                      Sign in
                    </a>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}