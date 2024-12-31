// Connect to the admin database
import currencies from "./currency.js";
import {
  // connectUserDatabase,
  connectAdminDatabase,
} from "../config/database.js";
import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
  AdminIncomeCategory,
  CopyAdminExpenseCategory,
} from "../models/AdminModel/AdminCategoryModels.js";
import incomeSources from "./income.js";
import mongoose from "mongoose";
import categories from "./category.js";

// **********************************Function to add currencies to the database
// const addCurrencies = async () => {
//   try {
//     const adminDbConnection = await connectAdminDatabase();
//     const CurrencyModel = AdminCurrencyCategory(adminDbConnection);

//     for (const currency of currencies) {
//       const newCurrency = new CurrencyModel(currency);
//       await newCurrency.save();
//       console.log(`Added currency: ${currency.currency}`);
//     }

//     console.log("All currencies have been added successfully.");
//     adminDbConnection.close(); // Close the connection after all data is added
//   } catch (error) {
//     console.error("Error adding currencies:", error);
//   }
// };

// Run the script
// addCurrencies();

// Function to save a income category with its subcategories
// const saveCategoryWithSubcategories = async (
//   categoryName,
//   subcategories,
//   AdminIncomeCategoryModel
// ) => {
//   const subcategoryObjects = subcategories.map((subcategoryName) => {
//     return {
//       _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for each subcategory
//       name: subcategoryName,
//     };
//   });

//   // Create a new category document
//   const category = new AdminIncomeCategoryModel({
//     name: categoryName,
//     subcategories: subcategoryObjects,
//   });

//   // Save the category to the database
//   await category.save();
//   console.log(
//     `Category "${categoryName}" with ${subcategories.length} subcategories added successfully.`
//   );
// };

// // Add income sources to the database******************************
// const addIncomeSources = async () => {
//   const adminDbConnection = await connectAdminDatabase();

//   try {
//     const AdminIncomeCategoryModel = AdminIncomeCategory(adminDbConnection);

//     // Iterate over each category in incomeSources
//     for (const categoryName in incomeSources) {
//       const subcategories = incomeSources[categoryName];

//       // Save the category and subcategories one by one
//       await saveCategoryWithSubcategories(
//         categoryName,
//         subcategories,
//         AdminIncomeCategoryModel
//       );
//     }

//     console.log("All income sources added successfully.");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error adding income sources:", error);
//     process.exit(1);
//   }
// };

// // Run the script
// addIncomeSources();

// save expense category

// Function to save a category and its subcategories***********************************
// const saveCategoryWithSubcategories = async (
//   categoryName,
//   subcategories,
//   CopyAdminExpenseCategoryModel
// ) => {
//   // Map the subcategory names to subcategory objects with _id and name
//   const subcategoryObjects = subcategories.map((subcategoryName) => {
//     return {
//       _id: new mongoose.Types.ObjectId(), // Generate a new ObjectId for each subcategory
//       name: subcategoryName,
//     };
//   });

//   // Create a new category document
//   const category = new CopyAdminExpenseCategoryModel({
//     name: categoryName,
//     subcategories: subcategoryObjects,
//   });

//   // Save the category to the database
//   await category.save();
//   console.log(
//     `Category "${categoryName}" with ${subcategories.length} subcategories added successfully.`
//   );
// };

// // Function to add all categories and their subcategories to the database
// const addCategories = async () => {
//   const adminDbConnection = await connectAdminDatabase(); // Ensure you define this function to connect to your DB

//   try {
//     const AdminExpenseCategoryModel =
//       CopyAdminExpenseCategory(adminDbConnection);

//     // Iterate over each category in categories object
//     for (const categoryName in categories) {
//       const subcategories = categories[categoryName];

//       // Save the category and its subcategories
//       await saveCategoryWithSubcategories(
//         categoryName,
//         subcategories,
//         AdminExpenseCategoryModel
//       );
//     }

//     console.log("All categories and subcategories added successfully.");
//     process.exit(0); // Exit the process after all categories are added
//   } catch (error) {
//     console.error("Error adding categories:", error);
//     process.exit(1); // Exit with error status if something goes wrong
//   }
// };

// // Run the function to add categories
// addCategories();

// *************************************************Copy data function

// make a copy of the data of admin expense categories
async function copyAdminExpenseCategories() {
  try {
    const adminDbConnection = await connectAdminDatabase();
    console.log("Connected to MongoDB");

    // Initialize the models
    const AdminCategory = AdminExpenseCategory(adminDbConnection);
    const CopyCategory = CopyAdminExpenseCategory(adminDbConnection);

    // Fetch all documents from the AdminExpenseCategory collection
    const categories = await AdminCategory.find({});

    console.log(
      `Found ${categories.length} categories in AdminExpenseCategory`
    );

    // Prepare data for the CopyAdminExpenseCategory collection
    const copyData = categories.map((category) => {
      return {
        name: category.name,
        categoryId: category._id, // Store the original _id
        subcategories: category.subcategories,
        status: "active", // Mark all categories as active by default
      };
    });

    // Insert the data into the CopyAdminExpenseCategory collection
    const result = await CopyCategory.insertMany(copyData);

    console.log(
      `Copied ${result.length} categories to CopyAdminExpenseCategory`
    );

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error copying categories:", error);
    process.exit(1); // Exit with failure
  }
}

// Execute the function
copyAdminExpenseCategories();
