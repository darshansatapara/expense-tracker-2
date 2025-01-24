import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

export const fetchUserCategory = create((set) => ({
  fetchUserExpenseCategories: async (userId) => {
    try {
      const response = await axiosInstance.get(
        `/usercategories/expenseCategories/get/${userId}`
      );
      console.log(userId, response.data.data);
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
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching currency and budget:", error);
    }
  },
}));
