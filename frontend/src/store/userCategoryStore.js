import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import { toast } from "react-toastify";

export const userCategoryStore = create((set) => ({
  userCategories: {},
  isLoadingCategories: false,
  isPostingCategory: false,
  isUpdatingCategory: false,
  isDeletingCategory: false,

  // Fetch user categories by userId
  fetchUserCategories: async (userId) => {
    set({ isLoadingCategories: true });
    try {
      const res = await axiosInstance.get(
        `/usercategories/getallcategories/${userId}`
      );
      set({ userCategories: res.data });
    } catch (error) {
      console.error("Error fetching user categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch categories!"
      );
    } finally {
      set({ isLoadingCategories: false });
    }
  },

  // Post user categories (Create or Update)
  postUserCategories: async (data) => {
    set({ isPostingCategory: true });
    try {
      const res = await axiosInstance.post(
        "/usercategories/addcategories",
        data
      );
      set({ userCategories: res.data });
      toast.success("Categories saved successfully!");
    } catch (error) {
      console.error("Error posting user categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to save categories!"
      );
    } finally {
      set({ isPostingCategory: false });
    }
  },

  // Update user categories
  updateUserCategories: async (categoryId, data) => {
    set({ isUpdatingCategory: true });
    try {
      const res = await axiosInstance.put(
        `/usercategories/updatecategories/${categoryId}`,
        data
      );
      set({ userCategories: res.data });
      toast.success("Categories updated successfully!");
    } catch (error) {
      console.error("Error updating user categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to update categories!"
      );
    } finally {
      set({ isUpdatingCategory: false });
    }
  },

  // Delete user categories
  deleteUserCategories: async (categoryId) => {
    set({ isDeletingCategory: true });
    try {
      await axiosInstance.delete(
        `/usercategories/deletecategories/${categoryId}`
      );
      set({ userCategories: {} }); // Reset categories after deletion
      toast.success("Categories deleted successfully!");
    } catch (error) {
      console.error("Error deleting user categories:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete categories!"
      );
    } finally {
      set({ isDeletingCategory: false });
    }
  },
}));
