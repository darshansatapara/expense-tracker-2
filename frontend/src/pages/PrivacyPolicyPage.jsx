// pages/privacyandpolicypage.jsx
import React from "react";
import PrivacyPolicy from "../components/PrivacyandPolicycomponents/PrivacyAndPolicy";
import PrivacyPolicyMobileScreen from "../components/MobileScreenComponents/PrivacyAndPolicymobilescreen";

const PrivacyAndPolicyPage = () => {
  return (
    <div>
      {/* Check for mobile screen width and render the appropriate component */}
      <div className="hidden md:block">
        <PrivacyPolicy />
      </div>
      <div className="md:hidden">
        <PrivacyPolicyMobileScreen />
      </div>
    </div>
  );
};

export default PrivacyAndPolicyPage;
