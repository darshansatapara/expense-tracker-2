import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  // Categories related to expenses
  expenseCategory: {
    type: Map,
    of: [String], // Each key will have an array of strings as its value
    required: true,
    default: {}, // Ensure it defaults to an empty object if not provided
  },

  // Categories related to income
  incomeCategory: {
    type: Map,
    of: [String], // Each key will have an array of strings as its value
    required: true,
    default: {}, // Ensure it defaults to an empty object if not provided
  },

  // Budget for the user
  budget: {
    type: Number,
    required: true,
    default: 0, // Set default to 0 if not provided
  },

  // Currency categories
  currencyCategory: {
    type: [mongoose.Schema.Types.Mixed], // This can be an array of strings representing different currencies
    required: true,
    default: [], // Ensure it defaults to an empty array if not provided
  },
});

const UserCategoryModel = mongoose.model("UserCategory", CategorySchema);

export default UserCategoryModel;
