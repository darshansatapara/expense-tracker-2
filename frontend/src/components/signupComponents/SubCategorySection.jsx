// SubCategorySection.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SubCategoryInputButton } from "../InputComponents/SubCategoryInputButton";
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";
import { userCategoryStore } from "../../store/userCategoryStore.js";

export default function SubCategorySection() {
  const location = useLocation();
  const navigate = useNavigate();

  const { selectedCategoryIds, userData } = location.state || {};
  const selectedCategories = selectedCategoryIds;
  console.log(selectedCategories);

  const [finalCategory, setFinalCategory] = useState({});
  const addExpenseCategory = userCategoryStore(
    (state) => state.addExpenseCategory
  );

  // Log final category state for debugging
  useEffect(() => {
    console.log("Final Category State:", finalCategory);
  }, [finalCategory]);

  // Transform the finalCategory object into the required format for backend
  const transformCategoryData = () =>
    Object.entries(finalCategory).map(([categoryId, subCategories]) => {
      const subcategoryIds = subCategories.map(
        (subCategory) => subCategory._id || subCategory
      );
      return {
        categoryId,
        subcategoryIds,
      };
    });

  // Handle the next button click
  const handleNext = async () => {
    if (Object.keys(finalCategory).length > 0) {
      try {
        const categoryData = transformCategoryData();
        console.log("Posting Data to Backend:", categoryData);

        await addExpenseCategory({
          userId: userData?.userId,
          expenseCategories: categoryData,
        });

        navigate("/category/currencyBudgetSelection", {
          state: { finalCategory, userData },
        });
      } catch (error) {
        console.error("Error Posting Data:", error);
      }
    } else {
      alert("Please select at least one subcategory.");
    }
  };

  const validSelectedCategories =
    selectedCategories && typeof selectedCategories === "object"
      ? selectedCategories
      : {};

  console.log("Valid Categories:", validSelectedCategories);
  return (
    <div className="flex flex-col lg:flex-row justify-around h-screen bg-[#D9EAFD]">
      {/* Left section */}
      <div className="hidden lg:block px-20 justify-center items-center">
        <SignupLeft />
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-8">
        <div className="p-6 lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg">
          <div className="text-2xl mb-6 font-bold text-gray-800 text-center lg:text-left">
            Choose Your Subcategories
          </div>

          {/* Category and Subcategory Selector */}
          <div className="relative mb-5 h-80 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {Object.keys(validSelectedCategories).length > 0 ? (
              Object.entries(validSelectedCategories).map(
                ([categoryId, { name, subcategories }]) => (
                  <SubCategoryInputButton
                    key={`category-${categoryId}`}
                    categoryId={categoryId}
                    categoryName={name}
                    subCategories={subcategories}
                    finalCategory={finalCategory}
                    setFinalCategory={setFinalCategory}
                  />
                )
              )
            ) : (
              <div className="text-center text-gray-500">
                No categories available. Please go back and select categories.
              </div>
            )}
          </div>

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
