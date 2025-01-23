import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

const useUserExpenseStore = create((set) => ({
  userExpenses: [],

  // as per date range
  // Fetch user expenses based on userId, startDate, and endDate
  fetchUserExpenses: async (userId, startDate, endDate) => {
    console.log(userId, startDate, endDate);
    // Set loading to true and clear any errors
    try {
      const response = await axiosInstance.get(
        `/expense/getExpenses/${userId}/${startDate}/${endDate}` 
      );

      console.log(response.data.expenses);
      if (response.data.success) {
        set({
          userExpenses: response.data.expenses, // Update the state with fetched expenses
        });
      } else {
        set({
          userExpenses: [],
        });
      }
    } catch (error) {
      set({
        userExpenses: [],
      });
    }
  },
}));

export default useUserExpenseStore;
