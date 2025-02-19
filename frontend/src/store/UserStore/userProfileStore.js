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
  updateUserProfile: async (userId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/userprofile/update-profile/${userId}`, updatedData);
      set({ userProfile: response.data.data, isLoading: false });
      return response.data; // Optionally return the updated data to notify the caller
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error; // Throw the error to be caught in the component where it is called
    }
  },
}));

export default useUserProfileStore;
