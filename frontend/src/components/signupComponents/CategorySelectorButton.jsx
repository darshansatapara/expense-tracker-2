import React from "react";
import { Plus, X } from "lucide-react";

export const CategorySelectorButton = ({
  categories,
  selectedCategories,
  setSelectedCategories,
}) => {
  // Handle category selection or deselection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      // Remove the category if it's already selected
      setSelectedCategories((prev) =>
        prev.filter((selected) => selected !== category)
      );
    } else {
      // Add the category if it's not selected
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {Object.keys(categories).map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
            selectedCategories.includes(category)
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              : "bg-white text-gray-800"
          } hover:bg-purple-200`}
        >
          <span>{category}</span>
          {selectedCategories.includes(category) ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
};
