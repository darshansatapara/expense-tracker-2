import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { formatData } from "../../components/commonComponent/formatEAndIData.js";

const useUserExpenseStore = create((set) => ({
  userExpenses: [], // State to store user expenses
  weeklyUserExpenses: [], // State to store
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
      // console.log(response.data.expenses);
      if (response.data.success) {
        // Format the data using the utility function
        const formattedData = formatData(
          response.data.expenses,
          startDate,
          endDate
        );
        // console.log(formattedData, "user expense");
        set({
          userExpenses: formattedData, // Update the state with formatted expenses
          loading: false,
          error: null,
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

  fetchUserWeeklyExpenses: async (userId, startDate, endDate) => {
    console.log(userId, startDate, endDate);
    set({ loading: true, error: null }); // Set loading to true and clear any errors
    try {
      const response = await axiosInstance.get(
        `/expense/getExpenses/${userId}/${startDate}/${endDate}` // Adjust the endpoint as needed
      );

      console.log(response.data.expenses);
      if (response.data.success) {
        set({
          weeklyUserExpenses: response.data.expenses, // Update the state with fetched expenses
          loading: false,
          error: null,
        });
      } else {
        set({
          weeklyUserExpenses: [],
          loading: false,
          error: response.data.message || "Failed to fetch expenses.",
        });
      }
    } catch (error) {
      set({
        weeklyUserExpenses: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "An error occurred while fetching expenses.",
      });
    }
  },
}));

export default useUserExpenseStore;
