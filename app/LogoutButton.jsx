import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";


export default function LogoutButton() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // ✅ Logout handler
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login");
        },
      },
    ]);
  };

  // ✅ Delete account handler
  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              // ✅ Make API call with token
              const token = user?.accessToken || user?.token;
              const response = await fetch(
                "http://192.168.1.5:5000/api/auth/delete-account",
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await response.json();
              if (data.success) {
                Alert.alert("Success", data.message || "Account deleted.");
                await logout();
                router.replace("/auth/login");
              } else {
                Alert.alert("Error", data.message || "Failed to delete account.");
              }
            } catch (err) {
              console.error("Delete account error:", err);
              Alert.alert("Error", "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 🔴 Delete Account */}
      <TouchableOpacity style={[styles.btn, styles.deleteBtn]} onPress={handleDeleteAccount}>
        <Text style={styles.text}>Delete Account</Text>
      </TouchableOpacity>

      {/* 🚪 Logout */}
      <TouchableOpacity style={[styles.btn, styles.logoutBtn]} onPress={handleLogout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  btn: {
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
  },
  deleteBtn: {
    backgroundColor: "#d32f2f", // red
  },
  logoutBtn: {
    backgroundColor: "#ff7043", // orange-red
  },
  text: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});
