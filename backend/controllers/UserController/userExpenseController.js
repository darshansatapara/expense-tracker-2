import {
  AdminCurrencyCategory,
  AdminExpenseCategory,
} from "../../models/AdminModel/AdminCategoryModels.js";
import UserExpense from "../../models/UserModel/UserExpenseDataModel.js";
import dayjs from "dayjs";

//add the user expense
/*
{
  "userId": "67792e48b3085a94fc47b110",
  "date": "2025-01-04",
  "mode": "Offline",
  "amount": "250.00",
  "category": "6774dfd2a75ec7e9ef49e89e",
  "subcategory": "6774dfd2a75ec7e9ef49e894",
  "currency": "6774e15f0ae028dfbf4f2c67",
  "note": "travel to collage."
}

*/
export const addUserExpense = (userDbConnection) => async (req, res) => {
  const { userId, date, mode, amount, category, subcategory, currency, note } =
    req.body;

  if (!userId || !date || !mode || !amount || !category || !currency) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: userId, date, mode, amount, category, currency are mandatory.",
    });
  }

  try {
    const UserExpenseModel = UserExpense(userDbConnection);
    const formattedDate = dayjs(date).format("DD-MM-YYYY");

    // Find user expenses for the given userId
    let userExpense = await UserExpenseModel.findOne({ userId });

    // Build the expense object
    const newExpense = {
      date: formattedDate,
      mode,
      amount,
      category,
      subcategory,
      currency,
      note,
    };

    if (!userExpense) {
      // Create a new user expense document if none exists
      userExpense = new UserExpenseModel({
        userId,
        expenses: [
          {
            date: formattedDate,
            online: mode === "Online" ? [newExpense] : [],
            offline: mode === "Offline" ? [newExpense] : [],
          },
        ],
      });
    } else {
      // Check if an expense entry for the given date exists
      let expenseForDate = userExpense.expenses.find(
        (exp) => exp.date === formattedDate
      );

      if (expenseForDate) {
        // Add to the existing online/offline array
        if (mode === "Online") {
          expenseForDate.online.push(newExpense);
        } else {
          expenseForDate.offline.push(newExpense);
        }
      } else {
        // Create a new entry for this date
        userExpense.expenses.push({
          date: formattedDate,
          online: mode === "Online" ? [newExpense] : [],
          offline: mode === "Offline" ? [newExpense] : [],
        });
      }
    }

    // Save the updated or newly created document
    await userExpense.save();

    res.status(201).json({
      success: true,
      message: "Expense added successfully.",
      data: userExpense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Error adding expense.",
      error: error.message,
    });
  }
};

// Get expenses for a user within a date range
export const getUserExpense =
  (userDbConnection, adminDbConnection) => async (req, res) => {
    const { userId, startDate, endDate } = req.params;

    try {
      // Initialize the UserExpense model for the userDbConnection
      const UserExpenseModel = UserExpense(userDbConnection);

      // Parse start and end dates
      const formattedStartDate = new Date(
        startDate.split("-").reverse().join("-")
      ); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"
      const formattedEndDate = new Date(endDate.split("-").reverse().join("-")); // Convert "DD-MM-YYYY" to "YYYY-MM-DD"

      // Fetch user expenses and populate the related fields
      const userExpenses = await UserExpenseModel.findOne({ userId })
        .populate({
          path: "expenses.online.currency",
          model: AdminCurrencyCategory(adminDbConnection),
          select: "symbol", // Select only the symbol for currency
        })
        .populate({
          path: "expenses.offline.currency",
          model: AdminCurrencyCategory(adminDbConnection),
          select: "symbol", // Select only the symbol for currency
        })
        .populate({
          path: "expenses.online.category",
          model: AdminExpenseCategory(adminDbConnection),
          select: "name subcategories", // Select only the name for subcategory
        })
        .populate({
          path: "expenses.offline.category",
          model: AdminExpenseCategory(adminDbConnection),
          select: "name subcategories", // Select only the name for subcategory
        });

      if (!userExpenses) {
        return res.status(404).json({
          success: false,
          message: "No expenses found for this user.",
        });
      }

      const filteredExpenses = [];

      // Filter expenses by the specified date range
      userExpenses.expenses.forEach((expenseGroup) => {
        const expenseDate = new Date(
          expenseGroup.date.split("-").reverse().join("-")
        );

        if (
          expenseDate >= formattedStartDate &&
          expenseDate <= formattedEndDate
        ) {
          filteredExpenses.push({
            date: expenseGroup.date,
            online: expenseGroup.online.map((expense) => ({
              date: expense.date,
              mode: expense.mode,
              amount: expense.amount,
              currency: expense.currency ? expense.currency.symbol : "Unknown", // Handle null currency
              category: expense.category ? expense.category.name : "Unknown", // Handle null category
              subcategory:
                expense.category?.subcategories.find(
                  (sub) =>
                    sub._id.toString() === expense.subcategory?.toString()
                )?.name || "Unknown",

              // Handle null subcategory
              note: expense.note,
            })),
            offline: expenseGroup.offline.map((expense) => ({
              date: expense.date,
              mode: expense.mode,
              amount: expense.amount,
              currency: expense.currency ? expense.currency.symbol : "Unknown", // Handle null currency
              category: expense.category ? expense.category.name : "Unknown", // Handle null category
              subcategory:
                expense.category?.subcategories.find(
                  (sub) =>
                    sub._id.toString() === expense.subcategory?.toString()
                )?.name || "Unknown",

              // Handle null subcategory
              note: expense.note,
            })),
          });
        }
      });

      if (!filteredExpenses.length) {
        return res.status(404).json({
          success: false,
          message: "No expenses found for the specified date range.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Expenses retrieved successfully.",
        expenses: filteredExpenses,
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching expenses.",
        error: error.message,
      });
    }
  };

// Update expense details
/**{
  "date": "05-01-2025",          // New Date
  "mode": "Online",              // Mode to filter (Online or Offline)
  "amount": "300.00",            // New amount (optional)
  "category": "categoryId",      // New category (optional)
  "currency": "currencyId",      // New currency (optional)
  "subcategory": "subcategoryId",// New subcategory (optional)
  "note": "New note",            // New note (optional)
  "expenseId": "expenseId"       // The expenseId to be updated
}
 */
export const updateUserExpense = (userDbConnection) => async (req, res) => {
  const { userId, expenseDate } = req.params;
  const {
    date,
    mode,
    amount,
    category,
    currency,
    subcategory,
    note,
    expenseId,
  } = req.body;

  try {
    const UserExpenseModel = UserExpense(userDbConnection);
    const userExpenses = await UserExpenseModel.findOne({ userId });

    if (!userExpenses) {
      return res.status(404).json({ message: "User expenses not found." });
    }

    // Find the expense date object to update
    const expenseDateObj = userExpenses.expenses.find(
      (exp) => exp.date === expenseDate
    );

    if (!expenseDateObj) {
      return res.status(404).json({ message: "Expense date not found." });
    }

    // Find the expense to update
    const currentModeArray = [
      ...expenseDateObj.online,
      ...expenseDateObj.offline,
    ];
    const expenseIndex = currentModeArray.findIndex(
      (exp) => exp._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found." });
    }

    let expenseToUpdate = currentModeArray[expenseIndex];

    // Update the expense fields with provided data
    expenseToUpdate.date = date ?? expenseToUpdate.date;
    expenseToUpdate.amount = amount ?? expenseToUpdate.amount;
    expenseToUpdate.currency = currency ?? expenseToUpdate.currency;
    expenseToUpdate.category = category ?? expenseToUpdate.category;
    expenseToUpdate.subcategory = subcategory ?? expenseToUpdate.subcategory;
    expenseToUpdate.note = note ?? expenseToUpdate.note;

    // Handle the three possible scenarios:
    // 1. Only the date changes, but mode remains the same
    // 1. Only the date changes, but mode remains the same
    if (expenseToUpdate.date !== expenseDate && expenseToUpdate.mode === mode) {
      // Remove the expense from the old date's mode array by expenseId
      const oldExpenseDateObj = userExpenses.expenses.find(
        (exp) => exp.date === expenseDate
      );
      if (oldExpenseDateObj) {
        const oldModeArray =
          expenseToUpdate.mode === "Online"
            ? oldExpenseDateObj.online
            : oldExpenseDateObj.offline;
        const expenseIndexToRemove = oldModeArray.findIndex(
          (exp) => exp._id.toString() === expenseId
        );
        if (expenseIndexToRemove !== -1) {
          oldModeArray.splice(expenseIndexToRemove, 1); // Remove the expense by expenseId
        }
      }

      // Add the expense to the new date object (create it if necessary)
      let newExpenseDateObj = userExpenses.expenses.find(
        (exp) => exp.date === expenseToUpdate.date
      );

      if (!newExpenseDateObj) {
        newExpenseDateObj = {
          date: expenseToUpdate.date,
          online: [],
          offline: [],
        };
        userExpenses.expenses.push(newExpenseDateObj);
      }

      // Add the expense to the correct mode array (Online or Offline)
      if (expenseToUpdate.mode === "Online") {
        newExpenseDateObj.online.push(expenseToUpdate);
      } else {
        newExpenseDateObj.offline.push(expenseToUpdate);
      }
    }

    // 2. Only the mode changes, but date remains the same
    else if (
      expenseToUpdate.date === expenseDate &&
      expenseToUpdate.mode !== mode
    ) {
      // Remove the expense from the old mode array by expenseId
      const oldExpenseDateObj = userExpenses.expenses.find(
        (exp) => exp.date === expenseDate
      );
      if (oldExpenseDateObj) {
        const oldModeArray =
          expenseToUpdate.mode === "Online"
            ? oldExpenseDateObj.online
            : oldExpenseDateObj.offline;
        const expenseIndexToRemove = oldModeArray.findIndex(
          (exp) => exp._id.toString() === expenseId
        );
        if (expenseIndexToRemove !== -1) {
          oldModeArray.splice(expenseIndexToRemove, 1); // Remove the expense by expenseId
        }
      }

      // Update mode and move it to the correct mode array
      expenseToUpdate.mode = mode;

      // Add the expense to the new mode array (Online or Offline)
      const newModeArray =
        mode === "Online" ? expenseDateObj.online : expenseDateObj.offline;
      newModeArray.push(expenseToUpdate); // Add to the new mode array
    }

    // 3. Both the date and the mode change
    else if (
      expenseToUpdate.date !== expenseDate &&
      expenseToUpdate.mode !== mode
    ) {
      // Remove the expense from the old date's mode array by expenseId
      const oldExpenseDateObj = userExpenses.expenses.find(
        (exp) => exp.date === expenseDate
      );
      if (oldExpenseDateObj) {
        const oldModeArray =
          expenseToUpdate.mode === "Online"
            ? oldExpenseDateObj.online
            : oldExpenseDateObj.offline;
        const expenseIndexToRemove = oldModeArray.findIndex(
          (exp) => exp._id.toString() === expenseId
        );
        if (expenseIndexToRemove !== -1) {
          oldModeArray.splice(expenseIndexToRemove, 1); // Remove the expense by expenseId
        }
      }

      // Update the expense with the new date and mode
      expenseToUpdate.mode = mode;

      // Add the updated expense to the new date object (create if necessary)
      let newExpenseDateObj = userExpenses.expenses.find(
        (exp) => exp.date === expenseToUpdate.date
      );

      if (!newExpenseDateObj) {
        newExpenseDateObj = {
          date: expenseToUpdate.date,
          online: [],
          offline: [],
        };
        userExpenses.expenses.push(newExpenseDateObj);
      }

      // Add the expense to the new mode array (Online or Offline)
      if (expenseToUpdate.mode === "Online") {
        newExpenseDateObj.online.push(expenseToUpdate);
      } else {
        newExpenseDateObj.offline.push(expenseToUpdate);
      }
    }

    // Save the updated user expenses
    await userExpenses.save();
    res.status(200).json({
      message: "Expense updated successfully.",
      updatedExpense: expenseToUpdate,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense", error });
  }
};

// delete the perticulate expense from user expense collection
/*{
  "expenseId": "677a93ffcaea2c265d0b0444",  // The ID of the expense to delete
  "mode": "Online"                           // Mode of the expense (Online or Offline)
}
 */
export const deleteUserExpense = (userDbConnection) => async (req, res) => {
  const { userId, expenseDate } = req.params;
  const { expenseId, mode } = req.body;

  try {
    const UserExpenseModel = UserExpense(userDbConnection);
    const userExpenses = await UserExpenseModel.findOne({ userId });

    if (!userExpenses) {
      return res.status(404).json({ message: "User expenses not found." });
    }

    // Find the expense date object to delete from
    const expenseDateObj = userExpenses.expenses.find(
      (exp) => exp.date === expenseDate
    );

    if (!expenseDateObj) {
      return res.status(404).json({ message: "Expense date not found." });
    }

    // Filter the expenses by mode
    const currentModeArray = mode
      ? expenseDateObj[mode.toLowerCase()] // "online" or "offline"
      : [...expenseDateObj.online, ...expenseDateObj.offline]; // Combine both if no mode is specified

    // Find the expense index to remove
    const expenseIndex = currentModeArray.findIndex(
      (exp) => exp._id.toString() === expenseId
    );

    if (expenseIndex === -1) {
      return res.status(404).json({ message: "Expense not found." });
    }

    // Remove the expense from the selected mode array
    if (mode === "Online") {
      expenseDateObj.online.splice(expenseIndex, 1);
    } else if (mode === "Offline") {
      expenseDateObj.offline.splice(expenseIndex, 1);
    }

    // Save the updated user expenses
    await userExpenses.save();

    res.status(200).json({
      message: "Expense deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
