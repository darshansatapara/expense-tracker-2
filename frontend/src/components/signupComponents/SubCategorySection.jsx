import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { CategorySelectorButton } from "./CategorySelectorButton.jsx"; // Import the CategorySelectorButton
import SignupLeft from "./SignUpInContent/Signup_Left.jsx";

export default function SubcategorySection() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCategories, userData } = location.state || {};
  const [selectedSubcategories, setSelectedSubcategories] = useState({});
  const [fetchError, setFetchError] = useState(false);
  const { adminCategories, isLoadingCategories, fetchAdminCategories } =
    adminCategoryStore();

  // Fetch categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAdminCategories();
        setFetchError(false); // Reset error on successful fetch
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setFetchError(true);
      }
    };

    fetchData();
  }, [fetchAdminCategories]);

  // Handle next button click
  const handleNext = () => {
    if (
      Object.values(selectedSubcategories).every((subcat) => subcat.length > 0)
    ) {
      navigate("/budget&currency", {
        state: { selectedSubcategories, userData },
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between lg:justify-around h-screen bg-[#D9EAFD]">
      {/* Left section */}
      <div className="hidden lg:flex flex-col items-center px-10 lg:px-20 justify-center">
        <SignupLeft />
      </div>

      {/* Right section */}
      <div className="flex flex-1 items-center justify-center font-nunito px-4 lg:px-8">
        <div className="p-6 lg:p-8 w-full max-w-lg bg-white shadow-md rounded-lg">
          <div className="text-2xl mb-6 font-bold text-gray-800 text-center lg:text-left">
            Select Subcategories for Your Categories
          </div>

          {/* Category Selector */}
          {selectedCategories?.map((category, index) => {
            const categoryData = adminCategories?.find(
              (categoryItem) => categoryItem?.name === "Expense Categories"
            );
            const categorySubcategories =
              categoryData?.categories[category] || [];

            return (
              <div key={index} className="mb-6">
                {/* Main Category */}
                <div className="font-bold text-lg mb-4">{category}</div>

                {/* Subcategories for selected category */}
                <div className="relative mb-5 h-80 max-h-80 overflow-y-auto border rounded-lg p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {categorySubcategories?.map((subCategory, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => {
                          setSelectedSubcategories((prev) => ({
                            ...prev,
                            [category]: prev[category]?.includes(subCategory)
                              ? prev[category].filter(
                                  (item) => item !== subCategory
                                )
                              : [...(prev[category] || []), subCategory],
                          }));
                        }}
                        className={`px-4 py-2 rounded-full border ${
                          selectedSubcategories[category]?.includes(subCategory)
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-white text-gray-800"
                        } hover:bg-purple-200`}
                      >
                        {subCategory}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={Object.values(selectedSubcategories).some(
              (subcats) => subcats.length === 0
            )}
            className={`w-full mt-6 py-2 rounded-md font-semibold transition-colors ${
              Object.values(selectedSubcategories).every(
                (subcats) => subcats.length > 0
              )
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
