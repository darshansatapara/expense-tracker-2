import { create } from "zustand";
import { axiosInstance } from "../utils/axios.jsx";
import toast from "react-hot-toast";

export const useOtpStore = create((set) => ({
  isSendingOtp: false, // Loading state
  otpSent: false, // Indicates if OTP was sent successfully
  isVerifyingOtp: false, // Loading state for verifying OTP
  otpVerified: false, // Indicates if OTP was verified successfully

  // Action to send OTP
  sendOtp: async (email) => {
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

  verifyOtp: async (email, otp) => {
    set({ isVerifyingOtp: true });

    try {
      const response = await axiosInstance.post("/otp/verify-otp", {
        email,
        otp,
      });
   

      set({ otpVerified: true }); // Mark OTP as verified
      toast.success(response.data.message || "OTP verified successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to verify OTP. Try again."
      );
    } finally {
      set({ isVerifyingOtp: false });
    }
  },
}));
