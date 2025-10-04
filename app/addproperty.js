// AddPropertyScreen.js
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Button, Card, Text, TextInput } from "react-native-paper";

export default function AddPropertyScreen() {
  const [form, setForm] = useState({
    title: "",
    propertyType: "",
    saleType: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    furnishingStatus: "",
    address: "",
    city: "",
    pinCode: "",
    features: [],
    images: [""],
    description: "",
  });

  const [message, setMessage] = useState("");
  const [properties, setProperties] = useState([]); // Simulated property list

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = () => {
    // Simulate adding a property locally
    const newProperty = {
      ...form,
      price: Number(form.price) || 0,
      area: Number(form.area) || 0,
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
    };

    setProperties([newProperty, ...properties]);
    setMessage("✅ Property added successfully (UI only)");

    // Reset form
    setForm({
      title: "",
      propertyType: "",
      saleType: "",
      price: "",
      area: "",
      bedrooms: "",
      bathrooms: "",
      furnishingStatus: "",
      address: "",
      city: "",
      pinCode: "",
      features: [],
      images: [""],
      description: "",
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="titleLarge" style={{ marginBottom: 16 }}>
        Add New Property
      </Text>

      {/* --- FORM --- */}
      <TextInput
        label="Title"
        value={form.title}
        onChangeText={(text) => handleChange("title", text)}
        style={styles.input}
      />

      <TextInput
        label="Property Type"
        value={form.propertyType}
        onChangeText={(text) => handleChange("propertyType", text)}
        style={styles.input}
      />

      <TextInput
        label="Sale Type"
        value={form.saleType}
        onChangeText={(text) => handleChange("saleType", text)}
        style={styles.input}
      />

      <TextInput
        label="Price"
        value={form.price}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("price", text)}
        style={styles.input}
      />

      <TextInput
        label="Area (sqft)"
        value={form.area}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("area", text)}
        style={styles.input}
      />

      <TextInput
        label="Bedrooms"
        value={form.bedrooms}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("bedrooms", text)}
        style={styles.input}
      />

      <TextInput
        label="Bathrooms"
        value={form.bathrooms}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("bathrooms", text)}
        style={styles.input}
      />

      <TextInput
        label="Furnishing Status"
        value={form.furnishingStatus}
        onChangeText={(text) => handleChange("furnishingStatus", text)}
        style={styles.input}
      />

      <TextInput
        label="Address"
        value={form.address}
        onChangeText={(text) => handleChange("address", text)}
        style={styles.input}
      />

      <TextInput
        label="City"
        value={form.city}
        onChangeText={(text) => handleChange("city", text)}
        style={styles.input}
      />

      <TextInput
        label="Pin Code"
        value={form.pinCode}
        keyboardType="numeric"
        onChangeText={(text) => handleChange("pinCode", text)}
        style={styles.input}
      />

      <TextInput
        label="Features (comma separated)"
        value={form.features.join(", ")}
        onChangeText={(text) =>
          handleChange("features", text.split(",").map((f) => f.trim()))
        }
        style={styles.input}
      />

      <TextInput
        label="Image URL"
        value={form.images[0]}
        onChangeText={(text) => handleChange("images", [text])}
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={form.description}
        onChangeText={(text) => handleChange("description", text)}
        multiline
        numberOfLines={3}
        style={styles.input}
      />

      {message ? <Text style={{ marginVertical: 10 }}>{message}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ marginTop: 16 }}
      >
        Submit Property
      </Button>

      {/* --- PROPERTY LIST --- */}
      <Text variant="titleLarge" style={{ marginVertical: 16 }}>
        Existing Properties
      </Text>

      {Array.isArray(properties) && properties.length > 0 ? (
        properties.map((prop, index) => (
          <Card key={index} style={{ marginBottom: 12 }}>
            <Card.Title title={prop.title} subtitle={prop.city} />
            <Card.Content>
              <Text>Price: {prop.price}</Text>
              <Text>Type: {prop.propertyType}</Text>
              <Text>Bedrooms: {prop.bedrooms}</Text>
              <Text>Bathrooms: {prop.bathrooms}</Text>
            </Card.Content>
          </Card>
        ))
      ) : (
        <Text>No properties added yet.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
  },
});
