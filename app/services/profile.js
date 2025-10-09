// services/profile.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Tries to get token from multiple common storage keys or from a stored user object
 */
const getStoredToken = async () => {
  try {
    const keys = ["accessToken", "access_token", "token"];
    for (const k of keys) {
      const v = await AsyncStorage.getItem(k);
      if (v) return v;
    }

    const userStr = await AsyncStorage.getItem("user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        return u?.accessToken || u?.token || u?.access_token || null;
      } catch {
        return null;
      }
    }

    return null;
  } catch (err) {
    console.error("getStoredToken error:", err);
    return null;
  }
};

/**
 * Fetches the authenticated user's profile
 */
export const getProfile = async (token) => {
  try {
    const t = token || (await getStoredToken());
    if (!t) return { success: false, message: "No access token found" };

    const { data } = await api.get("/auth/profile", {
      headers: { Authorization: `Bearer ${t}` },
    });

    return { success: true, user: data.user || data };
  } catch (error) {
    console.error("getProfile error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch profile",
    };
  }
};

/**
 * Deletes the user's account
 */
export const deleteAccount = async () => {
  try {
    const t = await getStoredToken();
    if (!t) return { success: false, message: "No access token found" };

    const res = await fetch(`${API_URL}/users/delete`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${t}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Delete account error:", error);
    return { success: false, message: error.message || "Error deleting account" };
  }
};
