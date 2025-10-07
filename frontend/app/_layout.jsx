// import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
// import { Drawer } from "expo-router/drawer";
// import { StatusBar } from "expo-status-bar";
// import "react-native-reanimated";

// import { useColorScheme } from "@/hooks/use-color-scheme";
// import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
//   const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

//   return (
//     <PaperProvider theme={paperTheme}>
//       <ThemeProvider value={navTheme}>
//         <Drawer>
//           {/* Sidebar screens */}
//           <Drawer.Screen name="index" options={{ title: "Home" }} />
//           <Drawer.Screen name="addwishlist" options={{ title: "Wishlist" }} />
//           <Drawer.Screen name="addbooking" options={{ title: "Bookings" }} />
//           <Drawer.Screen name="postproperty" options={{ title: "Post Property" }} />
//           <Drawer.Screen name="reviews" options={{ title: "Reviews" }} />
//           <Drawer.Screen name="sale" options={{ title: "Sale" }} />
//           <Drawer.Screen name="addproperty" options={{ title: "Add Property" }} />
//           <Drawer.Screen name="login" options={{ title: "Login" }} />
//           <Drawer.Screen
//             name="modal"
//             options={{ presentation: "modal", title: "Modal" }}
//           />
//         </Drawer>

//         <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
//       </ThemeProvider>
//     </PaperProvider>
//   );
// }
// app/_layout.js
// app/_layout.js
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  MD3DarkTheme,
  MD3LightTheme,
  Provider as PaperProvider,
} from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navTheme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navTheme}>
        {/* Root stack navigation */}
        <Stack screenOptions={{ headerShown: false }}>
          {/* 🚀 Login screen — full screen, no drawer, no header */}
          <Stack.Screen name="login" options={{ headerShown: false }} />

          {/* 🚀 Drawer navigator for the rest of the app */}
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        </Stack>

        <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      </ThemeProvider>
    </PaperProvider>
  );
}
