import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import { toast } from "react-toastify";

export const userStore = create((set) => ({
  currentUser: null,
  isSigningUp: false,
  isSigningIn: false,
  isSigningOut: false,

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
   * Signin method to authenticate a user.
   * @param {Object} credentials - User credentials for sign-in.
   */
  signin: async (data) => {
    set({ isSigningIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      console.log(res);
      set({ currentUser: res.data });
      toast.success("Signed in successfully!");
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
      console.log(res);
      set({ currentUser: res.data });
      toast.success("Signed in successfully!");
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
}));
