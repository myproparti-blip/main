import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const accessToken = await AsyncStorage.getItem("accessToken");
        if (storedUser && accessToken) {
          setUser({ ...JSON.parse(storedUser), accessToken });
        }
      } catch (e) {
        console.log("Error loading user", e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ✅ Store user + tokens after login
  const login = async (data) => {
    const { user, accessToken, refreshToken } = data;
    await AsyncStorage.setItem("user", JSON.stringify(user));
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    setUser({ ...user, accessToken });
  };

  // ✅ Logout and clear all
  const logout = async () => {
    await AsyncStorage.multiRemove(["user", "accessToken", "refreshToken"]);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
