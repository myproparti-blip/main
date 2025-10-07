import { useRouter } from "expo-router";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";


export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: user?.image || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || "Guest User"}</Text>
        <Text style={styles.phone}>{user?.phone || "No phone number"}</Text>
      </View>

      <View style={styles.card}>
        <TouchableOpacity onPress={() => router.push("/(tabs)/favorites")}>
          <Text style={styles.option}>⭐ Saved Properties</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/payments")}>
          <Text style={styles.option}>💳 Payment History</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(tabs)/settings")}>
          <Text style={styles.option}>⚙️ Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.option, { color: "red" }]}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  profileHeader: { alignItems: "center", marginTop: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold" },
  phone: { fontSize: 14, color: "gray", marginBottom: 20 },
  card: { marginTop: 40 },
  option: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
