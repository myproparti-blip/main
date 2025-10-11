// services/api.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

// ⚠️ Replace this with your system’s actual LAN IP shown in backend logs
const BASE_URL = "http://192.168.29.78:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ✅ Automatically attach access token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ Handle expired tokens & network issues
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No response → device can’t reach server
    if (!error.response) {
      console.log("🚨 Network error:", error.message);
      Alert.alert(
        "Network Error",
        "Please check your Wi-Fi or make sure the backend server is running."
      );
      return Promise.reject(error);
    }

    // Token expired → try refresh
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        Alert.alert("Session expired", "Please login again.");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const { accessToken } = res.data;
        await AsyncStorage.setItem("accessToken", accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        Alert.alert("Session expired", "Please login again.");
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        return Promise.reject(err);
      }
    }

    const message = error.response.data?.message || "Unexpected server error.";
    Alert.alert("Error", message);
    return Promise.reject(error);
  }
);

export default api;
