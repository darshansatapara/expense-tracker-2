import mongoose from "mongoose";

// Define the income schema for individual income entries
const incomeSchema = new mongoose.Schema({
  date: { type: String, required: true },
  mode: { type: String, enum: ["Online", "Offline"], required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: false },
});

// Define the user income schema to group incomes by userId
const userIncomeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  incomes: [
    {
      date: { type: String, required: true },
      online: [incomeSchema], // Array of income entries for Online mode
      offline: [incomeSchema], // Array of income entries for Offline mode
    },
  ],
});

// Create the UserIncome model
const UserIncome = mongoose.model("UserIncome", userIncomeSchema);

export default UserIncome;
