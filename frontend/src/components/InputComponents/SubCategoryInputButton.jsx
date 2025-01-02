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
    // Initialize the selected subcategories from finalCategory if available
    setSelectedSubCategories(finalCategory[categoryId] || []);
  }, [categoryId, finalCategory]);

  // Handle subcategory selection and toggle its state
  const handleSubCategorySelection = (subcategory) => {
    setSelectedSubCategories((prev) => {
      const newSelected = prev.includes(subcategory)
        ? prev.filter((item) => item !== subcategory)
        : [...prev, subcategory];

      // Update finalCategory after modifying local selected state
      setFinalCategory((prevFinalCategory) => {
        const updatedCategories = { ...prevFinalCategory };

        if (!updatedCategories[categoryId]) {
          updatedCategories[categoryId] = [];
        }

        if (newSelected.includes(subcategory)) {
          updatedCategories[categoryId] = [...newSelected];
        } else {
          updatedCategories[categoryId] = newSelected.filter(
            (item) => item !== subcategory
          );
        }

        // If there are no selected subcategories for this category, delete it from finalCategory
        if (updatedCategories[categoryId].length === 0) {
          delete updatedCategories[categoryId];
        }

        return updatedCategories;
      });

      return newSelected;
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
