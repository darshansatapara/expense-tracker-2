import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx"; // Assuming you have axiosInstance set up

const useUserProfileStore = create((set) => ({
  userProfile: {},
  professions: [], // To store all professions
  isLoading: false,
  error: null,

  // Action to fetch user profile data
  fetchUserProfile: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/userprofile/usersById/${userId}`
      );
      // console.log("Full Response:", response); // Log full response
      // console.log("Response Data:", response.data); // Log only the data part

      // if (!response.data || Object.keys(response.data).length === 0) {
      //   console.error("Empty resp'
      //     onse data received");
      // }

      const userProfile = response.data;
      set({ userProfile, isLoading: false });
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error); // Log detailed error
      set({ error: error.message, isLoading: false });
    }
  },

  // Action to fetch all professions
  fetchProfessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(
        "/admincategories/allincomeCategory"
      );

      // Extract only the 'name' property from each category and store it in the professions state
      const professionNames = response.data.categories.map(
        (category) => category.name
      );

      set({
        professions: professionNames, // Store only profession names in the state
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Action to update user profile
  updateUserProfile: async (userId, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(
        `/userprofile/update-profile/${userId}`,
        updatedData
      );
      set({ userProfile: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useUserProfileStore;
