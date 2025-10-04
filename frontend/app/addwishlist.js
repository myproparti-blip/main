// AddWishlist.js
import { useState } from "react";
import {
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddWishlist = () => {
  const [propertyId, setPropertyId] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const handleAdd = () => {
    if (!propertyId.trim()) return;

    const newItem = {
      _id: Date.now().toString(), // mock ID
      propertyId: { _id: propertyId },
      createdAt: new Date().toISOString(),
    };

    setWishlist([newItem, ...wishlist]);
    setPropertyId("");
  };

  const handleRemove = (id) => {
    const updatedList = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedList);
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
            <Text>Property ID: {item.propertyId._id}</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  item: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  removeBtn: {
    marginTop: 5,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default AddWishlist;
