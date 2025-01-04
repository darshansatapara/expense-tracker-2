import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export const SubCategoryInputButton = ({
  categoryId,
  categoryName,
  subCategories,
  finalCategory,
  setFinalCategory,
}) => {
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);

  useEffect(() => {
    // Initialize the selected subcategories from finalCategory without triggering unnecessary updates
    if (finalCategory[categoryId]) {
      setSelectedSubCategories(finalCategory[categoryId]);
    }
  }, [categoryId, finalCategory]);

  // Handle subcategory selection and toggle its state
  const handleSubCategorySelection = (subcategory) => {
    setSelectedSubCategories((prev) => {
      const isSelected = prev.includes(subcategory);
      const updatedSelected = isSelected
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory];

      // Update finalCategory only after local state change
      setFinalCategory((prevFinalCategory) => {
        const updatedCategories = { ...prevFinalCategory };
        updatedCategories[categoryId] = updatedSelected;

        // If no subcategories are selected, remove the category from finalCategory
        if (updatedCategories[categoryId].length === 0) {
          delete updatedCategories[categoryId];
        }

        return updatedCategories;
      });

      return updatedSelected;
    });
  };

  return (
    <div className="mb-4">
      <div className="text-xl font-semibold mb-2">{categoryName}</div>
      <div className="flex flex-wrap gap-2">
        {subCategories.map((subCategory) => (
          <button
            key={`subcategory-${subCategory._id || subCategory}`}
            onClick={() =>
              handleSubCategorySelection(subCategory._id || subCategory)
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedSubCategories.includes(subCategory._id || subCategory)
                ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "bg-white text-gray-800"
            } hover:bg-purple-200`}
          >
            <span>{subCategory.name || subCategory}</span>
            {selectedSubCategories.includes(subCategory._id || subCategory) ? (
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
