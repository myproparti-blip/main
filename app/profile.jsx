// screens/profile.jsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { deleteAccount, getProfile } from "./services/profile";

export default function Profile() {
  const { logout } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { success, user, message } = await getProfile();

      if (success) {
        setProfile(user);
      } else {
        console.log("Profile fetch failed:", message);
        if (message?.toLowerCase().includes("token")) {
          await logout();
          router.replace("/login");
        } else {
          Alert.alert("Error", message || "Failed to fetch profile");
        }
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      Alert.alert("Error", "Something went wrong while fetching profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure you want to permanently delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const { success, message } = await deleteAccount();

              if (success) {
                Alert.alert("Account Deleted", "Your account has been removed successfully.");
                await logout();
                router.replace("/login");
              } else {
                Alert.alert("Error", message || "Failed to delete account.");
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "Something went wrong. Please try again later.");
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  if (loading || deleting) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.statusText}>
          {deleting ? "Deleting your account..." : "Loading profile..."}
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.noData}>No profile data available.</Text>
        <TouchableOpacity onPress={fetchProfile} style={{ marginTop: 20 }}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => (router.canGoBack() ? router.back() : router.push("/index"))}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Profile Info */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: profile?.image || "https://i.pravatar.cc/150" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{profile?.name || "User"}</Text>
        <Text style={styles.phone}>{profile?.phone || "No phone number"}</Text>
        <Text style={styles.role}>{profile?.role?.join(", ") || "buyer"}</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => Alert.alert("⭐ Saved Properties feature coming soon!")}>
          <Text style={styles.option}>⭐ Saved Properties</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("💳 Payment History feature coming soon!")}>
          <Text style={styles.option}>💳 Payment History</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => Alert.alert("⚙️ Settings feature coming soon!")}>
          <Text style={styles.option}>⚙️ Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout}>
          <Text style={[styles.option, { color: "#ff5252" }]}>🚪 Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDeleteAccount}>
          <Text style={[styles.option, { color: "red", fontWeight: "600" }]}>🗑 Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  center: { justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backText: { color: "#009688", fontSize: 16, fontWeight: "bold" },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  profileHeader: { alignItems: "center", marginTop: 10 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 20, fontWeight: "bold", color: "#222" },
  phone: { fontSize: 14, color: "gray", marginBottom: 6 },
  role: { fontSize: 14, color: "#00796B" },
  card: { marginTop: 40 },
  option: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statusText: { marginTop: 10, color: "#009688", fontWeight: "500" },
  noData: { fontSize: 16, color: "gray" },
  retryText: { color: "#009688", fontWeight: "bold" },
});
