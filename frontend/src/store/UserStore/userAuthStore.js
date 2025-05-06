import { create } from "zustand";
import { axiosInstance } from "../../utils/axios.jsx";
import { toast } from "react-toastify";
import { message } from "antd";

export const userStore = create((set) => ({
  currentUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSigningOut: false,
  isUpdatingProfile: false,
  isUpdatingProfileStatus: false,
  isUpdatingCategoryStatus: false,
  isUpdatingPassword: false, // New state for password update

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
    // console.log("Marking profile as completed for userId:", userId);
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
    // console.log("Marking category as completed for userId:", userId);
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
      const response = await axiosInstance.post("/auth/signout");
      // console.log("signout response:", response.data);
      set({ currentUser: null, isSigningOut: false });
      message.success("Signed out successfully!");
      // Navigate to signin page (must be called in component, see below)
      return response.data;
    } catch (error) {
      console.error("Signout error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      message.error(error.response?.data?.message || "Sign-out failed!");
      set({ isSigningOut: false });
      throw error;
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
  /**
   * Update user password.
   * @param {String} email - Email of the user.
   * @param {String} password - New password.
   */
  updatePassword: async (email, password) => {
    set({ isUpdatingPassword: true });
    try {
      // console.log("Sending password update request:", { email, password });
      const res = await axiosInstance.post("/auth/reset-password", {
        email,
        password,
      });
      // console.log("Password update response:", res.data);
      toast.success("Password updated successfully!");
      return res.data;
    } catch (error) {
      console.error("Password update error:", {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status,
        request: {
          url: error.config?.url,
          data: error.config?.data,
        },
      });
      toast.error(
        error.response?.data?.message || "Failed to update password!"
      );
      throw error;
    } finally {
      set({ isUpdatingPassword: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      // console.log(res.data.user);
      set({ currentUser: res.data.user });
    } catch (error) {
      console.error("Check auth error:", error);
    }
  },
}));
