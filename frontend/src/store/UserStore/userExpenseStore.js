import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { formatData } from "../../components/commonComponent/formatEAndIData.js";

const useUserExpenseStore = create((set) => ({
  userExpenses: [],

  // as per date range
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
        console.log(formattedData, "user expense");
        set({
          userExpenses: formattedData,
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

  addUserExpense: async (data) => {
    try {
      // console.log("Adding currency and budget", data);
      await axiosInstance.post(`/expense/addExpense`, data);
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    }
  },
}));

export default useUserExpenseStore;
