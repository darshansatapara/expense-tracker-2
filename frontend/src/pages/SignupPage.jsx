import React from "react";
import EmailAndOtpverification from "../components/signupComponents/EmailAndOtpverification";
import { useLocation } from "react-router-dom";
import ProfileSection from "../components/signupComponents/ProfileSection.jsx";
import PasswordSection from "../components/signupComponents/PasswordSection.jsx";

export default function SignupPage() {
  const location = useLocation();
  const subpath = location.pathname.split("/")[2]; // e.g., "profilesignup"
  return (
    <>
      {!subpath && <EmailAndOtpverification />}
      {subpath === "passwordSection" && <PasswordSection />}
      {subpath === "profileSection" && <ProfileSection />}
    </>
  );
}
