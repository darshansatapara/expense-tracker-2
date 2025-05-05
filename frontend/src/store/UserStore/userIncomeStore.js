import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";
import { formatData } from "../../components/commonComponent/formatEAndIData.js";

const useUserIncomeStore = create((set) => ({
  userIncomes: [], // State to store user incomes
  loading: false, // State to track the loading status
  error: null, // State to track any errors
  monthlyIncomeTotals:[],

  // Fetch user incomes based on userId, startDate, endDate, and profession
  fetchUserIncomes: async (userId, startDate, endDate, profession) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/income/getIncomes/${userId}/${startDate}/${endDate}/${profession}`
      );

      // console.log(response.data.incomes);
      // console.log(response.data.incomes);
      if (response.data.success) {
        // Format the fetched incomes using formatData
        const formattedData = formatData(
          response.data.incomes,
          startDate,
          endDate
        );

        set({
          userIncomes: formattedData, // Update the state with formatted incomes
          loading: false,
          error: null,
        });
      } else {
        set({
          userIncomes: [],
          loading: false,
          error: response.data.message || "Failed to fetch incomes.",
        });
      }
    } catch (error) {
      set({
        userIncomes: [],
        loading: false,
        error:
          error.response?.data?.message ||
          "An error occurred while fetching incomes.",
      });
    }
  },

  addUserIncome: async (data) => {
    try {
      // console.log("Adding currency and budget", data);
      await axiosInstance.post(`/income/addIncome/${data.userId}`, data);
    } catch (error) {
      console.error("Error adding currency and budget:", error);
    }
  },

  updateUserIncome: async (data, userId, objectDate) => {
    try {
      await axiosInstance.put(
        `/income/updateIncome/${userId}/${objectDate}`,
        data
      );
    } catch (error) {
      console.error("Error updating user Expense:", error);
    }
  },

 // Fetch income analysis
getIncomeAnalysis: async (userId, startDate, endDate, professionId) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get(
      `/income/getIncomesAnalysis/${userId}/${startDate}/${endDate}/${professionId}`
    );
    // console.log("income",response.data.data)
    if (response.data.success) {
      set({ userIncomes: response.data.data, loading: false });
    } else {
      set({ userIncomes: [], loading: false, error: response.data.message || "Failed to fetch income analysis." });
    }
  } catch (error) {
    set({
      userIncomes: [],
      loading: false,
      error:
        error.response?.data?.message ||
        "An error occurred while fetching income analysis.",
    });
  }
},

// Fetch monthly income totals
getMonthlyIncome: async (userId, year) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.get(
      `/income/getMonthlyIncomeTotals/${userId}/${year}`
    );
    // console.log("monthly income",response.data.data)
    if (response.data.success) {
      set({ monthlyIncomeTotals: response.data.data.monthlyTotals, loading: false });
    } 
    // else {
    //   set({ monthlyIncomeTotals: [], loading: false, error: response.data.message || "Failed to fetch monthly income." });
    // }
  } catch (error) {
    set({
      monthlyIncomeTotals: [],
      loading: false,
      error:
        error.response?.data?.message ||
        "An error occurred while fetching monthly income.",
    });
  }
},

  

}));

export default useUserIncomeStore;
