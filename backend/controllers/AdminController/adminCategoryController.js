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

// update category & subcategories name , we able to update one or more categories at a time
export const updateExpenseCategoriesAndSubcategories =
  (adminDbConnection) => async (req, res) => {
    const updatedcategories = req.body.updatedcategories; // Expect an array of update objects

    if (!Array.isArray(updatedcategories) || updatedcategories.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No updates provided." });
    }

    const notFoundItems = [];
    const successfulUpdates = [];

    try {
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Process all updates
      for (const update of updatedcategories) {
        const { categoryId, categoryNewName, subcategories } = update;

        if (!categoryId) {
          notFoundItems.push({ categoryId, message: "Missing category ID" });
          continue;
        }

        const category = await AdminExpenseCategoryModel.findById(categoryId);
        if (!category) {
          notFoundItems.push({ categoryId, message: "Category not found" });
          continue;
        }

        if (categoryId && categoryNewName && !subcategories) {
          // Case 1: Update only category name
          category.name = categoryNewName;
          await category.save();
          successfulUpdates.push({
            categoryId,
            categoryNewName,
            message: "Category name updated successfully",
          });
        } else if (
          categoryId &&
          !categoryNewName &&
          Array.isArray(subcategories)
        ) {
          // Case 3: Update only subcategories
          for (const subcategoryUpdate of subcategories) {
            const { subcategoryId, subCategorynewName } = subcategoryUpdate;

            if (!subcategoryId || !subCategorynewName) {
              notFoundItems.push({
                categoryId,
                subcategoryId,
                message: "Missing subcategory ID or new name",
              });
              continue;
            }

            const subcategory = category.subcategories.id(subcategoryId);
            if (subcategory) {
              subcategory.name = subCategorynewName;
              successfulUpdates.push({
                categoryId,
                subcategoryId,
                subCategorynewName,
                message: "Subcategory updated successfully",
              });
            } else {
              notFoundItems.push({
                categoryId,
                subcategoryId,
                message: "Subcategory not found",
              });
            }
          }

          await category.save();
        } else if (
          categoryId &&
          categoryNewName &&
          Array.isArray(subcategories)
        ) {
          // Case 2: Update both category name and subcategories
          category.name = categoryNewName;

          for (const subcategoryUpdate of subcategories) {
            const { subcategoryId, subCategorynewName } = subcategoryUpdate;

            if (!subcategoryId || !subCategorynewName) {
              notFoundItems.push({
                categoryId,
                subcategoryId,
                message: "Missing subcategory ID or new name",
              });
              continue;
            }

            const subcategory = category.subcategories.id(subcategoryId);
            if (subcategory) {
              subcategory.name = subCategorynewName;
              successfulUpdates.push({
                categoryId,
                categoryNewName,
                subcategoryId,
                subCategorynewName,
              });
            } else {
              notFoundItems.push({
                categoryId,
                subcategoryId,
                message: "Subcategory not found",
              });
            }
          }

          await category.save();
          successfulUpdates.push({
            categoryId,
            categoryNewName,
            message: "Category name and subcategories updated successfully",
          });
        } else {
          // Case 4: Invalid or incomplete input
          notFoundItems.push({
            categoryId,
            message:
              "Invalid update request. Provide valid category or subcategory data.",
          });
        }
      }

      // Respond with the results after processing all updates
      res.status(200).json({
        success: true,
        message: "Updates processed successfully.",
        successfulUpdates,
        notFoundItems,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

// using update we can remove expense category from the admincategory(make category)

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
