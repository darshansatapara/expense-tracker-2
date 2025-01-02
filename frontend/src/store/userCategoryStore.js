import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import { toast } from "react-toastify";

export const userCategoryStore = create((set) => ({
  userCategories: {},
  isLoadingCategories: false,
  isPostingCategory: false,
  isUpdatingCategory: false,
  isDeletingCategory: false,

  // Fetch expense categories by userId
  fetchExpenseCategories: async (userId) => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        `/usercategories/expenseCategories/get/${userId}`
      );
      set({ userCategories: { ...res.data } });
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch expense categories!"
      );
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  // Fetch income categories by userId
  fetchIncomeCategories: async (userId) => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        `/usercategories/incomeCategories/get/${userId}`
      );
      set({ userCategories: { ...res.data } });
    } catch (error) {
      console.error("Error fetching income categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch income categories!"
      );
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  // Add an expense category
  addExpenseCategory: async (data) => {
    set({ isPostingCategory: true });
    console.log(data);
    try {
      const res = await axiosInstance.post(
        `/usercategories/addExpenseCategory`,
        data
      );

      set((state) => ({
        userCategories: { ...state.userCategories, expense: res.data },
      }));
      toast.success("Expense category added successfully!");
    } catch (error) {
      console.error("Error adding expense category:", error);
      toast.error(
        error.response?.data?.message || "Failed to add expense category!"
      );
    } finally {
      set({ isPostingCategory: false });
    }
  },

  // Add currency and budget
  addCurrencyAndBudget: async (data) => {
    set({ isPostingCategory: true });
    try {
      const res = await axiosInstance.post(
        `/usercategories/addCurrencyAndBudget`,
        data
      );
      set((state) => ({
        userCategories: {
          ...state.userCategories,
          currencyAndBudget: res.data,
        },
      }));
      toast.success("Currency and budget added successfully!");
    } catch (error) {
      console.error("Error adding currency and budget:", error);
      toast.error(
        error.response?.data?.message || "Failed to add currency and budget!"
      );
    } finally {
      set({ isPostingCategory: false });
    }
  },

  // Update expense categories
  updateExpenseCategory: async (userId, data) => {
    set({ isUpdatingCategory: true });
    try {
      const res = await axiosInstance.put(
        `/usercategories/expenseCategory/updateExpenseCategory/${userId}`,
        data
      );
      set((state) => ({
        userCategories: { ...state.userCategories, expense: res.data },
      }));
      toast.success("Expense category updated successfully!");
    } catch (error) {
      console.error("Error updating expense category:", error);
      toast.error(
        error.response?.data?.message || "Failed to update expense category!"
      );
    } finally {
      set({ isUpdatingCategory: false });
    }
  },

  // Delete expense categories
  deleteExpenseCategory: async (userId) => {
    set({ isDeletingCategory: true });
    try {
      await axiosInstance.delete(
        `/usercategories/expenseCategory/deleteExpenseCategory/${userId}`
      );
      set((state) => {
        const updatedCategories = { ...state.userCategories };
        delete updatedCategories.expense;
        return { userCategories: updatedCategories };
      });
      toast.success("Expense category deleted successfully!");
    } catch (error) {
      console.error("Error deleting expense category:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete expense category!"
      );
    } finally {
      set({ isDeletingCategory: false });
    }
  },

  // Delete currency category
  deleteCurrencyCategory: async (userId) => {
    set({ isDeletingCategory: true });
    try {
      await axiosInstance.delete(
        `/usercategories/currencyCategory/deleteCureencyCategory/${userId}`
      );
      set((state) => {
        const updatedCategories = { ...state.userCategories };
        delete updatedCategories.currencyAndBudget;
        return { userCategories: updatedCategories };
      });
      toast.success("Currency category deleted successfully!");
    } catch (error) {
      console.error("Error deleting currency category:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete currency category!"
      );
    } finally {
      set({ isDeletingCategory: false });
    }
  },
}));
