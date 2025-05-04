import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SubCategoryInputButton } from "../InputComponents/SubCategoryInputButton";
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { userStore } from "../../store/UserStore/userAuthStore.js";

export default function SubCategorySection() {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract data passed from the previous step
  const { payload, userId, categoriesObject } = location.state || {};
  const { markCategoryAsCompleted } = userStore();

  // Extract expenseCategories from the payload
  const expenseCategories = payload?.expenseCategories || [];

  // Initialize state
  const [finalCategory, setFinalCategory] = useState({});
  const addExpenseCategory = userCategoryStore(
    (state) => state.addExpenseCategory
  );

  // Extract selected categories and their subcategories
  const selectedCategoriesWithSubcategories = expenseCategories.map(
    (category) => {
      const categoryData = categoriesObject?.[category.categoryId];
      return {
        categoryId: category.categoryId,
        categoryName: categoryData?.name || "Unknown Category",
        subcategories: categoryData?.subcategories || [],
      };
    }
  );


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

  // Validation: Check if at least two subcategories are selected for each category
  const validateSubCategorySelection = () => {
    return selectedCategoriesWithSubcategories.every(
      (category) => finalCategory[category.categoryId]?.length >= 2
    );
  };

  console.log(
    "Validation:",
    selectedCategoriesWithSubcategories.map((category) => ({
      categoryId: category.categoryId,
      selectedSubcategories: finalCategory[category.categoryId],
    }))
  );

  // Handle the next button click
  const handleNext = async () => {
    if (validateSubCategorySelection()) {
      try {
        const categoryData = transformCategoryData();
        console.log("Posting Data to Backend:", categoryData);

        await addExpenseCategory({
          userId: userId,
          expenseCategories: categoryData,
        });


        console.log(userId);
        await markCategoryAsCompleted(userId);

        await navigate("/category/currencyBudgetSelection", {
          state: { userId },
        });
      } catch (error) {
        console.error("Error Posting Data:", error);
      }
    } else {
      alert("Please select at least two subcategories for each category.");
    }
  };

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
            {selectedCategoriesWithSubcategories.length > 0 ? (
              selectedCategoriesWithSubcategories.map((category) => (
                <SubCategoryInputButton
                  key={`category-${category.categoryId}`}
                  categoryId={category.categoryId}
                  categoryName={category.categoryName}
                  subCategories={category.subcategories}
                  finalCategory={finalCategory}
                  setFinalCategory={setFinalCategory}
                />
              ))
            ) : (
              <div className="text-center text-gray-500">
                No categories available. Please go back and select categories.
              </div>
            )}
          </div>

          <div className="mb-6">
            {/* Note Section */}
            <div className="p-1 bg-[#edf2f7] border-l-4 border-[#a0aec0] text-black-800 rounded-md shadow-sm">
              <p className="font-medium">
                <span className="font-semibold">Note:</span> You must select at
                least 2 Subcategories of each Category to proceed.
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="mt-6">
            <button
              onClick={handleNext}
              disabled={!validateSubCategorySelection()}
              className={`w-full py-2 rounded-md font-semibold transition-colors ${validateSubCategorySelection()
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
