import UserIncome from "../../models/UserModel/UserIncomeDataModel.js";

// Controller for adding income
export const addIncome = (userDbConnection) => async (req, res) => {
  const { userId, date, mode, amount, category, description } = req.body;

  if (!userId || !date || !mode || !amount || !category) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields.",
    });
  }

  const newIncomeEntry = {
    date,
    mode,
    amount,
    category,
    description,
  };

  try {
    let userIncome = await UserIncome.findOne({ userId });

    if (!userIncome) {
      userIncome = new UserIncome({
        userId,
        incomes: [
          {
            date,
            online: mode.toLowerCase() === "online" ? [newIncomeEntry] : [],
            offline: mode.toLowerCase() === "offline" ? [newIncomeEntry] : [],
          },
        ],
      });
    } else {
      const incomeDateEntry = userIncome.incomes.find(
        (income) => income.date === date
      );

      if (incomeDateEntry) {
        if (mode.toLowerCase() === "online") {
          incomeDateEntry.online.push(newIncomeEntry);
        } else {
          incomeDateEntry.offline.push(newIncomeEntry);
        }
      } else {
        userIncome.incomes.push({
          date,
          online: mode.toLowerCase() === "online" ? [newIncomeEntry] : [],
          offline: mode.toLowerCase() === "offline" ? [newIncomeEntry] : [],
        });
      }
    }

    await userIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully.",
      data: userIncome,
    });
  } catch (error) {
    console.error("Error adding income:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Controller for updating income
export const updateIncome = (userDbConnection) => async (req, res) => {
  const { userId, date } = req.params;
  const { amount, category, description, incomeId, mode } = req.body;

  try {
    const userIncome = await UserIncome.findOne({ userId });

    if (!userIncome) {
      return res.status(404).json({
        success: false,
        message: "User income document not found.",
      });
    }

    const incomeGroup = userIncome.incomes.find((group) => group.date === date);

    if (!incomeGroup) {
      return res.status(404).json({
        success: false,
        message: "No income entry found for the specified date.",
      });
    }

    let incomeItem, currentModeArray, itemIndex;

    if (incomeGroup.online) {
      itemIndex = incomeGroup.online.findIndex(
        (item) => item._id.toString() === incomeId
      );
      if (itemIndex !== -1) {
        incomeItem = incomeGroup.online[itemIndex];
        currentModeArray = incomeGroup.online;
      }
    }

    if (!incomeItem && incomeGroup.offline) {
      itemIndex = incomeGroup.offline.findIndex(
        (item) => item._id.toString() === incomeId
      );
      if (itemIndex !== -1) {
        incomeItem = incomeGroup.offline[itemIndex];
        currentModeArray = incomeGroup.offline;
      }
    }

    if (!incomeItem) {
      return res.status(404).json({
        success: false,
        message: "Specified income item not found within the mode.",
      });
    }

    if (amount !== undefined) incomeItem.amount = amount;
    if (category !== undefined) incomeItem.category = category;
    if (description !== undefined) incomeItem.description = description;

    if (incomeItem.mode !== mode) {
      currentModeArray.splice(itemIndex, 1);

      incomeItem.mode = mode;
      const newModeArray =
        mode.toLowerCase() === "online"
          ? incomeGroup.online
          : incomeGroup.offline;
      newModeArray.push(incomeItem);
    }

    await userIncome.save();

    res.status(200).json({
      success: true,
      message: "Income updated successfully.",
      data: incomeItem,
    });
  } catch (error) {
    console.error("Error updating income:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the income.",
    });
  }
};

// Controller for fetching incomes by date range
export const getIncomes = (userDbConnection) => async (req, res) => {
  const { userId, startDate, endDate } = req.params;

  try {
    const userIncomeData = await UserIncome.findOne({ userId });

    if (!userIncomeData) {
      return res.status(404).json({
        success: false,
        message: "No income data found for the user.",
      });
    }

    const incomeByDate = {};

    userIncomeData.incomes.forEach((incomeDay) => {
      const incomeDate = incomeDay.date;

      if (incomeDate >= startDate && incomeDate <= endDate) {
        incomeByDate[incomeDate] = incomeByDate[incomeDate] || {
          online: [],
          offline: [],
        };

        incomeByDate[incomeDate].online.push(...incomeDay.online);
        incomeByDate[incomeDate].offline.push(...incomeDay.offline);
      }
    });

    const organizedData = Object.entries(incomeByDate).map(
      ([date, incomes]) => ({
        date,
        ...incomes,
      })
    );

    res.status(200).json({
      success: true,
      incomes: organizedData,
    });
  } catch (error) {
    console.error("Error fetching income data:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving income data.",
      error: error.message,
    });
  }
};
