import AdminCategoryDataModel from "../../models/AdminModel/AdminCategoryDataModel.js";

// Fetch all admin categories
export const getAdminCategories = async (req, res) => {
  try {
    const categories = await AdminCategoryDataModel.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

// Add or update a category
export const postAdminCategory = async (req, res) => {
  const { name, categories } = req.body;

  try {
    // Check if a category with the same name exists
    let category = await AdminCategoryDataModel.findOne({ name });
    if (category) {
      res
        .status(400)
        .json({ message: "Category with this name already exists" });
      return;
    }

    // Avoid duplicate values in categories
    const uniqueCategories = {};
    for (const [key, values] of Object.entries(categories)) {
      uniqueCategories[key] = Array.from(new Set(values));
    }

    category = new AdminCategoryDataModel({
      name,
      categories: uniqueCategories,
    });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error("Error saving category:", error);
    res.status(500).json({ message: "Failed to save category" });
  }
};

// Update a specific category by name
export const updateAdminCategory = async (req, res) => {
  const { name } = req.params;
  const { categories } = req.body;

  try {
    const category = await AdminCategoryDataModel.findOne({ name });
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    // Merge existing and incoming categories, avoiding duplicates
    const mergedCategories = { ...category.categories.toObject() };
    for (const [key, values] of Object.entries(categories)) {
      if (!mergedCategories[key]) {
        mergedCategories[key] = [];
      }
      mergedCategories[key] = Array.from(
        new Set([...mergedCategories[key], ...values])
      );
    }

    category.categories = mergedCategories;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// Delete a specific category by name
export const deleteAdminCategory = async (req, res) => {
  const { name } = req.params;

  try {
    const deletedCategory = await AdminCategoryDataModel.findOneAndDelete({
      name,
    });

    if (!deletedCategory) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
