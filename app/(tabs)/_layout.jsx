import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index" // Home first
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: "#777",
        tabBarStyle: {
          height: 64,
          paddingBottom: 6,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderColor: "#eee",
        },
        tabBarLabelStyle: { fontSize: 12 },
      }}
    >
      {/* 🏠 Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 👥 Consultant */}
      <Tabs.Screen
        name="services"
        options={{
          title: "Book Consultant",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 🏢 Listing */}
      <Tabs.Screen
        name="explore"
        options={{
          title: "Property Listing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      {/* 💼 Management */}
      <Tabs.Screen
        name="Property management"
        options={{
          title: "Management",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
