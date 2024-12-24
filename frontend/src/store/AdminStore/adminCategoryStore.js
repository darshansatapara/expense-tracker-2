import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { toast } from "react-toastify";

export const adminCategoryStore = create((set) => ({
  adminCategories: [],
  isLoadingCategories: false,
  isUpdatingCategory: false,
  isDeletingCategory: false,

  /**
   * Fetch all admin categories.
   */
  fetchAdminCategories: async () => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get("/admincategories/getallcategories");
      set({ adminCategories: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching admin categories:", error);
      toast.error("Failed to fetch admin categories!");
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  /**
   * Add or update categories in the database.
   * @param {Object} data - The data to save or update (contains name and categories).
   */
  postAdminCategories: async (data) => {
    try {
      const res = await axiosInstance.post(
        "/admincategories/addcategories",
        data
      );
      toast.success("Category saved successfully!");
      set((state) => ({
        adminCategories: {
          ...state.adminCategories,
          [data.name]: data.categories,
        },
      }));
    } catch (error) {
      console.error("Error posting admin categories:", error);
      toast.error("Failed to save category!");
    }
  },

  /**
   * Update an existing category.
   * @param {String} categoryName - The name of the category to update.
   * @param {Object} data - The updated category data.
   */
  updateAdminCategory: async (categoryName, data) => {
    set({ isUpdatingCategory: true });
    try {
      const res = await axiosInstance.put(
        `/admincategories/updatecategories/${categoryName}`,
        data
      );
      toast.success("Category updated successfully!");
      set((state) => ({
        adminCategories: {
          ...state.adminCategories,
          [categoryName]: data.categories,
        },
      }));
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error("Failed to update category!");
    } finally {
      set({ isUpdatingCategory: false });
    }
  },

  /**
   * Delete an existing category.
   * @param {String} categoryName - The name of the category to delete.
   */
  deleteAdminCategory: async (categoryName) => {
    set({ isDeletingCategory: true });
    try {
      await axiosInstance.delete(
        `/admincategories/deletecategories/${categoryName}`
      );
      toast.success("Category deleted successfully!");
      set((state) => {
        const newCategories = { ...state.adminCategories };
        delete newCategories[categoryName];
        return { adminCategories: newCategories };
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category!");
    } finally {
      set({ isDeletingCategory: false });
    }
  },
}));
