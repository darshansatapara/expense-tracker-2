import Category from "../models/categoryModel.js";
import User from "../models/userModel.js";

// Create categories for a user by email
export const createCategory = async (req, res) => {
  try {
    const { categoriesData } = req.body;
    const email = req.params.email;

    const user = await User.findOne({ email });
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

// Get categories by user's email
export const getCategoriesByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const user = await User.findOne({ email });
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

// Get categories by user's ID
export const getCategoriesById = async (req, res) => {
  try {
    const userId = req.params.userId;

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
