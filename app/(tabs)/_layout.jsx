import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function CustomTabBar({ state, descriptors, navigation }) {
  const visibleNames = ["index", "explore", "services", "payments"];
  const visibleRoutes = state.routes.filter((r) => visibleNames.includes(r.name));

  return (
    <View style={localStyles.container}>
      {visibleRoutes.map((route) => {
        const focused =
          state.routes.findIndex((r) => r.name === route.name) === state.index;
        const onPress = () => navigation.navigate(route.name);

        // 🌟 Custom icons and labels
        let icon = "ellipse";
        let title = route.name;

        if (route.name === "index") {
          icon = "home-outline"; // or use "business-outline"
          title = "Property Mgmt";
        } else if (route.name === "explore") {
          icon = "business-outline";
          title = "Properties";
        } else if (route.name === "services") {
          icon = "people-outline"; // consultant style
          title = "Consultant";
        } else if (route.name === "payments") {
          icon = "card-outline";
          title = "Payments";
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={localStyles.tab}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Ionicons
              name={icon}
              size={22}
              color={focused ? "#00796B" : "#777"}
            />
            <Text
              style={[localStyles.label, focused && { color: "#00796B" }]}
            >
              {title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 64,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 12,
    paddingTop: 6,
    backgroundColor: "#fff",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  label: {
    fontSize: 12,
    marginTop: 4,
    color: "#444",
  },
});

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBar: (props) => <CustomTabBar {...props} />,
        tabBarHideOnKeyboard: false,
        unmountOnBlur: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Property Management",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Properties Listing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="services"
        options={{
          title: "Book Consultant",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="payments"
        options={{
          title: "Payments",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
