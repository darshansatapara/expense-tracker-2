import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";

export const userCategoryStore = create((set, get) => ({
  userCategories: [],
  isPostingCategory: false,

  //  fetech user category
  fetchUserCategories: async (userId) => {
    try {
      const userRes = await axiosInstance.get(
        `/usercategories/expenseCategories/get/${userId}`
      );
      // console.log("User categories response:", userRes.data);
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

    // console.log("Updating categories for user:", userId);
    // console.log("New categories:", updatedCategories);

    try {
      const response = await axiosInstance.put(
        `/usercategories/expenseCategory/updateExpenseCategory/${userId}`,
        { newExpenseCategory: updatedCategories }
      );

      // console.log("Categories updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      if (error.response) {
        console.error("Server Response:", error.response.data);
      }
      return false; // Indicate failure
    }
  },

  fetchUserExpenseCategories: async (userId) => {
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

  updateCurrencyAndBudget: async (userId, payload) => {
    set({ isPostingCategory: true });
    try {
      const res = await axiosInstance.put(
        `/usercategories/currencyAndBudget/updateCurrency/${userId}`,
        payload
      );
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    } finally {
      set({ isPostingCategory: false });
    }
  },

  //delete currency and budget
  deleteCurrencyAndBudget: async (userId, payload) => {
    try {
      const res = await axiosInstance.delete(
        `/usercategories/currencyCategory/deleteCurrencyCategory/${userId}`,
        { data: payload } // Wrap payload in a config object under 'data'
      );
    } catch (error) {
      console.error("Error deleting currency and budget:", error);
    }
  },
}));
