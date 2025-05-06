import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";
import { toast } from "react-toastify";

export const adminCategoryStore = create((set, get) => ({
  allCurrencyCategories: [],
  // categories: [],
  // adminCategories:[],
  incomeCategories: [],
  expenseCategories: [],
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
      // console.log(res.data);
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
      // console.log(res.data);
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
      // console.log(res.data);
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
      const response = await axiosInstance.get(
        "/admincategories/allexpenseCategoryIsActive"
      );
      // console.log("Active categories response:", response.data);
      return response;
    } catch (error) {
      console.error("Error fetching active categories:", error);
      toast.error("Failed to fetch active categories!");
      set({ isLoadingCategories: false });
    }
  },
  // Update categories after selection toggle
  // ✅ Update categories and subcategories
  updateCategoriesAndSubcategories: async (updatedCategories) => {
    try {
      const response = await axiosInstance.put(
        "/admincategories/updateExpenseCategoriesAndSubcategories",
        { updatedcategories: updatedCategories }
      );
      // console.log("Update response:", response.data);

      if (response.data.success) {
        // Update the store state with new categories
        set((state) => ({
          categories: state.categories.map((category) => {
            const updatedCategory = updatedCategories.find(
              (c) => c.categoryId === category._id
            );
            if (updatedCategory) {
              return {
                ...category,
                name: updatedCategory.categoryNewName || category.name,
                subcategories: category.subcategories.map((sub) => {
                  const updatedSub = updatedCategory.subcategories?.find(
                    (s) => s.subcategoryId === sub._id
                  );
                  return updatedSub
                    ? { ...sub, name: updatedSub.subCategorynewName }
                    : sub;
                }),
              };
            }
            return category;
          }),
        }));
      }
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  },

  // Other functions (fetch categories, etc.) remain unchanged...
}));
