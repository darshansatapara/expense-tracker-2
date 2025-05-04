import React, { useEffect, useState } from "react";
import { adminCategoryStore } from "../../store/AdminStore/adminCategoryStore.js";
import { userCategoryStore } from "../../store/UserStore/userCategoryStore.js";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { userStore } from "../../store/UserStore/userAuthStore";
const CategoryManagement = () => {
  const { currentUser } = userStore();
  const userId = currentUser?._id;
  const { fetchActiveCategories } = adminCategoryStore();
  const { fetchUserCategories, updateUserCategories } = userCategoryStore();

  const [categoriesToDisplay, setCategoriesToDisplay] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Fetch active categories
  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await fetchActiveCategories();
      setActiveCategories(fetchedCategories?.data?.categories || []);
    };
    fetchCategories();
  }, []);

  // Fetch user categories
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        const fetchedUserCategories = await fetchUserCategories(userId);
        setUserCategories(fetchedUserCategories?.data?.data?.expenseCategories || []);
      }
    };
    fetchUserData();
  }, [userId]);

  // Match categories between active and user categories
  const getMatchedCategories = (activeCategories, userCategories) => {
    const userCategoryIds = new Set(userCategories.map((uc) => uc.categoryId?._id));
    const userSubCategoryIds = new Set(
      userCategories.flatMap((uc) => uc.subcategoryIds?.map((sub) => sub._id) || [])
    );

    return activeCategories.map((category) => {
      const isSelected = userCategoryIds.has(category._id);
      const subcategories = category.subcategories.map((subCat) => ({
        ...subCat,
        selected: isSelected && userSubCategoryIds.has(subCat._id),
      }));

      return { ...category, isSelected, subcategories };
    });
  };

  useEffect(() => {
    if (activeCategories.length && userCategories.length) {
      setCategoriesToDisplay(getMatchedCategories(activeCategories, userCategories));
    }
  }, [activeCategories, userCategories]);

  // Toggle category selection and deselect all subcategories if category is deselected
  const toggleCategorySelection = (categoryId) => {
    setCategoriesToDisplay((prevCategories) =>
      prevCategories.map((category) => {
        if (category._id === categoryId) {
          const newIsSelected = !category.isSelected;
          return {
            ...category,
            isSelected: newIsSelected,
            subcategories: category.subcategories.map((subCat) => ({
              ...subCat,
              selected: newIsSelected ? subCat.selected : false, // Deselect all subcategories if category is deselected
            })),
          };
        }
        return category;
      })
    );
  };

  // Toggle subcategory selection
  const toggleSubCategorySelection = (categoryId, subCategoryId) => {
    setCategoriesToDisplay((prevCategories) =>
      prevCategories.map((category) => {
        if (category._id === categoryId) {
          const updatedSubcategories = category.subcategories.map((subCat) =>
            subCat._id === subCategoryId
              ? { ...subCat, selected: !subCat.selected }
              : subCat
          );

          const anySubcategorySelected = updatedSubcategories.some((subCat) => subCat.selected);

          return {
            ...category,
            subcategories: updatedSubcategories,
            isSelected: anySubcategorySelected, // Automatically update category selection based on subcategories
          };
        }
        return category;
      })
    );
  };

  // Save changes with improved validation
  const saveChanges = async () => {
    setIsSelecting(true);

    // Filter categories that have at least one selected subcategory
    const selectedCategories = categoriesToDisplay.filter((category) =>
      category.subcategories.some((subCat) => subCat.selected)
    );

    // Check if no categories are selected
    if (selectedCategories.length === 0) {
      alert("Please select at least one category with subcategories.");
      setIsSelecting(false);
      return;
    }

    // Validate: Each selected category must have at least 3 subcategories
    const invalidCategories = selectedCategories.filter((category) => {
      const selectedSubcategories = category.subcategories.filter((subCat) => subCat.selected);
      return selectedSubcategories.length < 3;
    });

    if (invalidCategories.length > 0) {
      alert(
        "Each selected category must have at least 3 subcategories selected. Invalid categories: " +
          invalidCategories.map((cat) => cat.name).join(", ")
      );
      setIsSelecting(false);
      return;
    }

    // Prepare data for update (only include selected categories)
    const updatedCategories = selectedCategories.map((category) => ({
      categoryId: category._id,
      subcategoryIds: category.subcategories
        .filter((subCat) => subCat.selected)
        .map((subCat) => subCat._id),
    }));

    

    try {
      const response = await updateUserCategories(userId, updatedCategories);
      

      // Update state to reflect the saved changes
      setCategoriesToDisplay((prevCategories) =>
        prevCategories.map((category) => {
          const matchedCategory = updatedCategories.find(
            (updatedCategory) => updatedCategory.categoryId === category._id
          );
          return {
            ...category,
            isSelected: !!matchedCategory,
            subcategories: category.subcategories.map((subCat) => ({
              ...subCat,
              selected: matchedCategory
                ? matchedCategory.subcategoryIds.includes(subCat._id)
                : false,
            })),
          };
        })
      );
    } catch (error) {
      console.error("Error updating categories:", error);
      alert("Failed to update categories. Please try again.");
    }

    setIsSelecting(false);
  };

  return (
    <div className="flex flex-col gap-6 p-7 m-5 border bg-[#f5f5f5] border-gray-200 rounded-lg">
      {categoriesToDisplay.length > 0 ? (
        categoriesToDisplay.map((category) => (
          <div key={category._id} className="flex flex-col gap-3">
            <button
              className={`px-7 py-3 text-white text-xs font-medium w-fit rounded-full transition-all duration-300 
                        ${category.isSelected
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
                          : "bg-gray-500 hover:bg-gray-400"}`}
              onClick={() => toggleCategorySelection(category._id)}
            >
              {category.name}
              {category.isSelected ? (
                <MinusOutlined className="ml-1 text-xs" />
              ) : (
                <PlusOutlined className="ml-1 text-xs" />
              )}
            </button>

            <div className="grid grid-cols-2 gap-2 mt-2 sm:grid-cols-3 lg:grid-cols-9 w-fit">
              {category.subcategories.map((subCat) => (
                <button
                  key={subCat._id}
                  className={`p-2 text-black text-sm sm:text-sm font-medium rounded-full transition-all duration-300 w-auto truncate
                                ${subCat.selected
                                  ? "bg-gradient-to-r from-blue-400 to-purple-400 hover:from-purple-500 hover:to-blue-500"
                                  : "bg-white hover:bg-gray-100"}`}
                  onClick={() => toggleSubCategorySelection(category._id, subCat._id)}
                >
                  {subCat.name}
                  {subCat.selected ? (
                    <MinusOutlined className="ml-2 text-xs sm:text-sm" />
                  ) : (
                    <PlusOutlined className="ml-2 text-xs sm:text-sm" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p>No categories available.</p>
      )}
      <button
        className={`mt-5 px-6 py-2 text-white font-medium rounded-md transition-all duration-300 self-center ${
          isSelecting ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
        onClick={saveChanges}
        disabled={isSelecting}
      >
        {isSelecting ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default CategoryManagement;