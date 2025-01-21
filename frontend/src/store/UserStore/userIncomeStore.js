import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { formatData } from "../../components/commonComponent/formatEAndIData.js";

const useUserIncomeStore = create((set) => ({
  userIncomes: [], // State to store user incomes
  loading: false, // State to track the loading status
  error: null, // State to track any errors

  // Fetch user incomes based on userId, startDate, endDate, and profession
  fetchUserIncomes: async (userId, startDate, endDate, profession) => {
    console.log(userId, startDate, endDate, profession);
    set({ loading: true, error: null }); // Set loading to true and clear any errors
    try {
      const response = await axiosInstance.get(
        `/income/getIncomes/${userId}/${startDate}/${endDate}/${profession}` // Adjust the endpoint as needed
      );

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

  // Clear the incomes data
  clearUserIncomes: () => set({ userIncomes: [], error: null }),
}));

export default useUserIncomeStore;
