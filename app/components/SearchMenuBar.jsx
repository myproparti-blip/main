import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { ActivityIndicator, Divider, Icon, Menu, Searchbar } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";

export default function SearchMenuBar({
  onSearchChange,
  searchQuery = "",
  setSearchQuery,
  detectLocation,
  locationLoading,
  currentLocation,
}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);

  // ✅ Common function to navigate & auto-close menu
  const handleNavigate = (path) => {
    setMenuVisible(false);
    setTimeout(() => router.push(path), 150);
  };

  const handleDeleteAccount = async () => {
    setMenuVisible(false);
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch("http://192.168.1.5:5000/api/auth/delete-account", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
              });
              const data = await response.json();
              if (data.success) {
                Alert.alert("Deleted", "Your account has been deleted.");
                await logout();
                router.replace("/auth/login");
              } else {
                Alert.alert("Error", data.message || "Failed to delete account.");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* 🔍 Searchbar */}
        <Searchbar
          placeholder={
            locationLoading
              ? "Detecting location..."
              : currentLocation
              ? `${currentLocation}`
              : "Search consultants or properties"
          }
          value={searchQuery}
          onChangeText={(query) => {
            setSearchQuery?.(query);
            onSearchChange?.(query);
          }}
          style={styles.searchbar}
          inputStyle={styles.input}
          icon={() =>
            locationLoading ? (
              <ActivityIndicator size="small" color="#00796B" />
            ) : (
              <Pressable onPress={detectLocation} style={styles.iconContainer}>
                <Icon source="crosshairs-gps" size={20} color="#00796B" />
              </Pressable>
            )
          }
        />

        {/* ⋮ Menu */}
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Pressable
              onPress={() => setMenuVisible((prev) => !prev)}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && { opacity: 0.7 },
              ]}
              hitSlop={10}
              accessibilityLabel="Open options menu"
            >
              <Icon source="dots-vertical" size={26} color="#fff" />
            </Pressable>
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item onPress={() => handleNavigate("/")} title="🏠 Home" />
            <Divider />
            <Menu.Item onPress={() => handleNavigate("/profile")} title="👤 Profile" />
              <Divider />
          <Menu.Item onPress={() => handleNavigate("/explore")} title="🏘 Explore" />
          
          
          <Divider />
          <Menu.Item
            onPress={handleDeleteAccount}
            title="🗑 Delete Account"
            titleStyle={{ color: "red" }}
          />
        </Menu>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#009688",
    paddingHorizontal: 10,
    paddingTop: 40,
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchbar: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "#fff",
    height: 40,
    elevation: 3,
  },
  input: {
    fontSize: 14,
  },
  iconContainer: {
    padding: 6,
  },
  menuButton: {
    marginLeft: 8,
    backgroundColor: "#00796B",
    borderRadius: 20,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  menuContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    minWidth: 160,
  },
});
