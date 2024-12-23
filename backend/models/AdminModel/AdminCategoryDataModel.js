import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure each category name is unique
  },
  categories: {
    type: Map,
    of: [mongoose.Schema.Types.Mixed], // Each key in the map will have an array of strings as its value
    required: true,
  },
});

const AdminCategoryDataModel = mongoose.model(
  "ExpenseAndIncomeCategoryData",
  CategorySchema
);
export default AdminCategoryDataModel;
