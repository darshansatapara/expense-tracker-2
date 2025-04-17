import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.js";
import { toast } from "react-toastify";

export const userStore = create((set) => ({
  currentUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSigningOut: false,
  isUpdatingProfile: false,
  isUpdatingProfileStatus: false,
  isUpdatingCategoryStatus: false,

  /**
   * Signup method to create a new user account.
   * @param {Object} data - User data for signup.
   */
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ currentUser: res.data.user }); // Save the user data locally
      toast.success("Account created successfully!");
      return res.data.user; // Return the user data to the caller
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed!");
      throw error; // Ensure the error propagates
    } finally {
      set({ isSigningUp: false });
    }
  },

  /**
   * Update the profile status to true when the user completes their signup process.
   * @param {String} userId - ID of the user to update.
   */
  markProfileAsCompleted: async (userId) => {
    set({ isUpdatingProfileStatus: true });
    try {
      // Call the backend API to update the profile_complated field
      const res = await axiosInstance.put(`/auth/profilestatus`, {
        userId,
      });

      // Update the local user data to reflect the change
      set((state) => ({
        currentUser: {
          ...state.currentUser,
          profile_complated: true,
        },
      }));

      toast.success("Profile marked as completed!");
      return res.data; // Return the response from the API
    } catch (error) {
      console.error("Error marking profile as completed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile status!"
      );
      throw error; // Ensure the error propagates
    } finally {
      set({ isUpdatingProfileStatus: false });
    }
  },

  /**
   * Update the category status to true when the user completes their category selection process.
   * @param {String} userId - ID of the user to update.
   */
  markCategoryAsCompleted: async (userId) => {
    set({ isUpdatingCategoryStatus: true });
    try {
      // Call the backend API to update the profile_complated field
      const res = await axiosInstance.put(`/auth/categorystatus`, {
        userId,
      });

      // Update the local user data to reflect the change
      set((state) => ({
        currentUser: {
          ...state.currentUser,
          category_completed: true,
        },
      }));

      toast.success("Profile marked as completed!");
      return res.data; // Return the response from the API
    } catch (error) {
      console.error("Error marking profile as completed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile status!"
      );
      throw error; // Ensure the error propagates
    } finally {
      set({ isUpdatingCategoryStatus: false });
    }
  },

  /**
   * Signin method to authenticate a user.
   * @param {Object} credentials - User credentials for sign-in.
   */
  signin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ currentUser: res.data });
      toast.success("Signed in successfully!");
      return res.data;
    } catch (error) {
      console.error("Signin error:", error);
      toast.error(error.response?.data?.message || "Sign-in failed!");
    } finally {
      set({ isSigningIn: false });
    }
  },

  googlesignin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/googlesignin", data);
      set({ currentUser: res.data });
      toast.success("Signed in successfully!");
      return res.data;
    } catch (error) {
      console.error("Signin error:", error);
      toast.error(error.response?.data?.message || "Sign-in failed!");
    } finally {
      set({ isSigningIn: false });
    }
  },
  /**
   * Signout method to log out the current user.
   */
  signout: async () => {
    set({ isSigningOut: true });
    try {
      await axiosInstance.post("/auth/signout");
      set({ currentUser: null });
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Signout error:", error);
      toast.error(error.response?.data?.message || "Sign-out failed!");
    } finally {
      set({ isSigningOut: false });
    }
  },

  /**
   * Update user profile.
   * @param {String} userId - ID of the user to update.
   * @param {Object} data - Updated user data.
   */
  updateProfile: async (userId, data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put(
        `/auth/updateuserprofile/${userId}`,
        data
      );
      set({ currentUser: res.data.user }); // Update the local store with the updated user data
      toast.success("Profile updated successfully!");
      return res.data.user; // Return the updated user data
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile!");
      throw error; // Ensure the error propagates
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log(res.data.user);
      set({ currentUser: res.data.user });
    } catch (error) {
      console.error("Check auth error:", error);
    }
  },
}));
