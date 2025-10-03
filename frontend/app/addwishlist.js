// addwishlist.js
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { addToWishlist, getWishlist, removeFromWishlist } from "./services/wishlistApi";

const AddWishlist = () => {
  const [userId, setUserId] = useState("64f7b8c5e1b2f2a1b3c4d5e6"); // default user for testing
  const [propertyId, setPropertyId] = useState("");
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      const res = await getWishlist(userId);
      setWishlist(res.data);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // Add item to wishlist
  const handleAdd = async () => {
    if (!propertyId.trim()) {
      Alert.alert("Error", "Please enter a property ID");
      return;
    }
    try {
      await addToWishlist({ userId, propertyId });
      Alert.alert("Success", "Added to wishlist");
      setPropertyId(""); // reset input
      fetchWishlist();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  // Remove item from wishlist
  const handleRemove = async (id) => {
    try {
      await removeFromWishlist(id);
      Alert.alert("Removed", "Item removed from wishlist");
      fetchWishlist();
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={styles.heading}>My Wishlist</Text>

      <TextInput
        placeholder="Enter Property ID to add"
        style={styles.input}
        value={propertyId}
        onChangeText={setPropertyId}
      />
      <Button title="Add to Wishlist" onPress={handleAdd} />

      <Text style={{ marginTop: 20, fontSize: 18, fontWeight: "bold" }}>Wishlist Items:</Text>
      {wishlist.length === 0 && <Text>No items in wishlist.</Text>}

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Property ID: {item.propertyId?._id || "N/A"}</Text>
            <Text>Added At: {new Date(item.createdAt).toLocaleString()}</Text>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(item._id)}>
              <Text style={{ color: "white" }}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  item: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10, borderRadius: 5 },
  removeBtn: { marginTop: 5, backgroundColor: "red", padding: 5, borderRadius: 5, alignItems: "center" }
});

export default AddWishlist;
