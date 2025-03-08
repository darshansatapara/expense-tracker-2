import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

export const userCategoryStore = create((set) => ({
  isPostingCategory: false,

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

  // Add currency and budget
  updateCurrencyAndBudget: async (userId, payload) => {
    set({ isPostingCategory: true });
    try {
      console.log("Adding currency and budget", userId);
      const res = await axiosInstance.put(
        `/usercategories/currencyAndBudget/updateCurrency/${userId}`,
        payload
      );

      if (res.success) {
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    } finally {
      set({ isPostingCategory: false });
    }
  },

  deleteCurrencyAndBudget: async (userId, payload) => {
    try {
      console.log(payload, userId);
      const res = await axiosInstance.delete(
        `/usercategories/currencyCategory/deleteCurrencyCategory/${userId}`,
        { data: payload } // Wrap payload in a config object under 'data'
      );

      if (res.success) {
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error deleting currency and budget:", error);
    }
  },
}));
