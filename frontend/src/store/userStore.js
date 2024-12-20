import { create } from "zustand";
import axios from "axios";

const userStore = create((set) => ({
  currentUser: null,
  isSigningUp: false, // Tracks signup process state
  isSigningIn: false, // Tracks signin process state

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("/auth/signup", data);
      set({ currentUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(error.response?.data?.message || "Signup failed!");
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
