import { create } from "zustand";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";

export const useOtpStore = create((set) => ({
  isSendingOtp: false, // Loading state
  email: "",
  password: "",
  otpSent: false, // Indicates if OTP was sent successfully

  // Action to send OTP
  sendOtp: async (email, password) => {
    set({ isSendingOtp: true });

    try {
      await axiosInstance.post("/otp/send-otp", { email });

      set({ email, otpSent: true }); // Save email and password on success
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Try again."
      );
    } finally {
      set({ isSendingOtp: false });
    }
  },
}));
