import UserExpense from "../../models/UserModel/UserExpenseDataModel.js";

// Add an expense
export const addExpense = async (req, res) => {
  const { userId, date, mode, amount, category, subcategory, description } =
    req.body;

  try {
    let userExpense = await UserExpense.findOne({ userId });

    const newExpense = {
      date,
      mode,
      amount,
      category,
      subcategory,
      description,
    };

    // If the user doesn't have any expenses yet
    if (!userExpense) {
      userExpense = new UserExpense({
        userId,
        expenses: [{ date, online: [], offline: [] }],
      });

      if (mode === "Online") {
        userExpense.expenses[0].online.push(newExpense);
      } else {
        userExpense.expenses[0].offline.push(newExpense);
      }
    } else {
      // Check if an expense for the given date exists
      let expenseForDate = userExpense.expenses.find(
        (exp) => exp.date === date
      );

      if (expenseForDate) {
        // Add to existing date's mode array
        if (mode === "Online") {
          expenseForDate.online.push(newExpense);
        } else {
          expenseForDate.offline.push(newExpense);
        }
      } else {
        // Create a new date entry
        const newDateEntry = {
          date,
          online: mode === "Online" ? [newExpense] : [],
          offline: mode === "Offline" ? [newExpense] : [],
        };
        userExpense.expenses.push(newDateEntry);
      }
    }

    await userExpense.save();
    res
      .status(201)
      .json({ message: "Expense added successfully", userExpense });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({ message: "Error adding expense", error });
  }
};

// Get expenses for a user within a date range
export const getExpenses = async (req, res) => {
  const { userId, startDate, endDate } = req.params;

  try {
    const userExpenses = await UserExpense.findOne({ userId });

    if (!userExpenses) {
      return res
        .status(404)
        .json({ message: "No expenses found for this user" });
    }

    const expensesByDate = {};

    // Group expenses by date
    userExpenses.expenses.forEach((expenseGroup) => {
      const expenseDate = expenseGroup.date;

      // Only process dates within the range
      if (expenseDate >= startDate && expenseDate <= endDate) {
        expensesByDate[expenseDate] = expensesByDate[expenseDate] || {
          online: [],
          offline: [],
        };

        // Add expenses to respective arrays
        expensesByDate[expenseDate].online.push(...expenseGroup.online);
        expensesByDate[expenseDate].offline.push(...expenseGroup.offline);
      }
    });

    // Convert the object to an array format if needed
    const organizedExpenses = Object.entries(expensesByDate).map(
      ([date, expenses]) => ({
        date,
        ...expenses,
      })
    );

    if (!organizedExpenses.length) {
      return res
        .status(404)
        .json({ message: "No expenses found for this date range" });
    }

    res.status(200).json({
      success: true,
      expenses: organizedExpenses,
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

// Update expense details
export const updateExpense = async (req, res) => {
  const { userId, expenseDate } = req.params;
  const { mode, amount, category, subcategory, description, expenseId } =
    req.body;

  try {
    const userExpenses = await UserExpense.findOne({ userId });

    if (!userExpenses) {
      return res.status(404).json({ message: "User expenses not found." });
    }

    const expenseDateObj = userExpenses.expenses.find(
      (exp) => exp.date === expenseDate
    );

    if (!expenseDateObj) {
      return res.status(404).json({ message: "Expense date not found." });
    }

    // Find the expense and update
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
    expenseToUpdate.amount = amount ?? expenseToUpdate.amount;
    expenseToUpdate.category = category ?? expenseToUpdate.category;
    expenseToUpdate.subcategory = subcategory ?? expenseToUpdate.subcategory;
    expenseToUpdate.description = description ?? expenseToUpdate.description;

    // Handle mode change if necessary
    if (expenseToUpdate.mode !== mode) {
      const oldModeArray =
        expenseToUpdate.mode === "Online"
          ? expenseDateObj.online
          : expenseDateObj.offline;
      oldModeArray.splice(expenseIndex, 1);

      expenseToUpdate.mode = mode;
      const newModeArray =
        mode === "Online" ? expenseDateObj.online : expenseDateObj.offline;
      newModeArray.push(expenseToUpdate);
    }

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
