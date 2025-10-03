// BookingForm.js
import { useState } from "react";
import { Alert, Button, ScrollView, Text, TextInput } from "react-native";
import { addBooking } from "./services/booking";

const BookingForm = () => {
  const [form, setForm] = useState({
    consultantId: "64f7b8c5e1b2f2a1b3c4d5e6", // default for testing
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

  const handleSubmit = async () => {
    // ✅ Validation for required fields
    const requiredFields = ["consultantId", "fullName", "contactNumber", "email", "serviceRequired"];
    for (let field of requiredFields) {
      if (!form[field] || form[field].trim() === "") {
        Alert.alert("Error", `Please fill the ${field}`);
        return;
      }
    }

    const payload = {
      consultantId: form.consultantId,
      fullName: form.fullName,
      contactNumber: form.contactNumber,
      email: form.email,
      propertyType: form.propertyType,
      propertyLocation: {
        city: form.city,
        area: form.area,
        address: form.address,
      },
      serviceRequired: form.serviceRequired,
      budget: form.budget,
      consultationMode: form.consultationMode,
      preferredDateTime: form.preferredDateTime,
      additionalNotes: form.additionalNotes,
    };

    try {
      const res = await addBooking(payload);
      Alert.alert("Success", res.message || "Booking created successfully!");
      // Optionally, reset form
      setForm({ ...form, fullName:"", contactNumber:"", email:"", propertyType:"", city:"", area:"", address:"", serviceRequired:"", budget:"", preferredDateTime:"", additionalNotes:"" });
    } catch (err) {
      console.log(err.response?.data || err.message); // Debug API error
      Alert.alert("Error", err.response?.data?.message || "Failed to book consultant");
    }
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
