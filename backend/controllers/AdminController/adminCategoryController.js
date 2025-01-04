import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
  AdminIncomeCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";
import {
  removeSoftDeleteUserExpenseCategoryByAdminChanged,
  softDeleteUserCurrencyByAdminChanged,
  softDeleteUserExpenseCategoryByAdminChanged,
} from "../../middlewares/userMiddlewares/userCategoryMiddlewares.js";
import mongoose from "mongoose";

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

// soft delete of only expense "categories" in the admin and user expense data
/*{
  "categoryIds": ["64e8b25f1234567890abcdef", "64e8b2601234567890abcdef"]
}
 */
export const softDeleteExpenseCategories =
  (adminDbConnection, userDbConnection) => async (req, res) => {
    const { categoryIds } = req.body;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one categoryId to soft delete.",
      });
    }

    try {
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Soft delete categories and their subcategories in admin data
      await AdminExpenseCategoryModel.updateMany(
        { _id: { $in: categoryIds } },
        {
          $set: {
            isCategoryActive: false,
            "subcategories.$[].isSubCategoryActive": false, // Deactivate all subcategories
          },
        }
      );

      // Step 2: Update user data using middleware
      const handleMiddlewareResponse = async () => {
        return new Promise((resolve, reject) => {
          softDeleteUserExpenseCategoryByAdminChanged(
            adminDbConnection,
            userDbConnection
          )(
            req, // Pass the request object to middleware
            res, // Pass the response object to middleware
            categoryIds,
            null, // No subcategory-specific data needed here
            (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      };

      await handleMiddlewareResponse();

      // Step 3: Send success response after both updates
      res.status(200).json({
        success: true,
        message:
          "Categories and their subcategories soft deleted successfully in both admin and user data.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to soft delete categories.",
        error: error.message,
      });
    }
  };

// soft delete of only expense "Sub-categories" in the admin and user expense data
/*
{
  "softdeletedata": [
    {
      "categoryIds": "64e8b25f1234567890abcdef",
      "subcategoriesId": ["64e8b25f1234567890abc001", "64e8b25f1234567890abc002"]
    },
    {
      "categoryIds": "64e8b2601234567890abcdef",
      "subcategoriesId": ["64e8b2601234567890abc003", "64e8b2601234567890abc004"]
    }
  ]
}

*/
export const softDeleteExpenseSubcategories =
  (adminDbConnection, userDbConnection) => async (req, res) => {
    const { softdeletedata } = req.body;

    if (!softdeletedata || !Array.isArray(softdeletedata)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'softdeletedata' must be a valid array.",
      });
    }

    const alreadyDeletedSubcategories = [];
    const changedSubcategories = [];

    try {
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Step 1: Soft delete subcategories in admin data
      for (const { categoryIds, subcategoriesId } of softdeletedata) {
        const adminCategory = await AdminExpenseCategoryModel.findOne({
          _id: categoryIds,
          "subcategories._id": { $in: subcategoriesId },
        });

        if (!adminCategory) {
          continue; // Skip if category doesn't exist
        }

        for (const subcategoryId of subcategoriesId) {
          const subcategory = adminCategory.subcategories.find(
            (sub) => sub._id.toString() === subcategoryId
          );

          if (!subcategory) {
            continue; // Skip if subcategory doesn't exist
          }

          if (subcategory.isSubCategoryActive === false) {
            // Already soft deleted, add to `alreadyDeletedSubcategories`
            alreadyDeletedSubcategories.push(subcategoryId);
          } else {
            // Soft delete and add to `changedSubcategories`
            await AdminExpenseCategoryModel.updateOne(
              { _id: categoryIds },
              {
                $set: {
                  "subcategories.$[subcategory].isSubCategoryActive": false,
                },
              },
              {
                arrayFilters: [{ "subcategory._id": subcategoryId }],
              }
            );

            changedSubcategories.push(subcategoryId);
          }
        }
      }

      // Step 2: Update user data using middleware
      const handleMiddlewareResponse = async () => {
        return new Promise((resolve, reject) => {
          softDeleteUserExpenseCategoryByAdminChanged(
            adminDbConnection,
            userDbConnection
          )(
            req, // Pass the request object to middleware
            res, // Pass the response object to middleware
            softdeletedata,
            (error) => {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            }
          );
        });
      };

      await handleMiddlewareResponse();

      // Step 3: Send success response after both updates
      return res.status(200).json({
        success: true,
        message:
          "Subcategories soft deleted successfully in both admin and user data.",
        alreadyDeletedSubcategories,
        changedSubcategories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to soft delete subcategories.",
        error: error.message,
      });
    }
  };

// remove soft delete(mean make active : true) only in expense "category" in admin and user database
/*{
  "categoryIds": ["64e8b25f1234567890abcdef", "64e8b2601234567890abcdef"]
}
 */


// remove soft delete(mean make active : true) only in expense "sub-category" in admin and user database
/*
{
  "softdeletedata": [
    {
      "categoryIds": "64e8b25f1234567890abcdef",
      "subcategoriesId": ["64e8b25f1234567890abc001", "64e8b25f1234567890abc002"]
    },
    {
      "categoryIds": "64e8b2601234567890abcdef",
      "subcategoriesId": ["64e8b2601234567890abc003", "64e8b2601234567890abc004"]
    }
  ]
}

*/


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

// we can use soft delete here which is make the currency category isCurrencyActive:false, also form the user currency category database collection

export const softDeleteAdminCurrencyCategories =
  (adminDbConnection, userDbConnection) => async (req, res) => {
    const { categoryIds } = req.body; // Expect an array of category IDs to deactivate

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid array of currency category IDs.",
      });
    }

    try {
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);
      // const UserCurrencyAndBudget =
      //   UserCurrencyAndBudgetModel(userDbConnection);

      // Update all provided categories in AdminCurrencyCategory
      const updatedCategories = await AdminCurrencyCategoryModel.updateMany(
        { _id: { $in: categoryIds } },
        { $set: { isCurrencyActive: false } }
      );

      if (updatedCategories.modifiedCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No matching currency categories found to deactivate.",
        });
      }

      // Trigger user currency updates asynchronously for affected categories
      softDeleteUserCurrencyByAdminChanged(adminDbConnection, userDbConnection)(
        () => {},
        categoryIds
      );

      res.status(200).json({
        success: true,
        message: "Currency categories deactivated successfully.",
        data: { deactivatedCategoryIds: categoryIds },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to deactivate currency categories.",
        error: error.message,
      });
    }
  };
