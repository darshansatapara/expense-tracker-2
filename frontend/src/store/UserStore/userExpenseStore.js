import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";
import { formatData } from "../../components/commonComponent/formatEAndIData.js";

const useUserExpenseStore = create((set) => ({
  userExpenses: [],
expenseAnalysis: null,
monthlyExpenseTotals: [],

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
        // console.log(formattedData, "user expense");
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

  updateUserExpense: async (data, userId, objectDate) => {
    try {
      await axiosInstance.put(
        `/expense/updateExpense/${userId}/${objectDate}`,
        data
      );
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  },

  // expense analysis
    // Fetch user expense analysis data based on userId, startDate, and endDate
    fetchExpenseAnalysis: async (userId, startDate, endDate) => {
      set({ loading: true, error: null });
      try {
        const response = await axiosInstance.get(
          `/expense/getExpensesAnalysis/${userId}/${startDate}/${endDate}`
        );
        // console.log("analysis",response.data)
  
        if (response.data.success) {
          set({
            expenseAnalysis: response.data.data,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        set({
          expenseAnalysis: null,
          loading: false,
          error:
            error.response?.data?.message ||
            "An error occurred while fetching expense analysis.",
        });
      }
    },
  
     // monthly expense total
  getMonthlyExpenseTotals: async (userId, year) => {
    // console.log("Function called ✅");
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/expense/getMonthlyExpenseTotals/${userId}/${year}`
      );
      // console.log("API success:", response.data); // Second checkpoint

      if (response.data.success) {
        // You can optionally format the data here
        set({
          monthlyExpenseTotals: response.data.data.monthlyTotals,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        monthlyExpenseTotals: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "An error occurred while fetching monthly expense totals.",
      });
    }
  },
}));

export default useUserExpenseStore;
