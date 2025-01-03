import mongoose from "mongoose";
import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";
import {
  UserCurrencyAndBudgetModel,
  UserExpenseCategoryModel,
} from "../../models/UserModel/UserCategoryModels.js";

export const softDeleteUserCurrencyByAdminChanged =
  (adminDbConnection, userDbConnection) => async (next, categoryIds) => {
    try {
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);

      // Verify the provided category IDs
      const adminCategories = await AdminCurrencyCategoryModel.find({
        _id: { $in: categoryIds },
        isCurrencyActive: false, // Ensure these are already deactivated
      });

      if (!adminCategories || adminCategories.length === 0) {
        console.log("No matching categories found for user currency updates.");
        return next();
      }

      // Update all users' currency data where the categories match the deactivated IDs
      await UserCurrencyAndBudget.updateMany(
        { "currencyCategory.currencyId": { $in: categoryIds } },
        { $set: { "currencyCategory.$[elem].isCurrencyActive": false } },
        {
          arrayFilters: [{ "elem.currencyId": { $in: categoryIds } }],
        }
      );

      // Send success response
      return res.status(200).json({
        success: true,
        message: `User currency data updated for deactivated categories: ${categoryIds.join(
          ", "
        )}.`,
      });
      // console.log(
      //   `User currencies updated for deactivated categories: ${categoryIds}`
      // );
    } catch (error) {
      console.error(
        "Error updating user currencies for multiple categories:",
        error.message
      );
    }

    next(); // Proceed to the next middleware or operation
  };

// Middleware for soft delete UserExpenseCategory and subcategory after soft delete in admin expense category
export const softDeleteUserExpenseCategoryByAdminChanged =
  (adminDbConnection, userDbConnection) =>
  async (req, res, categoryIds, softdeletedata, next) => {
    const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);
    const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);

    try {
      // Case 1: Handle category soft delete
      if (categoryIds && Array.isArray(categoryIds)) {
        // Fetch categories and their subcategories from the admin database
        const adminCategories = await AdminExpenseCategoryModel.find({
          _id: { $in: categoryIds },
        }).select("_id subcategories");

        for (const category of adminCategories) {
          // Soft delete category in user database
          await UserExpenseCategory.updateMany(
            { "expenseCategories.categoryId": category._id },
            {
              $set: {
                "expenseCategories.$[category].isCategoryActive": false,
                "expenseCategories.$[category].subcategoryIds.$[].isSubcategoryActive": false,
              },
            },
            {
              arrayFilters: [{ "category.categoryId": category._id }],
            }
          );
        }
      }

      // Case 2: Handle subcategory soft delete
      if (softdeletedata && Array.isArray(softdeletedata)) {
        for (const { categoryIds: catId, subcategoriesId } of softdeletedata) {
          // Fetch the category and subcategories from Admin database
          const adminCategory = await AdminExpenseCategoryModel.findOne({
            _id: catId,
            "subcategories._id": { $in: subcategoriesId },
          }).select("_id subcategories");

          if (!adminCategory) {
            continue; // Skip if category doesn't exist
          }

          // Filter subcategories based on their active status
          const validSubcategories = adminCategory.subcategories.filter((sub) =>
            subcategoriesId.includes(sub._id.toString())
          );

          for (const sub of validSubcategories) {
            // Reflect the admin status in the user database
            await UserExpenseCategory.updateMany(
              {
                "expenseCategories.categoryId": catId,
                "expenseCategories.subcategoryIds.subcategoryId": sub._id,
              },
              {
                $set: {
                  "expenseCategories.$[category].subcategoryIds.$[sub].isSubcategoryActive":
                    sub.isSubCategoryActive,
                },
              },
              {
                arrayFilters: [
                  { "category.categoryId": catId },
                  { "sub.subcategoryId": sub._id },
                ],
              }
            );
          }
        }
      }

      next(); // Let the route handler know that middleware is done
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update user data during soft delete.",
        error: error.message,
      });
    }
  };

// Middleware for remove soft delete(mean make active type : true) UserExpenseCategory and subcategory after remove soft delete in admin expense category

