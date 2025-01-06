import React from "react";

const PrivacyPolicyMobileScreen = () => {
  return (
    <div className="min-h-screen bg-[#D9EAFD] py-6 px-4">
      {/* Privacy Policy Title */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-nunito">Privacy Policy</h1>
        <p className="text-gray-600 mt-2 text-base font-nunito">Your privacy is important to us</p>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-[#F8FAFC] p-6 rounded-lg shadow-lg space-y-4 font-nunito border-2">
        <h2 className="text-xl font-semibold text-gray-700">Introduction</h2>
        <p className="text-gray-600">
          This Privacy Policy explains how we collect, use, and safeguard your personal information. By using our services, you agree to the practices outlined in this policy.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Information We Collect</h2>
        <p className="text-gray-600">
          We collect personal information, such as your name, email address, phone number, and other relevant details when you register or use our services. Additionally, we may collect:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Usage data such as IP addresses, browser types, and session durations.</li>
          <li>Transaction data such as payment method and billing information.</li>
          <li>Location data if you have enabled location tracking on your device.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700">How We Use Your Information</h2>
        <p className="text-gray-600">
          We use your information to provide you with the best user experience, improve our services, communicate with you, and maintain the security of our platform.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Data Security</h2>
        <p className="text-gray-600">
          We take reasonable measures to protect your data from unauthorized access or disclosure. However, no method of data transmission is completely secure.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Cookies</h2>
        <p className="text-gray-600">
          We use cookies to enhance your experience on our website. Cookies allow us to remember your preferences and help us analyze website traffic.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Third-Party Services</h2>
        <p className="text-gray-600">
          We may share your information with trusted third-party service providers to help us perform essential services such as processing payments.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Data Retention</h2>
        <p className="text-gray-600">
          We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, including legal obligations.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Your Rights</h2>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Access, update, or delete your personal information at any time.</li>
          <li>Opt-out of marketing communications.</li>
        </ul>

        <h2 className="text-xl font-semibold text-gray-700">User Consent</h2>
        <p className="text-gray-600">
          By using our services, you consent to the collection, use, and processing of your personal information as outlined in this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. Any changes will be communicated through our platform or via email.
        </p>

        <h2 className="text-xl font-semibold text-gray-700">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns, please reach out to us at <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">expensetracker1908@gmail.com</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyMobileScreen;
