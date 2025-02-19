  import React from "react";
  import { motion } from "framer-motion";

  const ContactUs = () => {
    return (
      <div
        className="min-h-screen flex flex-col md:flex-row items-center justify-center px-10 py-12 space-x-20 font-nunito"
        style={{
          background: "linear-gradient(135deg, #edf2f4, #457b9d, #1d3557)",
        }}
      >
        {/* Left Side Image */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-full md:w-1/2 lg:w-2/5 overflow-hidden"
        >
          <img
            src="/images/image.jpeg" // Update the path if needed
            alt="Contact Illustration"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Right Side Content Section */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col gap-8"> {/* Increased gap */}
          {/* Upper Content Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#f1faee] p-8 rounded-lg shadow-2xl"
          >
            <h3 className="text-3xl font-semibold text-[#1d3557] mb-4 text-center">
              Contact Information
            </h3>
            <p className="text-[#1d3557] mb-6 text-center">
              If you have any questions, suggestions, or need assistance with using
              Expense Tracker, we’re here to help! Our team is dedicated to ensuring
              you have the best experience while managing your finances. Whether
              you're having trouble with a feature or simply want to share feedback,
              don’t hesitate to get in touch with us. We promise to respond as
              quickly as possible, usually within 24-48 hours. We value your input
              and look forward to hearing from you to make Expense Tracker even
              better for everyone.
            </p>
          </motion.div>

          {/* Lower Email Box Section */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#1d3557] p-6 rounded-lg shadow-2xl"
          >
            <div className="text-center">
              <p className="text-white font-semibold mb-4">
                ✉️ Email: expensetracker1908@gmail.com
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="mailto:expensetracker1908@gmail.com"
                className="inline-block bg-[#f1faee] hover:bg-[#457b9d] text-[#1d3557] font-semibold py-2 px-6 rounded-full transition-all"
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
