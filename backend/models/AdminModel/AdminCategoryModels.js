import mongoose from "mongoose";

// Admin Expense Category Schema
const AdminExpenseCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure each category name is unique
  },
  subcategories: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

// Admin Income Category Schema
const AdminIncomeCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure each category name is unique
  },
  subcategories: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
  ],
});

// Admin Currency Category Schema
const AdminCurrencyCategorySchema = new mongoose.Schema({
  currency: {
    type: String,
    required: true, // e.g., "USD"
  },
  name: {
    type: String,
    required: true, // e.g., "United States Dollar"
  },
  symbol: {
    type: String,
    required: true, // e.g., "$"
  },
});

// Export models, passing the correct database connection
// Export models, passing the correct database connection
export const AdminCurrencyCategory = (adminDbConnection) => {
  // Check if the model is already registered to prevent errors
  if (adminDbConnection.models.AdminCurrencyCategory) {
    return adminDbConnection.models.AdminCurrencyCategory;
  }

  // If not, create and register the model with the provided database connection
  return adminDbConnection.model(
    "AdminCurrencyCategory",
    AdminCurrencyCategorySchema
  );
};

export const AdminExpenseCategory = (adminDbConnection) => {
  return adminDbConnection.model(
    "AdminExpenseCategory",
    AdminExpenseCategorySchema
  );
};

export const AdminIncomeCategory = (adminDbConnection) => {
  return adminDbConnection.model(
    "AdminIncomeCategory",
    AdminIncomeCategorySchema
  );
};
