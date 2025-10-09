import api from "./axios";

// ✅ Send OTP
export const sendOtp = async (body) => {
  try {
    const { data } = await api.post("auth/send-otp", body);
    return { success: true, ...data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to send OTP",
    };
  }
};

// ✅ Verify OTP and store tokens
export const verifyOtp = async (body) => {
  try {
    const { data } = await api.post("auth/verify-otp", body);
    return { success: true, ...data };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to verify OTP",
    };
  }
};
