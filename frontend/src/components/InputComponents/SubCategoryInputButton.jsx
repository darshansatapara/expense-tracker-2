import React, { useState } from "react";
import { Plus, X } from "lucide-react";

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

      // If the category doesn't exist in finalCategory, initialize it as an empty array
      if (!updatedCategories[category]) {
        updatedCategories[category] = [];
      }

      // Check if the subcategory is already selected
      if (updatedCategories[category].includes(subcategory)) {
        // Remove the subcategory
        updatedCategories[category] = updatedCategories[category].filter(
          (item) => item !== subcategory
        );
      } else {
        // Add the subcategory
        updatedCategories[category].push(subcategory);
      }

      // If no subcategories remain, remove the category key entirely
      if (updatedCategories[category].length === 0) {
        delete updatedCategories[category];
      }

      return updatedCategories;
    });

    // Update the temporary selected subcategories for styling
    setSelectedSubCategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
  };

  return (
    <div className="mb-4">
      <div className="text-xl font-semibold mb-2">{category}</div>
      <div className="flex flex-wrap gap-2">
        {subCategories.map((subCategory) => (
          <button
            key={subCategory._id || subCategory} // Ensure each button has a unique key
            onClick={() =>
              handleSubCategorySelection(subCategory.name || subCategory)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedSubCategories.includes(subCategory.name || subCategory)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-white text-gray-800"
            } hover:bg-purple-200`}
          >
            <span>{subCategory.name || subCategory}</span>
            {selectedSubCategories.includes(subCategory.name || subCategory) ? (
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
