import React from "react";
import { motion } from "framer-motion";

const ContactUs = () => {
  return (
    <div className="min-h-screen flex flex-col  items-center justify-center px-6 font-nunito">
      {/* Header Section */}
      <div className="text-center mb-12 w-full max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-[#ff6f61] drop-shadow-lg">
          Get in Touch!
        </h1>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          If you have any questions, suggestions, or need assistance with using
          Expense Tracker, we’re here to help! Our team is dedicated to ensuring
          you have the best experience while managing your finances. Whether
          you're having trouble with a feature or simply want to share feedback,
          don’t hesitate to get in touch with us. We promise to respond as
          quickly as possible, usually within 24-48 hours. We value your input
          and look forward to hearing from you to make Expense Tracker even
          better for everyone.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-wrap justify-center items-center gap-8 w-full max-w-6xl ">
        {/* Left Side Image */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 lg:w-2/5"
        >
          <img
            src="/images/imgeee.png" // Ensure the image path is correct
            alt="Contact Illustration"
            className="w-full rounded-lg shadow-lg"
          />
        </motion.div>

        {/* Right Side Contact Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-1/2 lg:w-2/5 bg-[#E8DFF7] p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-2xl font-semibold text-[#ff6f61] mb-4 text-center font-nunito">
            Contact Information
          </h3>
          <p className="text-gray-700 mb-6 text-center">
            Have any questions? We'd love to hear from you!
          </p>
          <div className="text-center">
            <p className="font-bold text-black mb-4 font-nunito">
              ✉️ Email: expensetracker1908@gmail.com
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:expensetracker1908@gmail.com"
              className="inline-block bg-[#ff6f61] hover:bg-[#e35d4b] text-white font-semibold py-2 px-6 rounded-full transition-all"
            >
              Email Us
            </motion.a>
          </div>
        </motion.div>
      </div>


    </div>
  );
};

export default ContactUs;
