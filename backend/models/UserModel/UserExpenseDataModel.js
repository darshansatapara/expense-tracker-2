import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  description: { type: String, required: false },
});

const userExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProfile",
    required: true,
  },
  expenses: [
    {
      date: { type: String, required: true },
      online: [expenseSchema],
      offline: [expenseSchema],
    },
  ],
});

const UserExpense = mongoose.model("UserExpenseData", userExpenseSchema);

export default UserExpense;
