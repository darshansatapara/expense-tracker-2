import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

export const userCategoryStore = create((set) => ({
 
  isPostingCategory: false,

  // Add an expense category
  addExpenseCategory: async (data) => {
    set({ isPostingCategory: true });
    console.log(data);
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
      console.log("Adding currency and budget", data);
      await axiosInstance.post(`/usercategories/addCurrencyAndBudget`, data);
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    } finally {
      set({ isPostingCategory: false });
    }
  },
}));
