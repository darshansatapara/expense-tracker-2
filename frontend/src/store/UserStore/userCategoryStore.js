import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

export const userCategoryStore = create((set) => ({
  isPostingCategory: false,

  /**
   * Fetch user categories.
   */
  fetchUserCategories: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/usercategories/expenseCategories/get/${userId}`
      );
      // console.log(userId, response.data.data);
      return { data: response.data.data };
    } catch (error) {
      console.error("Error fetching expense categories:", error);
    }
  },

// Fetch all currency and budget
  fetchCurrencyAndBudget: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/usercategories/currencyAndBudget/get/${userId}`
      );
      // console.log(response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching currency and budget:", error);
    }
  },
  // Add an expense category
  addExpenseCategory: async (data) => {
    set({ isPostingCategory: true });
    // console.log(data);
    try {
      await axiosInstance.post(`/usercategories/addExpenseCategory`, data);
    } catch (error) {
      console.error("Error adding expense category:", error);
    } finally {
      set({ isPostingCategory: false });
    }
  },

  // Add currency and budget
  addCurrencyAndBudget: async (data) => {
    set({ isPostingCategory: true });
    try {
      // console.log("Adding currency and budget", data);
      await axiosInstance.post(`/usercategories/addCurrencyAndBudget`, data);
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    } finally {
      set({ isPostingCategory: false });
    }
  },
}));

      console.log("User categories response:", userRes.data);
      return userRes;
    } catch (error) {
      console.error("Error fetching user categories:", error);
    }
  },

  //  update categories
  updateUserCategories: async (userId, newExpenseCategory) => {
    if (!userId || !Array.isArray(newExpenseCategory)) {
      console.error(
        "Invalid parameters: userId and newExpenseCategory are required."
      );
      return false;
    }

    // Validate and fix category structure
    const updatedCategories = newExpenseCategory
      .map((category) => {
        if (!category.categoryId || !Array.isArray(category.subcategoryIds)) {
          console.error("Invalid category structure:", category);
          return null; // Mark invalid categories
        }

        return {
          categoryId:
            typeof category.categoryId === "object"
              ? category.categoryId._id
              : category.categoryId,
          subcategoryIds: category.subcategoryIds.map((sub) =>
            typeof sub === "object" ? sub.id || sub._id : sub
          ),
        };
      })
      .filter((category) => category !== null); // Remove invalid categories

    if (updatedCategories.length === 0) {
      console.error("No valid categories to update.");
      return false;
    }

    console.log("Updating categories for user:", userId);
    console.log("New categories:", updatedCategories);

    try {
      const response = await axiosInstance.put(
        `/usercategories/expenseCategory/updateExpenseCategory/${userId}`,
        { newExpenseCategory: updatedCategories }
      );

      console.log("Categories updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      return false; // Indicate failure
    }
  },






  /**
   * Update user categories & subcategories.
   */
  // updateExpenseCategories: async (userId, newExpenseCategory) => {
  //   if (!userId || !Array.isArray(newExpenseCategory)) {
  //     console.error("Invalid parameters: userId and newExpenseCategory are required.");
  //     return;
  //   }

  //   try {
  //     const response = await axiosInstance.put(
  //       `/usercategories/expenseCategories/update/${userId}`, // API endpoint with userId
  //       console.log(response)
  //       {
  //         newExpenseCategory, // Send the new expense categories in the request body
  //       }
  //     );
  //     console.log("Categories updated successfully:", response.data);
  //   } catch (error) {
  //     console.error("Error updating category:", error);
  //   }
  // },
  
// Add an expense category
addExpenseCategory: async (data) => {
  set({ isPostingCategory: true });
  // console.log(data);
  try {
    await axiosInstance.post(`/usercategories/addExpenseCategory`, data);
  } catch (error) {
    console.error("Error adding expense category:", error);
  } finally {
    set({ isPostingCategory: false });
  }
},

 // Add currency and budget
 addCurrencyAndBudget: async (data) => {
  set({ isPostingCategory: true });
  try {
    // console.log("Adding currency and budget", data);
    await axiosInstance.post(`/usercategories/addCurrencyAndBudget`, data);
  } catch (error) {
    console.error("Error adding currency and budget:", error);
  } finally {
    set({ isPostingCategory: false });
  }
},

  /**
   * Update currency and budget.
   */
  // updateCurrencyAndBudget: async (userId, payload) => {
  //   set({ isPostingCategory: true });
  //   try {
  //     console.log("Updating currency and budget", userId);
  //     const res = await axiosInstance.put(
  //       `/usercategories/currencyAndBudget/updateCurrency/${userId}`,
  //       payload
  //     );

  //     if (res.success) {
  //       console.log(res.data);
  //     }
  //   } catch (error) {
  //     console.error("Error updating currency and budget:", error);
  //   } finally {
  //     set({ isPostingCategory: false });
  //   }
  // },

  /**
   * Delete currency and budget.
   */
  // deleteCurrencyAndBudget: async (userId, payload) => {
  //   try {
  //     console.log("Deleting currency and budget", payload, userId);
  //     const res = await axiosInstance.delete(
  //       `/usercategories/currencyCategory/deleteCurrencyCategory/${userId}`,
  //       { data: payload } // Wrap payload in 'data'
  //     );

  //     if (res.success) {
  //       console.log(res.data);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting currency and budget:", error);
  //   }
  // },
}));
