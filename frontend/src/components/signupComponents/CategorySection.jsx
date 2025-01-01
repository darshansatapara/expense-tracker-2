import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { CategorySelectorButton } from "../InputComponents/CategorySelectionButton.jsx";
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";

export default function CategorySection() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, email, profession } = location.state || {};
  const userData = { userId, email, profession };

  const [selectedCategories, setSelectedCategories] = useState({});
  const [fetchError, setFetchError] = useState(false);

  const { expenseCategories, isLoadingCategories, fetchExpenseCategories } =
    adminCategoryStore();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchExpenseCategories();
        setFetchError(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setFetchError(true);
      }
    };

    fetchData();
  }, []);

  console.log("Transformed categories:", expenseCategories);
  // Ensure expenseCategories.categories exists and is an array
  const categoriesObject = Array.isArray(expenseCategories.categories)
    ? expenseCategories.categories.reduce((acc, category) => {
        // Assuming `category.name` is the name and `category.subcategories` is the array
        acc[category.name] = category.subcategories || [];
        return acc;
      }, {})
    : {};

  // Handle next button click
  const handleNext = () => {
    if (Object.keys(selectedCategories).length >= 3) {
      navigate("/category/subCategorySection", {
        state: { selectedCategories, userData },
      });
    } else {
      alert("Please select at least 3 categories.");
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
            What Is Your Daily Life Expense Categories? Choose As You Like...
          </div>

          {/* Category Selector */}
          <div className="relative mb-5 h-80 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
            {!isLoadingCategories && !fetchError && (
              <CategorySelectorButton
                categories={categoriesObject}
                setSelectedCategories={setSelectedCategories}
              />
            )}

            {/* Empty Categories Fallback */}
            {!isLoadingCategories &&
              !fetchError &&
              expenseCategories?.length === 0 && (
                <div className="text-center text-gray-500">
                  No categories available to display.
                </div>
              )}
          </div>

          <div className="mb-6">
            {/* Note Section */}
            <div className="p-1 bg-[#edf2f7] border-l-4 border-[#a0aec0] text-black-800 rounded-md shadow-sm">
              <p className="font-medium">
                <span className="font-semibold">Note:</span> You must select at
                least 3 categories to proceed.
              </p>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={Object.keys(selectedCategories).length < 3}
            className={`w-full mt-6 py-2 rounded-md font-semibold transition-colors ${
              Object.keys(selectedCategories).length >= 3
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
