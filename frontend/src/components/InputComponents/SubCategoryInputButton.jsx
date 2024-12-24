import React, { useState } from "react";
import { Plus, X } from "lucide-react";

// SubCategoryInputButton Component
export const SubCategoryInputButton = ({
  category,
  subCategories,
  finalCategory,
  setFinalCategory,
}) => {
  // Temporary state to track selected subcategories for color change
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  const handleSubCategorySelection = (subcategory) => {
    setFinalCategory((prev) => {
      const updatedCategories = { ...prev };

      // If category is not yet in the finalCategory, initialize it with an empty array
      if (!updatedCategories[category]) {
        updatedCategories[category] = [];
        console.log(
          "// If category is not yet in the finalCategory, initialize it with an empty array",
          updatedCategories
        );
      }

      // Check if the subcategory already exists by comparing its value
      const isSubcategoryExists = updatedCategories[category].some(
        (existingSubcategory) => existingSubcategory === subcategory
      );
      console.log(
        "// Check if the subcategory already exists by comparing its value",
        isSubcategoryExists
      );
      if (isSubcategoryExists) {
        // Remove subcategory if it already exists
        updatedCategories[category] = updatedCategories[category].filter(
          (item) => item !== subcategory
        );
        console.log(
          "// Remove subcategory if it already exists",
          updatedCategories
        );
      } else {
        // Add subcategory if it does not exist
        updatedCategories[category].push(subcategory);
        console.log(
          "// Add subcategory to the category array if it's not already there",
          updatedCategories
        );
      }

      return updatedCategories;
    });

    // Update the temporary selected subcategories for color styling
    setSelectedSubCategories((prev) => {
      if (prev.includes(subcategory)) {
        return prev.filter((item) => item !== subcategory);
      } else {
        return [...prev, subcategory];
      }
    });
  };

  return (
    <div className="mb-4">
      <div className="text-xl font-semibold mb-2">{category}</div>
      <div className="flex flex-wrap gap-2">
        {subCategories.map((subCategory) => (
          <button
            key={subCategory}
            onClick={() => handleSubCategorySelection(subCategory)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedSubCategories.includes(subCategory)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-white text-gray-800"
            } hover:bg-purple-200`}
          >
            <span>{subCategory}</span>
            {selectedSubCategories.includes(subCategory) ? (
              <X className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
