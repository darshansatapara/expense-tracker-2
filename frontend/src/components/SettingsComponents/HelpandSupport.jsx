import React, { useState } from "react";
import { Link } from "react-router-dom";

const HelpAndSupport = () => {
  const [openQuestion, setOpenQuestion] = useState(null);
  const [feedback, setFeedback] = useState("");

  // Toggle FAQ dropdown
  const handleDropdownClick = (index) => {
    setOpenQuestion(openQuestion === index ? null : index); // Toggle specific question
  };

  // Handle feedback change
  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  // Handle feedback submission
  const handleSubmitFeedback = () => {
    alert("Feedback submitted!");
  };

  const faqList = [
    {
      question: "How do I reset my password?",
      answer:
        "To reset your password, click on the 'Forgot Password' link on the login page, and follow the instructions sent to your email.",
    },
    {
      question: "How do I add a new expense?",
      answer:
        "To add a new expense, click on the 'Add Expense' button on the homepage, and fill in the necessary details.",
    },
    {
      question: "Can I track my expenses by category?",
      answer:
        "Yes, you can categorize your expenses when adding them, making it easier to track and analyze.",
    },
    {
      question: "How do I view my expense history?",
      answer:
        "You can view your expense history by going to the 'History' tab on the dashboard.",
    },
    {
      question: "How can I update my profile information?",
      answer:
        "To update your profile, go to the 'Settings' page and update your personal details there.",
    },
    {
      question: "Can I delete an expense?",
      answer:
        "Yes, you can delete an expense by going to the 'History' page and clicking the 'Delete' button next to the expense you want to remove.",
    },
    {
      question: "Is my data secure on this platform?",
      answer:
        "Yes, we prioritize your data security by using encryption and secure authentication methods.",
    },
    {
      question: "Can I export my expense data?",
      answer:
        "Yes, you can export your expense data by navigating to the 'Settings' page and selecting the 'Export Data' option.",
    },
    {
      question: "How do I contact customer support?",
      answer: (
        <span>
          You can contact customer support by clicking on the{" "}
          <Link to="/settings/contact-us" className="text-blue-600 underline hover:text-blue-800">
            Contact Us
          </Link>{" "}
        </span>
      ),
    },
    {
      question: "Can I share my account with others?",
      answer:
        "No, sharing your account with others is not recommended for security reasons. Each user should have their own account.",
    },
    {
      question: "What features are available on the Analysis page?",
      answer:
        "The Analysis page provides detailed visual insights into your expenses, including spending trends, category-wise breakdowns, and comparisons over different time periods.",
    },
    {
      question: "How can I view my transaction history?",
      answer:
        "You can view your transaction history by going to the 'History' page, where all your past expenses are listed with options to filter and search.",
    },
    {
      question: "What happens if I forget my login credentials?",
      answer:
        "If you forget your login credentials, use the 'Forgot Password' link to reset your password, or contact support for assistance.",
    },
    {
      question: "How can I manage categories and subcategories?",
      answer:
        "To manage categories and subcategories, go to the 'Settings' page, then navigate to the 'Category and Subcategory Management' option, where you can add or remove categories and subcategories as needed.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-16 lg:px-32">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 font-nunito">Help & Support</h1>
        <p className="text-gray-600 mt-2 text-lg font-nunito">We're here to help you</p>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 text-left mb-6 font-nunito">
          Frequently Asked Questions
        </h2>

        {/* Responsive Grid */}
        <div className="space-y-5 sm:grid-cols-2 gap-6 lg:gap-8 font-nunito">
          {faqList.map((item, index) => (
            <div
              key={index}
              className="bg-[#E5E1DA] p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 "
            >
              <button
                onClick={() => handleDropdownClick(index)}
                className="w-full text-left font-medium text-lg flex justify-between items-center"
              >
                <span>{item.question}</span>
                <span
                  className={`transform transition-transform duration-300 ${
                    openQuestion === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openQuestion === index ? "max-h-[500px]" : "max-h-0"
                }`}
              >
                <div className="mt-4 text-gray-700">{item.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-10 border-gray-300" />

      <div className="text-left mb-6">
        <h2 className="text-3xl font-semibold font-nunito text-gray-700">Send us your feedback</h2>
        <p className="text-gray-600 mt-2 font-nunito">
          Your feedback helps us improve your experience
        </p>
      </div>

      <div className="p-8 rounded-lg shadow-lg space-y-6">
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          className="w-full p-4 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Write your feedback here..."
          rows="5"
        />
        <div className="flex justify-center">
          <button
            onClick={handleSubmitFeedback}
            className={`px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 ${
              !feedback ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!feedback}
          >
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
