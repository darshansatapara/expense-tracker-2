import React from 'react';
import SlidingContent from '../Signup/Slidingcontent'; // Adjust path if necessary
import signup from '../images/Signupimg.jpeg'; // Image import

const Signup = () => {
  return (
    <div className="flex min-h-screen bg-[#F0DBDB]">
      {/* Left Section - Now occupies the full screen */}
      <div className="flex flex-col w-full p-8">
        {/* Upper part: Image */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <img
            src={signup}
            alt="Signup Image"
            className="w-full max-w-2xl h-[500px] rounded-lg shadow-lg"
          />
        </div>

        {/* Lower part: Sliding Content */}
        <div className="flex-1 flex items-center justify-center mt-6">
          <SlidingContent />
        </div>
      </div>
    </div>
  );
};

export default Signup;
