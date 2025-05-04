import { Plus, X } from "lucide-react";
import { useState } from "react";

export const CategorySelectorButton = ({
  categories, // Categories object { id: { name, subcategories } }
  setSelectedCategoryIds, // Function to update selected category IDs
}) => {
  const [selectedCategories, setSelectedCategories] = useState([]); // Track selected IDs locally

  // console.log(categories);
  // Toggle category selection
  const toggleCategory = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);

    const updatedSelectedCategories = isSelected
      ? selectedCategories.filter((id) => id !== categoryId) // Remove if already selected
      : [...selectedCategories, categoryId]; // Add if not selected

    setSelectedCategories(updatedSelectedCategories);
    setSelectedCategoryIds(updatedSelectedCategories); // Update parent state with IDs
  };

  // Utility function to get color styles
  const getCategoryColor = (categoryId) =>
    selectedCategories.includes(categoryId)
      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      : "bg-white text-gray-800";

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {Object.entries(categories).map(([categoryId, categoryData]) => (
        <button
          key={categoryId}
          onClick={() => toggleCategory(categoryId)} // Toggle based on ID
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${getCategoryColor(
            categoryId
          )} hover:bg-purple-200`}
        >
          <span>{categoryData.name}</span> {/* Display name */}
          {selectedCategories.includes(categoryId) ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
};
