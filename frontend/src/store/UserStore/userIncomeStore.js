import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";

const useUserIncomeStore = create((set) => ({
  userIncomes: [], // State to store user incomes
  loading: false, // State to track the loading status
  error: null, // State to track any errors

  // Fetch user incomes based on userId, startDate, endDate, and profession
  fetchUserIncomes: async (userId, startDate, endDate, profession) => {
    
    set({ loading: true, error: null }); 
    try {
      const response = await axiosInstance.get(
        `/income/getIncomes/${userId}/${startDate}/${endDate}/${profession}`
      );

      // console.log(response.data.incomes);
      if (response.data.success) {
        set({
          userIncomes: response.data.incomes, 
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
}));

export default useUserIncomeStore;
