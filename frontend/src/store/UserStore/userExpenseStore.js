import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

const useUserExpenseStore = create((set) => ({
  userExpenses: [], // State to store user expenses
  loading: false, // State to track the loading status
  error: null, // State to track any errors

  // Fetch user expenses based on userId, startDate, and endDate
  fetchUserExpenses: async (userId, startDate, endDate) => {
    // console.log(userId, startDate, endDate);
    set({ loading: true, error: null }); // Set loading to true and clear any errors
    try {
      const response = await axiosInstance.get(
        `/expense/getExpenses/${userId}/${startDate}/${endDate}` // Adjust the endpoint as needed
      );

      console.log(response.data.expenses, "user expense");
      if (response.data.success) {
        set({
          userExpenses: response.data.expenses, // Update the state with fetched expenses
          loading: false,
          error: null,
        });
      } else {
        set({
          userExpenses: [],
          loading: false,
          error: response.data.message || "Failed to fetch expenses.",
        });
      }
    } catch (error) {
      set({
        userExpenses: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "An error occurred while fetching expenses.",
      });
    }
  },

  // Clear the expenses data
  clearUserExpenses: () => set({ userExpenses: [], error: null }),
}));

export default useUserExpenseStore;
