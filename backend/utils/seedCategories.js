//************************************************************//
// category adding script in data base

// import mongoose from "mongoose";
// import AdminCategoryDataModel from "../models/AdminModel/AdminCategoryDataModel.js";
// import categories from "./categories.js";
// import incomeSources from "./incomeSources.js"; // Assuming the JSON is saved as categories.js

// // Helper function to format text
// const formatText = (text) => {
//   return text
//     .toLowerCase()
//     .split(" ")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(" ");
// };

// // Format all categories and subcategories
// const formatCategories = (categories) => {
//   const formattedCategories = {};
//   for (const [key, value] of Object.entries(categories)) {
//     const formattedKey = formatText(key);
//     const formattedValues = value.map(formatText);
//     formattedCategories[formattedKey] = formattedValues;
//   }
//   return formattedCategories;
// };

// // MongoDB connection URI
// const MONGO_URI =
//   "mongodb+srv://expenseteam:expense281908@expense-tracker.su97n.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker";

// const seedDatabase = async () => {
//   try {
//     // Connect to MongoDB
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");

//     // Format the categories
//     const formattedCategories = formatCategories(categories);

//     // Check if the "Expense Categories" document already exists
//     let expenseCategory = await AdminCategoryDataModel.findOne({
//       name: "Expense Categories",
//     });

//     if (expenseCategory) {
//       console.log(
//         "Expense Categories document already exists. Updating categories..."
//       );

//       // Merge the new categories with the existing ones
//       for (const [key, value] of Object.entries(formattedCategories)) {
//         if (expenseCategory.categories.has(key)) {
//           const existingSubcategories = expenseCategory.categories.get(key);
//           const newSubcategories = value.filter(
//             (sub) => !existingSubcategories.includes(sub)
//           );
//           expenseCategory.categories.set(key, [
//             ...existingSubcategories,
//             ...newSubcategories,
//           ]);
//         } else {
//           expenseCategory.categories.set(key, value);
//         }
//       }
//     } else {
//       console.log("Creating new Income Categories document...");
//       expenseCategory = new AdminCategoryDataModel({
//         name: "Expense Categories",
//         categories: formattedCategories,
//       });
//     }

//     // Save the updated/created document
//     await expenseCategory.save();
//     console.log("Categories successfully added/updated!");

//     // Close the connection
//     mongoose.connection.close();
//   } catch (error) {
//     console.error("Error seeding the database:", error.message);
//     mongoose.connection.close();
//   }
// };

// // Run the script
// seedDatabase();

// *************************************************//

// currency adding script in the database
import mongoose from "mongoose";
import AdminCategoryDataModel from "../models/AdminModel/AdminCategoryDataModel.js";
import currencies from "./currency.js";

// Helper function to format text
const formatText = (text) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// MongoDB connection URI
const MONGO_URI =
  "mongodb+srv://expenseteam:expense281908@expense-tracker.su97n.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker";

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Format the currencies to match the required structure
    const formattedCurrencies = {};
    currencies.forEach((currency) => {
      formattedCurrencies[currency.name] = {
        symbol: currency.symbol,
        currency: currency.currency,
      };
    });

    // Check if the "Currency Data" document already exists
    let currencyCategory = await AdminCategoryDataModel.findOne({
      name: "Currency Categories",
    });

    if (currencyCategory) {
      console.log(
        "Currency Data document already exists. Updating currency data..."
      );

      // Merge the new currency data with the existing one
      for (const [currencyName, currencyData] of Object.entries(
        formattedCurrencies
      )) {
        if (!currencyCategory.categories[currencyName]) {
          currencyCategory.categories[currencyName] = currencyData;
        }
      }
    } else {
      console.log("Creating new Currency Data document...");
      currencyCategory = new AdminCategoryDataModel({
        name: "Currency Categories",
        categories: formattedCurrencies, // Add the formatted currency data
      });
    }

    // Save the updated/created document
    await currencyCategory.save();
    console.log("Currency data successfully added/updated!");

    // Close the connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding the database:", error.message);
    mongoose.connection.close();
  }
};

// Run the script
seedDatabase();
