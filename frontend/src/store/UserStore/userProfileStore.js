import { create } from "zustand";
import { axiosInstance } from "../../utils/axios"; 

const useUserProfileStore = create((set) => ({
  userProfile: {},
  isLoading: false,
  error: null,

  // Action to fetch user profile data
  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/userprofile/all-users/${userId}`);
      set({ userProfile: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

export default useUserProfileStore;
