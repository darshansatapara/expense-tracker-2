import React from "react";
import EmailAndOtpverification from "../components/signupComponents/EmailAndOtpverification";
import { useLocation } from "react-router-dom";
import ProfileSection from "../components/signupComponents/ProfileSection.jsx";

export default function SignupPage() {
  const location = useLocation();
  const subpath = location.pathname.split("/")[2]; // e.g., "profilesignup"
  return (
    <>
      {!subpath && <EmailAndOtpverification />}
      {subpath === "profileSection" && <ProfileSection />}
    </>
  );
}
