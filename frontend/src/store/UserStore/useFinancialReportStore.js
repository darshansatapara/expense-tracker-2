import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";

const useFinancialReportStore = create((set) => ({
  monthlyExpenses: [],
  monthlyIncomes: [],
  expenseAnalysis: null,
  incomeAnalysis: null,
  loading: false,
  error: null,

  // Fetch report data with optional custom date range
  fetchReportData: async (userId, year, professionId, startDate, endDate) => {
    set({ loading: true, error: null });

    try {
      const url =
        startDate && endDate
          ? `report/financial-report/${userId}/${year}/${professionId}/${startDate}/${endDate}`
          : `report/financial-report/${userId}/${year}/${professionId}`;

      const response = await axiosInstance.get(url);

      if (response.data.success) {
        const {
          monthlyExpenses,
          monthlyIncomes,
          expenseAnalysis,
          incomeAnalysis,
        } = response.data.data;

        set({
          monthlyExpenses,
          monthlyIncomes,
          expenseAnalysis,
          incomeAnalysis,
          loading: false,
          error: null,
        });
      } else {
        throw new Error(response.data.message || "Failed to fetch report data");
      }
    } catch (error) {
      set({
        monthlyExpenses: [],
        monthlyIncomes: [],
        expenseAnalysis: null,
        incomeAnalysis: null,
        loading: false,
        error:
          error.response?.data?.message ||
          "An error occurred while fetching report data.",
      });
    }
  },
}));

export default useFinancialReportStore;
