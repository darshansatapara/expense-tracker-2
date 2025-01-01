import { Plus, X } from "lucide-react";
import { useState } from "react";

export const CategorySelectorButton = ({
  categories, // Categories with their subcategories
  setSelectedCategories, // Function to update selected categories
}) => {
  const [tempCategories, selectedTempCategories] = useState([]); // Track only main categories

  // Handle category selection or deselection
  const toggleCategory = (category) => {
    console.log("Category clicked:", category); // Log category clicked

    const isSelected = tempCategories.includes(category); // Check if category is already selected

    // Update tempCategories state first
    selectedTempCategories((prevTemp) =>
      isSelected
        ? prevTemp.filter((item) => item !== category)
        : [...prevTemp, category]
    );

    // Then update selectedCategories using the updated tempCategories
    setSelectedCategories((prev) => {
      const updatedCategories = { ...prev };

      if (isSelected) {
        delete updatedCategories[category]; // Remove the category
      } else {
        updatedCategories[category] = categories[category]; // Add subcategories
      }

      console.log("Updated selectedCategories:", updatedCategories); // Log the updated categories
      return updatedCategories;
    });
  };

  // Utility function to get the color styles based on category selection
  const getCategoryColor = (category) => {
    // If the category is in the selected main categories (tempCategories), apply the selected color style
    if (tempCategories.includes(category)) {
      return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"; // Selected category style
    } else {
      return "bg-white text-gray-800"; // Default unselected style
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {Object.keys(categories).map((category) => (
        <button
          key={category}
          onClick={() => toggleCategory(category)} // Toggle the category
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${getCategoryColor(
            category
          )} hover:bg-purple-200`}
        >
          <span>{category}</span>
          {tempCategories.includes(category) ? (
            <X className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      ))}
    </div>
  );
};
