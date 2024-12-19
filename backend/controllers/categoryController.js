import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";

// Create categories for a user by email
export const createCategory = async (req, res) => {
  try {
    const { categoriesData } = req.body;
    const userId = req.params.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Transform categoriesData to match the schema
    const transformedCategoriesData = Object.keys(categoriesData).reduce(
      (acc, category) => {
        acc[category] = { subcategories: categoriesData[category] };
        return acc;
      },
      {}
    );

    const category = new Category({
      userId: user._id,
      categories: transformedCategoriesData,
    });

    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error saving category:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get categories by user's ID
export const getCategoriesById = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findOne({ _id: userId }); // Fixed: Find user by _id
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const categories = await Category.findOne({ userId: user._id });
    if (!categories) {
      return res
        .status(404)
        .json({ error: "No categories found for this user" });
    }

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a category or a subcategory by user ID, category ID, and optional subcategory name
export const deleteCategoryOrSubcategory = async (req, res) => {
  const { userId, categoryId } = req.params;
  const { subcategory } = req.body; // Subcategory name if provided

  try {
    // Check if the user exists
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the category
    const category = await Category.findOne({
      _id: categoryId,
      userId: user._id, // Ensure the category belongs to the user
    });

    if (!category) {
      return res.status(404).json({
        error: "Category not found or does not belong to this user",
      });
    }

    // If subcategory is provided, delete only that subcategory
    if (subcategory) {
      const categoryIndex = category.categories.findIndex(
        (cat) => cat._id.toString() === categoryId
      );

      if (categoryIndex === -1) {
        return res.status(404).json({
          error: "Category not found or does not belong to this user",
        });
      }

      const subcategoryIndex =
        category.categories[categoryIndex].subcategories.indexOf(subcategory);

      if (subcategoryIndex === -1) {
        return res.status(404).json({
          error: "Subcategory not found in this category",
        });
      }

      // Delete the subcategory
      category.categories[categoryIndex].subcategories.splice(
        subcategoryIndex,
        1
      );

      await category.save();
      return res
        .status(200)
        .json({ message: "Subcategory deleted successfully" });
    }

    // If no subcategory is provided, delete the entire category with its subcategories
    const updatedCategories = category.categories.filter(
      (cat) => cat._id.toString() !== categoryId
    );

    if (updatedCategories.length === category.categories.length) {
      return res.status(404).json({
        error: "Category not found or does not belong to this user",
      });
    }

    category.categories = updatedCategories;
    await category.save();

    res
      .status(200)
      .json({ message: "Category and its subcategories deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
