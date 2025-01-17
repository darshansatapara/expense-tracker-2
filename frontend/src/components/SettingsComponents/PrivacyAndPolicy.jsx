import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-12 lg:px-16 font-nunito">
      {/* Header Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-indigo-600 sm:text-4xl md:text-5xl">Privacy Policy</h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-4">Your privacy is important to us</p>
      </div>

      {/* Main Content Section */}
      <div className="max-w-full w-full text-base sm:text-lg  text-gray-800">
        <p className="leading-relaxed mb-8">
          We take your privacy seriously. This Privacy Policy outlines how we collect, use, and safeguard your personal
          information. By using our services, you agree to the terms outlined in this policy.
        </p>

        <p className="leading-relaxed mb-8">
          We collect various types of personal information to provide you with an enhanced experience. This includes:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-8">
          <li>Personal information such as name, email, phone number, etc.</li>
          <li>Transaction data like payment information and order details.</li>
          <li>Usage data such as IP addresses, browser type, and device details.</li>
          <li>Location data (if enabled) to provide location-based services.</li>
        </ul>

        <p className="leading-relaxed mb-8">
          We use your personal information to enhance your experience with our services. This includes:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-8">
          <li>To personalize your experience on our platform.</li>
          <li>To process transactions and manage your account.</li>
          <li>To communicate with you, including sending important notices and updates.</li>
          <li>To send you promotional offers (if opted-in).</li>
        </ul>

        <p className="leading-relaxed mb-8">
          We implement industry-standard security measures to protect your personal information. However, no method of
          transmission over the internet is 100% secure. We strive to protect your data but cannot guarantee absolute security.
        </p>

        <p className="leading-relaxed mb-8">
          We use cookies to improve your experience on our website. Cookies help us remember your preferences and analyze
          site traffic. You can manage cookies through your browser settings.
        </p>

        <p className="leading-relaxed mb-8">
          We may share your information with trusted third-party services to perform necessary tasks, such as payment
          processing or marketing campaigns. These parties are bound to handle your data securely and only for the intended
          purposes.
        </p>

        <p className="leading-relaxed mb-8">
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, or
          as required by law. After that, we securely dispose of or anonymize your data.
        </p>

        <p className="leading-relaxed mb-8">
          You have the right to access, update, or delete your personal data. You also have the right to:
        </p>
        <ul className="list-disc pl-6 mt-2 mb-8">
          <li>Request a copy of your data in a structured, commonly used format.</li>
          <li>Withdraw your consent for processing your data (when applicable).</li>
          <li>Opt-out of marketing communications at any time.</li>
        </ul>

        <p className="leading-relaxed mb-8">
          We may update this Privacy Policy from time to time. All changes will be posted on this page with an updated
          date. Please review this policy periodically to stay informed.
        </p>

        <p className="leading-relaxed mb-8">
          If you have any questions or concerns about this policy, please contact us at:
        </p>
        <ul className="mt-2">
          <li><strong>Email:</strong> <a href="mailto:expensetracker1908@gmail.com" className="text-indigo-600 hover:underline">expensetracker1908@gmail.com</a></li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
