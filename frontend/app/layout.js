// app/(drawer)/_layout.jsx
import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="addwishlist" options={{ title: "Wishlist" }} />
      <Drawer.Screen name="addbooking" options={{ title: "Bookings" }} />
      <Drawer.Screen name="postproperty" options={{ title: "Post Property" }} />
      <Drawer.Screen name="reviews" options={{ title: "Reviews" }} />
      <Drawer.Screen name="sale" options={{ title: "Sale" }} />
      <Drawer.Screen name="addproperty" options={{ title: "Add Property" }} />
    </Drawer>
  );
}
