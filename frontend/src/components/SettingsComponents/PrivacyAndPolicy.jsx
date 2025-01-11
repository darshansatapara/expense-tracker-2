// components/privacypolicy.jsx

import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#D9EAFD] py-12 px-4 md:px-16 lg:px-32">
      {/* Privacy Policy Title */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 font-nunito">Privacy Policy</h1>
        <p className="text-gray-600 mt-2 text-lg font-nunito">Your privacy is important to us</p>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-[#F8FAFC] p-8 rounded-lg shadow-lg space-y-6 font-nunito border-2 ">
        <h2 className="text-2xl font-semibold text-gray-700">Introduction</h2>
        <p className="text-gray-600">
          This Privacy Policy explains how we collect, use, and safeguard your personal information. By using our services, you agree to the practices outlined in this policy.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Information We Collect</h2>
        <p className="text-gray-600">
          We collect personal information, such as your name, email address, phone number, and other relevant details when you register or use our services. Additionally, we may collect:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Usage data such as IP addresses, browser types, and session durations.</li>
          <li>Transaction data such as payment method and billing information.</li>
          <li>Location data if you have enabled location tracking on your device.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700">How We Use Your Information</h2>
        <p className="text-gray-600">
          We use your information to provide you with the best user experience, improve our services, communicate with you, and maintain the security of our platform. Specifically, your data may be used for:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Personalizing your experience and providing customer support.</li>
          <li>Processing transactions and managing your account.</li>
          <li>Sending important notices, such as changes to our policies or terms.</li>
          <li>Sending marketing communications (if you have opted in).</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-700">Data Security</h2>
        <p className="text-gray-600">
          We take reasonable measures to protect your data from unauthorized access or disclosure. However, no method of data transmission is completely secure. We employ industry-standard encryption methods, and access to your information is restricted to authorized personnel only.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Cookies</h2>
        <p className="text-gray-600">
          We use cookies to enhance your experience on our website. Cookies allow us to remember your preferences and help us analyze website traffic. You can manage your cookie preferences in your browser settings. Please note that disabling cookies may affect certain functionalities on our website.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Third-Party Services</h2>
        <p className="text-gray-600">
          We may share your information with trusted third-party service providers to help us perform essential services such as processing payments, delivering marketing campaigns, or hosting data. These third parties are contractually bound to handle your data securely and are not permitted to use it for any other purpose.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Data Retention</h2>
        <p className="text-gray-600">
          We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy, including legal, accounting, or reporting obligations. Once your data is no longer needed, we will securely delete or anonymize it.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Your Rights</h2>
        <p className="text-gray-600">
          You have the right to:
        </p>
        <ul className="list-disc pl-6 text-gray-600">
          <li>Access, update, or delete your personal information at any time.</li>
          <li>Opt-out of marketing communications.</li>
          <li>Request a copy of your data in a structured, commonly used format.</li>
          <li>Withdraw consent for data processing (where applicable).</li>
        </ul>
        <p className="text-gray-600">
          To exercise these rights, please contact us using the details in the "Contact Us" section below.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">User Consent</h2>
        <p className="text-gray-600">
          By using our services, you consent to the collection, use, and processing of your personal information as outlined in this Privacy Policy. If you do not agree with this policy, please do not use our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Changes to This Policy</h2>
        <p className="text-gray-600">
          We may update this Privacy Policy from time to time. Any changes will be communicated through our platform or via email. It is important that you review this policy periodically to stay informed about how we are protecting your information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-700">Contact Us</h2>
        <p className="text-gray-600">
          If you have any questions or concerns regarding this Privacy Policy, please feel free to reach out to us through the following methods:
        </p>

        <div className="space-y-4">
          <ul className="text-gray-600 space-y-4">
            <li><strong>Email Support:</strong> For any inquiries, please email us at <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">expensetracker1908@gmail.com</a>.</li>
          </ul>

          <p className="text-gray-600">
            Our team is available to assist you with any questions or concerns you may have. Your feedback is important to us, and we aim to provide the best customer experience.
          </p>

          <h3 className="text-xl font-semibold text-gray-700">Business Hours:</h3>
          <p className="text-gray-600">Our customer support team is available during the following hours:</p>
          <ul className="text-gray-600 list-disc pl-6">
            <li>Monday - Friday: 9 AM - 6 PM</li>
            <li>Saturday: 10 AM - 2 PM</li>
            <li>Sunday: Closed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
