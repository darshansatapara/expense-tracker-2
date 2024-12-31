import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline"], required: true },
  amount: { type: String, required: true },
  currency: { type: mongoose.Schema.Types.ObjectId, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, required: true },
  note: { type: String, required: false },
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
