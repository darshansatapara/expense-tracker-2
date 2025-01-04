import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { toast } from "react-toastify";

export const adminCategoryStore = create((set) => ({
  currencyCategories: [],
  expenseCategories: [],
  incomeCategories: [],
  isLoadingCategories: false,

  /**
   * Fetch all admin categories.
   */
  fetchCurrencyCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        "/admincategories/allcurrencyCategoryIsActive"
      );
      set({ currencyCategories: res.data });
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching currency categories:", error);
      toast.error("Failed to fetch currency categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  fetchExpenseCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        "/admincategories/allexpenseCategoryIsActive"
      );
      console.log(res.data);
      set({
        expenseCategories: res.data,
      });
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      toast.error("Failed to fetch expense categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  fetchIncomeCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get("/admincategories/allincomeCategory");
      set({ incomeCategories: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching income categories:", error);
      toast.error("Failed to fetch income categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },
}));
