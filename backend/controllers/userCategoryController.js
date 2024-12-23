import UserCategoryModel from "../models/UserCategoryModel.js";

// Create or update user categories
export const postUserCategories = async (req, res) => {
  const { userId, expenseCategory, incomeCategory, budget, currencyCategory } =
    req.body;

  try {
    // Find user category by userId (if it exists) or create a new one
    let userCategory = await UserCategoryModel.findOne({ userId });

    if (userCategory) {
      // If the user category exists, update it
      userCategory.expenseCategory =
        expenseCategory || userCategory.expenseCategory;
      userCategory.incomeCategory =
        incomeCategory || userCategory.incomeCategory;
      userCategory.budget = budget || userCategory.budget;
      userCategory.currencyCategory =
        currencyCategory || userCategory.currencyCategory;

      await userCategory.save();
      return res.status(200).json(userCategory);
    } else {
      // If the user category does not exist, create a new one
      userCategory = new UserCategoryModel({
        userId,
        expenseCategory,
        incomeCategory,
        budget,
        currencyCategory,
      });

      await userCategory.save();
      return res.status(201).json(userCategory);
    }
  } catch (error) {
    console.error("Error posting user categories:", error);
    res.status(500).json({ message: "Error posting user categories" });
  }
};

// Get user categories by userId
export const getUserCategories = async (req, res) => {
  const { userId } = req.params;

  try {
    const userCategory = await UserCategoryModel.findOne({ userId });
    if (userCategory) {
      return res.status(200).json(userCategory);
    } else {
      return res.status(404).json({ message: "User categories not found" });
    }
  } catch (error) {
    console.error("Error getting user categories:", error);
    res.status(500).json({ message: "Error getting user categories" });
  }
};

// Update user categories
export const updateUserCategories = async (req, res) => {
  const { categoryId } = req.params;
  const { expenseCategory, incomeCategory, budget, currencyCategory } =
    req.body;

  try {
    const userCategory = await UserCategoryModel.findById(categoryId);
    if (!userCategory) {
      return res.status(404).json({ message: "User category not found" });
    }

    userCategory.expenseCategory =
      expenseCategory || userCategory.expenseCategory;
    userCategory.incomeCategory = incomeCategory || userCategory.incomeCategory;
    userCategory.budget = budget || userCategory.budget;
    userCategory.currencyCategory =
      currencyCategory || userCategory.currencyCategory;

    await userCategory.save();
    return res.status(200).json(userCategory);
  } catch (error) {
    console.error("Error updating user categories:", error);
    res.status(500).json({ message: "Error updating user categories" });
  }
};

// Delete user categories
export const deleteUserCategories = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const userCategory = await UserCategoryModel.findById(categoryId);
    if (!userCategory) {
      return res.status(404).json({ message: "User category not found" });
    }

    await userCategory.remove();
    return res
      .status(200)
      .json({ message: "User category deleted successfully" });
  } catch (error) {
    console.error("Error deleting user categories:", error);
    res.status(500).json({ message: "Error deleting user categories" });
  }
};
