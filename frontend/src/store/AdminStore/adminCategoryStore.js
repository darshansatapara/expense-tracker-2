import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { toast } from "react-toastify";

export const adminCategoryStore = create((set, get) => ({
  allCurrencyCategories: [],
  categories: [],
  incomeCategories: [],
  userCategories: [],
  // matchedCategories: [], // Matched categories
  // unmatchedCategories: [], // Unmatched categories
  // unselectedCategories: [],
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
      set({ allCurrencyCategories: res.data });
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

  fetchIncomeCategoriesIsActive: async () => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        "/admincategories/allincomeCategoryIsActive"
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error fetching income categories:", error);
      toast.error("Failed to fetch income categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  /**
   * Fetch all active admin categories.
   */
  fetchActiveCategories: async () => {
    set({ isLoadingCategories: true, error: null });
    try {
      const response = await axiosInstance.get("/admincategories/allexpenseCategoryIsActive");
      console.log("Active categories response:", response.data);
      set({ categories: response.data.categories, isLoadingCategories: false });
    } catch (error) {
      console.error("Error fetching active categories:", error);
      toast.error("Failed to fetch active categories!");
      set({ isLoadingCategories: false });
    }
  },

  /**
   * Fetch user categories.
   */
  fetchUserCategories: async (userId) => {
    set({ isLoadingCategories: true });
    try {
      const userRes = await axiosInstance.get(`/usercategories/expenseCategories/get/${userId}`);
      console.log("User categories response:", userRes.data);
  
      const userCategories = userRes.data?.data?.expenseCategories || [];
      set({ userCategories });
    } catch (error) {
      console.error("Error fetching user categories:", error);
      toast.error("Failed to fetch user categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },


}));
