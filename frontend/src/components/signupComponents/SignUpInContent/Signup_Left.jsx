import React from "react";
import SlidingContent from "./Slidingcontent"; // Adjust path if necessary
import signupImg from "/images/Signupimg.jpeg"; // Image import

const SignupLeft = () => {
  return (
    <div className=" w-full flex h-screen justify-center items-center">
      {/* Left Section - Now occupies the full screen */}
      <div className="flex flex-col w-full p-8">
        {/* Upper part: Image */}
        <div className="flex-1 flex items-center justify-center mb-4 ">
          <img
            src={signupImg}
            alt="Signup Image"
            className="w-full max-w-2xl h-[300px] rounded-lg shadow-lg "
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

export default SignupLeft;
