import api from "./axios";

// Send OTP
export const sendOtp = async (body) => {
  try {
    const response = await api.post("/auth/send-otp", body);
    // Make sure response.ok exists
    return response.data; 
  } catch (error) {
    console.log("sendOtp error:", error.message);
    throw error;
  }
};

// Verify OTP
export const verifyOtp = async (body) => {
  try {
    const response = await api.post("/auth/verify-otp", body);
    return response.data;
  } catch (error) {
    console.log("verifyOtp error:", error.message);
    throw error;
  }
};
