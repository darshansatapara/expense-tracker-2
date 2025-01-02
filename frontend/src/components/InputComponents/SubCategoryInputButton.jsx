// SubCategoryInputButton.jsx
import React, { useState } from "react";
import { Plus, X } from "lucide-react";

export const SubCategoryInputButton = ({
  categoryId,
  categoryName,
  subCategories,
  finalCategory,
  setFinalCategory,
}) => {
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  console.log(subCategories);
  // Handle subcategory selection and toggle its state
  const handleSubCategorySelection = (subcategory) => {
    setFinalCategory((prev) => {
      const updatedCategories = { ...prev };

      if (!updatedCategories[categoryId]) {
        updatedCategories[categoryId] = [];
      }

      if (updatedCategories[categoryId].includes(subcategory)) {
        updatedCategories[categoryId] = updatedCategories[categoryId].filter(
          (item) => item !== subcategory
        );
      } else {
        updatedCategories[categoryId].push(subcategory);
      }

      if (updatedCategories[categoryId].length === 0) {
        delete updatedCategories[categoryId];
      }

      return updatedCategories;
    });

    setSelectedSubCategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory]
    );
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
