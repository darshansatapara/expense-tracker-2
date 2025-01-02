import {
  UserExpenseCategoryModel,
  UserIncomeCategoryModel,
  UserCurrencyAndBudgetModel,
} from "../../models/UserModel/UserCategoryModels.js";
import UserProfileModel from "../../models/UserModel/UserProfileModel.js";
import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
  AdminIncomeCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";

//************************************EXPENSE Controller************************************
// Add User Expense Categories
export const addUserExpenseCategory =
  (userDbConnection) => async (req, res) => {
    const { userId, expenseCategories } = req.body;
    console.log(userId, expenseCategories);

    if (!userId || !expenseCategories) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and expenseCategories.",
      });
    }

    try {
      const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);

      const existingRecord = await UserExpenseCategory.findOne({ userId });

      if (existingRecord) {
        // Append new categories without duplicates
        const updatedCategories = [
          ...existingRecord.expenseCategories,
          ...expenseCategories.filter(
            (newCategory) =>
              !existingRecord.expenseCategories.some(
                (existing) =>
                  existing.categoryId.toString() === newCategory.categoryId
              )
          ),
        ];

        existingRecord.expenseCategories = updatedCategories;
        await existingRecord.save();

        return res.status(200).json({
          success: true,
          message: "Expense categories updated successfully.",
          data: existingRecord,
        });
      }

      // Create a new record
      const newExpenseCategory = new UserExpenseCategory({
        userId,
        expenseCategories,
      });

      const savedCategory = await newExpenseCategory.save();

      res.status(201).json({
        success: true,
        message: "Expense categories added successfully.",
        data: savedCategory,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add expense categories.",
        error: error.message,
      });
    }
  };

// get User Expense Categories Controller
export const getUserExpenseCategories =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId } = req.params;

    try {
      const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Find the user's expense categories
      const userExpenseData = await UserExpenseCategory.findOne({ userId });

      if (!userExpenseData) {
        return res.status(404).json({
          success: false,
          message: "No expense categories found for this user.",
        });
      }

      // Extract categoryIds and subcategoryIds from user data
      const categoryIds = userExpenseData.expenseCategories.map(
        (item) => item.categoryId
      );
      const subcategoryIds = userExpenseData.expenseCategories.flatMap(
        (item) => item.subcategoryIds
      );

      // Fetch only the categories available in the admin database
      const categories = await AdminExpenseCategoryModel.find({
        _id: { $in: categoryIds },
      });

      // Map and filter the user expense categories
      const filteredExpenseCategories = userExpenseData.expenseCategories
        .map((expenseCategory) => {
          const category = categories.find(
            (cat) =>
              cat._id.toString() === expenseCategory.categoryId.toString()
          );

          if (!category) {
            // Skip categories not found in the admin database
            return null;
          }

          // Filter the subcategories to include only those referenced in the user's subcategoryIds
          const filteredSubcategories = expenseCategory.subcategoryIds
            .map((subId) => {
              const subcategory = category.subcategories.find(
                (sub) => sub._id.toString() === subId.toString()
              );
              return subcategory
                ? { _id: subcategory._id, name: subcategory.name }
                : null;
            })
            .filter(Boolean); // Remove nulls (missing subcategories)

          return {
            _id: expenseCategory._id,
            categoryId: {
              _id: category._id,
              name: category.name,
            },
            subcategoryIds: filteredSubcategories, // Only the subcategories in the user's data
          };
        })
        .filter(Boolean); // Remove nulls (missing categories)

      res.status(200).json({
        success: true,
        data: {
          ...userExpenseData.toObject(),
          expenseCategories: filteredExpenseCategories,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
      });
    }
  };

// update user expense category
export const updateUserExpenseCategories =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId } = req.params;
    const { newExpenseCategory } = req.body;

    if (!userId || !newExpenseCategory || !Array.isArray(newExpenseCategory)) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and a valid newExpenseCategory array.",
      });
    }

    try {
      const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);
      const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Fetch user data
      let userExpenseData = await UserExpenseCategory.findOne({ userId });

      if (!userExpenseData) {
        // Create a new record if user data does not exist
        userExpenseData = new UserExpenseCategory({
          userId,
          expenseCategories: [],
        });
      }

      // Map of existing categories for quick lookup
      const existingCategoriesMap = Object.fromEntries(
        userExpenseData.expenseCategories.map((cat) => [
          cat.categoryId.toString(),
          cat,
        ])
      );

      // Validate and process newExpenseCategory
      for (const newCategory of newExpenseCategory) {
        const { categoryId, subcategoryIds } = newCategory;

        // Validate category in admin database
        const adminCategory = await AdminExpenseCategoryModel.findById(
          categoryId
        );

        if (!adminCategory) {
          return res.status(404).json({
            success: false,
            message: `Category with ID ${categoryId} not found in admin database.`,
          });
        }

        // Validate subcategories in admin database
        const validSubcategories = adminCategory.subcategories.filter((sub) =>
          subcategoryIds.includes(sub._id.toString())
        );

        if (validSubcategories.length !== subcategoryIds.length) {
          return res.status(400).json({
            success: false,
            message: `One or more subcategories for category ${categoryId} are invalid.`,
          });
        }

        // Add or update category and subcategories
        if (existingCategoriesMap[categoryId]) {
          // Update subcategories for existing category
          const existingCategory = existingCategoriesMap[categoryId];
          const updatedSubcategories = [
            ...new Set([
              ...existingCategory.subcategoryIds.map((id) => id.toString()),
              ...validSubcategories.map((sub) => sub._id.toString()),
            ]),
          ];
          existingCategory.subcategoryIds = updatedSubcategories;
        } else {
          // Add new category
          userExpenseData.expenseCategories.push({
            categoryId,
            subcategoryIds: validSubcategories.map((sub) => sub._id.toString()),
          });
        }
      }

      // Save the updated user expense categories
      const updatedUserExpenseData = await userExpenseData.save();

      res.status(200).json({
        success: true,
        message: "Expense categories updated successfully.",
        data: updatedUserExpenseData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update expense categories.",
        error: error.message,
      });
    }
  };

//delete user expense categories (if user can remove category, then accordingly their subcategories will be removed)
export const deleteUserExpenseCategories =
  (userDbConnection) => async (req, res) => {
    const { userId } = req.params;
    const { deleteCategoryIds } = req.body;

    if (
      !userId ||
      !Array.isArray(deleteCategoryIds) ||
      deleteCategoryIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid userId and a deleteCategoryIds array.",
      });
    }

    try {
      const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);

      // Fetch the user's data
      const userExpenseData = await UserExpenseCategory.findOne({ userId });

      if (!userExpenseData) {
        return res.status(404).json({
          success: false,
          message: "User expense data not found.",
        });
      }

      // Filter out the categories to be deleted
      const updatedExpenseCategories = userExpenseData.expenseCategories.filter(
        (category) =>
          !deleteCategoryIds.includes(category.categoryId.toString())
      );

      // Update the user's expense categories
      userExpenseData.expenseCategories = updatedExpenseCategories;

      // Save the updated document
      const updatedUserData = await userExpenseData.save();

      res.status(200).json({
        success: true,
        message: "Categories and their subcategories deleted successfully.",
        data: updatedUserData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete categories.",
        error: error.message,
      });
    }
  };

// delete only user sub-category in this route (..category have > 2 sub-categories)
export const deleteUserExpenseSubcategories =
  (userDbConnection) => async (req, res) => {
    const { userId } = req.params;
    const { CategoryDeleteData } = req.body;

    if (
      !userId ||
      !Array.isArray(CategoryDeleteData) ||
      CategoryDeleteData.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId and a valid CategoryDeleteData array.",
      });
    }

    try {
      const UserExpenseCategory = UserExpenseCategoryModel(userDbConnection);
      // const AdminExpenseCategoryModel = AdminExpenseCategory(adminDbConnection);

      // Fetch user's expense data
      const userExpenseData = await UserExpenseCategory.findOne({ userId });

      if (!userExpenseData) {
        return res.status(404).json({
          success: false,
          message: "No expense data found for the given user.",
        });
      }

      // Prepare updated expense categories
      const updatedExpenseCategories = userExpenseData.expenseCategories.map(
        (userCategory) => {
          const categoryToDelete = CategoryDeleteData.find(
            (delCat) => delCat.categoryId === userCategory.categoryId.toString()
          );

          // Skip categories not in delete data
          if (!categoryToDelete) return userCategory;

          // Remove subcategories only if the category has more than 2 subcategories
          if (userCategory.subcategoryIds.length > 2) {
            userCategory.subcategoryIds = userCategory.subcategoryIds.filter(
              (subId) =>
                !categoryToDelete.subcategoryIds.includes(subId.toString())
            );
          }

          return userCategory;
        }
      );

      // Remove any categories that no longer have subcategories
      const filteredCategories = updatedExpenseCategories.filter(
        (category) => category.subcategoryIds.length > 0
      );

      // Update user data
      userExpenseData.expenseCategories = filteredCategories;
      const updatedUserExpenseData = await userExpenseData.save();

      res.status(200).json({
        success: true,
        message: "Subcategories removed successfully.",
        data: updatedUserExpenseData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete subcategories.",
        error: error.message,
      });
    }
  };

// ****************************************INCOME Controllers***********************************
// Add User Income Categories
// export const addUserIncomeCategory = (userDbConnection) => async (req, res) => {
//   const { userId, incomeCategories } = req.body;

//   if (!userId || !incomeCategories) {
//     return res.status(400).json({
//       success: false,
//       message: "Please provide userId and incomeCategories.",
//     });
//   }

//   try {
//     const UserIncomeCategory = UserIncomeCategoryModel(userDbConnection);

//     const existingRecord = await UserIncomeCategory.findOne({ userId });

//     if (existingRecord) {
//       // Append new categories without duplicates
//       const updatedCategories = [
//         ...existingRecord.incomeCategories,
//         ...incomeCategories.filter(
//           (newCategory) =>
//             !existingRecord.incomeCategories.some(
//               (existing) =>
//                 existing.categoryId.toString() === newCategory.categoryId
//             )
//         ),
//       ];

//       existingRecord.incomeCategories = updatedCategories;
//       await existingRecord.save();

//       return res.status(200).json({
//         success: true,
//         message: "Income categories updated successfully.",
//         data: existingRecord,
//       });
//     }

//     // Create a new record
//     const newIncomeCategory = new UserIncomeCategory({
//       userId,
//       incomeCategories,
//     });

//     const savedCategory = await newIncomeCategory.save();

//     res.status(201).json({
//       success: true,
//       message: "Income categories added successfully.",
//       data: savedCategory,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to add income categories.",
//       error: error.message,
//     });
//   }
// };

// get User Income Categories Controller
export const getUserIncomeCategories =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId } = req.params;

    try {
      const UserProfile = UserProfileModel(userDbConnection);
      const AdminIncomeCategoryModel = AdminIncomeCategory(adminDbConnection);

      // Fetch user's profession using userId
      const user = await UserProfile.findOne({ _id: userId }).lean();

      if (!user) {
        return res.status(404).json({
          success: false,
          message: `User with ID ${userId} not found.`,
        });
      }

      const { profession } = user;

      if (!profession) {
        return res.status(400).json({
          success: false,
          message: `User with ID ${userId} does not have a profession set.`,
        });
      }

      // Fetch income categories from the Admin database based on the profession
      const categories = await AdminIncomeCategoryModel.find({
        name: profession,
      }).lean();

      if (!categories.length) {
        return res.status(404).json({
          success: false,
          message: `No income categories found for profession: ${profession}`,
        });
      }

      res.status(200).json({
        success: true,
        data: {
          profession,
          incomeCategories: categories,
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };

// export const updateUserIncomeCategory =
//   (userDbConnection, adminDbConnection) => async (req, res) => {
//     const { userId, newUpdatedCategories } = req.body;

//     if (!userId || !newUpdatedCategories) {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide userId and updatedCategories.",
//       });
//     }

//     try {
//       const UserIncomeCategory = UserIncomeCategoryModel(userDbConnection);
//       const AdminIncomeCategoryModel = AdminIncomeCategory(adminDbConnection);

//       // Fetch the user's existing income categories
//       const existingRecord = await UserIncomeCategory.findOne({ userId });

//       if (!existingRecord) {
//         return res.status(404).json({
//           success: false,
//           message: "No income categories found for this user.",
//         });
//       }

//       // Validate categories against the admin database
//       const adminCategoryIds = newUpdatedCategories.map(
//         (item) => item.categoryId
//       );
//       const adminCategories = await AdminIncomeCategoryModel.find({
//         _id: { $in: adminCategoryIds },
//       }).lean();

//       if (adminCategories.length !== adminCategoryIds.length) {
//         return res.status(400).json({
//           success: false,
//           message: "Some provided category IDs are invalid.",
//         });
//       }

//       // Map admin categories for validation and quick access
//       const adminCategoryMap = Object.fromEntries(
//         adminCategories.map((cat) => [cat._id.toString(), cat])
//       );

//       // Process updated categories
//       newUpdatedCategories.forEach(({ categoryId, subcategoryIds }) => {
//         const adminCategory = adminCategoryMap[categoryId];

//         if (!adminCategory) {
//           throw new Error(`Category with ID ${categoryId} not found.`);
//         }

//         // Filter valid subcategories from the admin category
//         const validSubcategories = subcategoryIds.filter((subId) =>
//           adminCategory.subcategories.some(
//             (sub) => sub._id.toString() === subId
//           )
//         );

//         // Find the existing category in the user's record
//         const existingCategory = existingRecord.incomeCategories.find(
//           (cat) => cat.categoryId.toString() === categoryId
//         );

//         if (existingCategory) {
//           // Append only new subcategories to the existing category
//           existingCategory.subcategoryIds = [
//             ...new Set([
//               ...existingCategory.subcategoryIds,
//               ...validSubcategories,
//             ]),
//           ];
//         } else {
//           // Add a new category with valid subcategories
//           existingRecord.incomeCategories.push({
//             categoryId,
//             subcategoryIds: validSubcategories,
//           });
//         }
//       });

//       // Save the updated record
//       await existingRecord.save();

//       // Populate the updated data for response
//       const populatedData = await UserIncomeCategory.findOne({
//         userId,
//       }).populate({
//         path: "incomeCategories.categoryId",
//         model: AdminIncomeCategoryModel,
//       });

//       res.status(200).json({
//         success: true,
//         message: "Income categories updated successfully.",
//         data: populatedData,
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Failed to update income categories.",
//         error: error.message,
//       });
//     }
//   };

//*********************************Currnecy Controller***********************************/

// Add User Currency and Budget
export const addUserCurrencyAndBudget =
  (userDbConnection) => async (req, res) => {
    const { userId, currencyCategory, budget } = req.body;

    if (!userId || !currencyCategory || !budget) {
      return res.status(400).json({
        success: false,
        message: "Please provide userId, currencyCategory, and budget.",
      });
    }

    try {
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);

      const existingRecord = await UserCurrencyAndBudget.findOne({ userId });

      if (existingRecord) {
        // Update currency category and budget
        existingRecord.currencyCategory = currencyCategory;
        existingRecord.budget = budget;

        await existingRecord.save();

        return res.status(200).json({
          success: true,
          message: "Currency and budget updated successfully.",
          data: existingRecord,
        });
      }

      // Create a new record
      const newCurrencyAndBudget = new UserCurrencyAndBudget({
        userId,
        currencyCategory,
        budget,
      });

      const savedRecord = await newCurrencyAndBudget.save();

      res.status(201).json({
        success: true,
        message: "Currency and budget added successfully.",
        data: savedRecord,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to add currency and budget.",
        error: error.message,
      });
    }
  };

// User Currency and Budget Controller
export const getUserCurrencyAndBudget =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId } = req.params;

    try {
      // Ensure models are initialized correctly for their respective databases
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);

      // Fetch the user's currency and budget data
      const userCurrencyAndBudgetData = await UserCurrencyAndBudget.findOne({
        userId,
      }).populate({
        path: "currencyCategory",
        model: AdminCurrencyCategoryModel, // Reference from admin database
      });

      if (!userCurrencyAndBudgetData) {
        return res.status(404).json({
          success: false,
          message: "No currency and budget data found for the user.",
        });
      }

      res.status(200).json({
        success: true,
        data: userCurrencyAndBudgetData,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };

//update user currency and budget data
export const updateUserCurrencyAndBudget =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId } = req.params;
    const { newCurrencyCategoryIds, budget } = req.body;

    try {
      // Validate if neither categories nor budget are provided
      if (!newCurrencyCategoryIds && !budget) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide either new currency category ObjectIds or budget data (offline/online).",
        });
      }

      // Initialize models
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);
      const AdminCurrencyCategoryModel =
        AdminCurrencyCategory(adminDbConnection);

      // Check if the user already has a budget entry
      const userData = await UserCurrencyAndBudget.findOne({ userId });

      if (!userData || !userData.budget || userData.budget.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No existing budget found for the user.",
        });
      }

      // Handle case where budget is provided
      if (budget) {
        const { offlineBudget, onlineBudget } = budget[0]; // Extract budget details

        // Ensure that budget values are numbers (if they are provided as strings)
        const offlineBudgetNum = parseFloat(offlineBudget);
        const onlineBudgetNum = parseFloat(onlineBudget);

        // Prepare the update data for the budget
        const updateData = {};
        if (!isNaN(offlineBudgetNum)) {
          updateData["budget.$.offlineBudget"] = offlineBudgetNum;
        }
        if (!isNaN(onlineBudgetNum)) {
          updateData["budget.$.onlineBudget"] = onlineBudgetNum;
        }

        // If update data exists, perform the update
        if (Object.keys(updateData).length > 0) {
          await UserCurrencyAndBudget.updateOne(
            { userId, "budget._id": userData.budget[0]._id }, // Reference the first budget entry's _id
            { $set: updateData }
          );
        }
      }

      // Handle case where new currency category IDs are provided
      if (
        newCurrencyCategoryIds &&
        Array.isArray(newCurrencyCategoryIds) &&
        newCurrencyCategoryIds.length > 0
      ) {
        // Validate the category IDs exist in the admin database
        const validCategories = await AdminCurrencyCategoryModel.find({
          _id: { $in: newCurrencyCategoryIds },
        });

        if (validCategories.length !== newCurrencyCategoryIds.length) {
          return res.status(400).json({
            success: false,
            message: "Some provided currency category ObjectIds are invalid.",
          });
        }

        // Add new currency categories to the user's existing data
        await UserCurrencyAndBudget.findOneAndUpdate(
          { userId },
          {
            $addToSet: { currencyCategory: { $each: newCurrencyCategoryIds } },
          },
          { new: true } // Return the updated document
        );
      }

      // Return success response after updating
      const updatedData = await UserCurrencyAndBudget.findOne({
        userId,
      }).populate({
        path: "currencyCategory",
        model: AdminCurrencyCategoryModel,
      });

      if (!updatedData) {
        return res.status(404).json({
          success: false,
          message: "No currency and budget data found for the user.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Currency categories and/or budget updated successfully.",
        data: updatedData,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  };

//delete currency category form user database
export const deleteUserCurrencyCategory =
  (userDbConnection) => async (req, res) => {
    const { userId } = req.params;
    const { deleteCurrencyCategoryIds } = req.body;

    // Validate input
    if (
      !userId ||
      !Array.isArray(deleteCurrencyCategoryIds) ||
      deleteCurrencyCategoryIds.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid userId and deleteCurrencyCategoryIds array.",
      });
    }

    try {
      // Initialize the user model
      const UserCurrencyAndBudget =
        UserCurrencyAndBudgetModel(userDbConnection);

      // Fetch user data
      const userCurrencyAndBudgetData = await UserCurrencyAndBudget.findOne({
        userId,
      });

      if (!userCurrencyAndBudgetData) {
        return res.status(404).json({
          success: false,
          message: "User currency and budget data not found.",
        });
      }

      // Filter out the currency categories to be deleted
      const updatedCurrencyCategories =
        userCurrencyAndBudgetData.currencyCategory.filter(
          (currencyId) =>
            !deleteCurrencyCategoryIds.includes(currencyId.toString())
        );

      // Update the user's currency categories
      userCurrencyAndBudgetData.currencyCategory = updatedCurrencyCategories;

      // Save the changes
      const updatedUserData = await userCurrencyAndBudgetData.save();

      res.status(200).json({
        success: true,
        message: "Currency categories deleted successfully.",
        data: updatedUserData,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete currency categories.",
        error: error.message,
      });
    }
  };
