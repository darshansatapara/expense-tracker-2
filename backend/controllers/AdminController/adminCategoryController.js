import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
  AdminIncomeCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";

//********************Expense**************************//
// Get all Admin Expense Categories
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
