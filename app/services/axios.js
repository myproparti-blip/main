import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.29.78:5000/api", // 🔥 your backend URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Auto attach token to all requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
