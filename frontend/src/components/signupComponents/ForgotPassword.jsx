import React from "react";
import EmailAndOtpVerification from "./EmailAndOtpverification.jsx";

export default function ForgotPassword() {
  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      <EmailAndOtpVerification isForgotPassword={true} />
    </div>
  );
}