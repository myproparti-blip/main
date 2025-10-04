// BookingForm.js
import { useState } from "react";
import { Button, ScrollView, Text, TextInput, View } from "react-native";

const BookingForm = () => {
  const [form, setForm] = useState({
    consultantId: "", // optional for UI
    fullName: "",
    contactNumber: "",
    email: "",
    propertyType: "",
    city: "",
    area: "",
    address: "",
    serviceRequired: "",
    budget: "",
    consultationMode: "online",
    preferredDateTime: "",
    additionalNotes: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    // No backend logic — UI only
    console.log("Form submitted (UI only):", form);
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Book Consultant</Text>

      <TextInput placeholder="Full Name" style={styles.input} value={form.fullName} onChangeText={(t) => handleChange("fullName", t)} />
      <TextInput placeholder="Contact Number" style={styles.input} value={form.contactNumber} onChangeText={(t) => handleChange("contactNumber", t)} keyboardType="phone-pad" />
      <TextInput placeholder="Email" style={styles.input} value={form.email} onChangeText={(t) => handleChange("email", t)} keyboardType="email-address" />
      <TextInput placeholder="Property Type" style={styles.input} value={form.propertyType} onChangeText={(t) => handleChange("propertyType", t)} />
      <TextInput placeholder="City" style={styles.input} value={form.city} onChangeText={(t) => handleChange("city", t)} />
      <TextInput placeholder="Area" style={styles.input} value={form.area} onChangeText={(t) => handleChange("area", t)} />
      <TextInput placeholder="Address" style={styles.input} value={form.address} onChangeText={(t) => handleChange("address", t)} />
      <TextInput placeholder="Service Required" style={styles.input} value={form.serviceRequired} onChangeText={(t) => handleChange("serviceRequired", t)} />
      <TextInput placeholder="Budget" style={styles.input} value={form.budget} onChangeText={(t) => handleChange("budget", t)} />
      <TextInput placeholder="Preferred Date & Time" style={styles.input} value={form.preferredDateTime} onChangeText={(t) => handleChange("preferredDateTime", t)} />
      <TextInput placeholder="Additional Notes" style={styles.input} value={form.additionalNotes} onChangeText={(t) => handleChange("additionalNotes", t)} multiline />

      <Button title="Book Now" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
};

export default BookingForm;
