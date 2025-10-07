import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={handleLogout}>
      <Text style={styles.text}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { padding: 12, backgroundColor: "#ff5252", borderRadius: 10, marginTop: 20 },
  text: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});
