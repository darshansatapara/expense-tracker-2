import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
  AdminIncomeCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";

//********************Expense**************************//
// Get all Admin Expense Categories which is active and inactive both
export const getAllAdminExpenseCategories =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);
      const categories = await AdminExpenseCategoryModel.find();
      res.status(200).json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// get all Expense Categories which is currently active
export const getAllAdminExpenseCategoriesIsActive =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Fetch only active categories and filter active subcategories
      const categories = await AdminExpenseCategoryModel.find(
        { isCategoryActive: true } // Fetch only active categories
      ).lean(); // Use lean() for better performance and direct object manipulation

      const filteredCategories = categories.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter(
          (subcategory) => subcategory.isSubCategoryActive // Include only active subcategories
        ),
      }));

      res.status(200).json({ success: true, categories: filteredCategories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//********************Income**************************//
// Get all Admin Income Categories
export const getAllAdminIncomeCategories =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminIncomeCategoryModel = AdminIncomeCategory(adminDbConnection);
      const categories = await AdminIncomeCategoryModel.find();
      res.status(200).json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// get income categories which are active
export const getAllAdminIncomeCategoriesIsActive =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminIncomeCategoryModel = AdminIncomeCategory(adminDbConnection);

      // Fetch only active income categories
      const categories = await AdminIncomeCategoryModel.find(
        { isCategoryActive: true } // Fetch only active categories
      ).lean();

      const filteredCategories = categories.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter(
          (subcategory) => subcategory.isSubCategoryActive // Include only active subcategories
        ),
      }));

      res.status(200).json({ success: true, categories: filteredCategories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

//********************currency**************************//
// Get all Admin Currency Categories
export const getAllAdminCurrencyCategories =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);
      const categories = await AdminCurrencyCategoryModel.find();
      res.status(200).json({ success: true, categories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// get currency category which is active
export const getAllAdminCurrencyCategoriesIsActive =
  (adminDbConnection) => async (req, res) => {
    try {
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);

      // Fetch only active currencies
      const currencies = await AdminCurrencyCategoryModel.find(
        { isCurrencyActive: true } // Fetch only active currencies
      ).lean();

      res.status(200).json({ success: true, currencies });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
