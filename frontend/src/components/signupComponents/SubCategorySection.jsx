import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SubCategoryInputButton } from "../InputComponents/SubCategoryInputButton"; // Import the new input button component

export default function SubCategorySection() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCategories, userData } = location.state || {};

  const [finalCategory, setFinalCategory] = useState({});

  useEffect(() => {
    console.log("finalCategory", finalCategory);
  }, [finalCategory]);

  // Handle next button click
  const handleNext = () => {
    if (Object.keys(finalCategory).length > 0) {
      console.log(
        "Final selected categories and subcategories:",
        finalCategory
      );
      navigate("/nextPage", {
        state: { finalCategory, userData },
      });
    } else {
      alert("Please select at least one subcategory.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      {/* Left section */}
      <div className="hidden lg:block px-20 justify-center items-center">
        <div>Signup Left Component</div>
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-8">
        <div className="p-6 lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg">
          <div className="text-2xl mb-6 font-bold text-gray-800 text-center lg:text-left">
            Choose Your Subcategories
          </div>

          {/* Iterate over the selected categories and render SubCategoryInputButton */}
          {Object.keys(selectedCategories).map((category) => (
            <SubCategoryInputButton
              key={category}
              category={category}
              subCategories={selectedCategories[category]} // Pass subcategories for each category
              finalCategory={finalCategory}
              setFinalCategory={setFinalCategory}
            />
          ))}

          {/* Next Button */}
          <div className="mt-6">
            <button
              onClick={handleNext}
              disabled={Object.keys(finalCategory).length === 0}
              className={`w-full py-2 rounded-md font-semibold transition-colors ${
                Object.keys(finalCategory).length > 0
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
