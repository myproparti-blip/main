import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import {
  Text,
  Button,
  TextInput,
  Chip,
  ProgressBar,
  Appbar,
  Card,
  Divider,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function PostProperty() {
  const router = useRouter();

  // Steps
  const [step, setStep] = useState(1);

  // Form state
  const [lookingFor, setLookingFor] = useState("Sell");
  const [propertyKind, setPropertyKind] = useState("Residential");
  const [propertyType, setPropertyType] = useState("");
  const [contact, setContact] = useState("");
  const [images, setImages] = useState([]);

  // Agents & Consultants dummy data
 const agents = [
    { id: 1, name: "Rohan Desai", type: "Luxury Consultant", contact: "9876543210", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { id: 2, name: "Isha Kapoor", type: "Commercial Specialist", contact: "9123456780", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { id: 3, name: "Amit Sharma", type: "Residential Agent", contact: "9988776655", image: "https://randomuser.me/api/portraits/men/41.jpg" },
    { id: 4, name: "Neha Verma", type: "Rental Expert", contact: "8877665544", image: "https://randomuser.me/api/portraits/women/65.jpg" },
    { id: 5, name: "Karan Mehta", type: "Investment Advisor", contact: "7766554433", image: "https://randomuser.me/api/portraits/men/21.jpg" },
    { id: 6, name: "Priya Nair", type: "PG/Hostel Consultant", contact: "6655443322", image: "https://randomuser.me/api/portraits/women/29.jpg" },
    { id: 7, name: "Vikram Singh", type: "Office Space Specialist", contact: "7788996655", image: "https://randomuser.me/api/portraits/men/11.jpg" },
    { id: 8, name: "Anjali Rao", type: "Luxury Villas Agent", contact: "8899776655", image: "https://randomuser.me/api/portraits/women/54.jpg" },
  ];

  // Image Picker
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const progress = step / 3;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      alert("✅ Property Posted Successfully!");
      router.push("/");
    }
  };

  return (
    <>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#1E1E2E", elevation: 4 }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content
          title="Post Property"
          titleStyle={{ color: "white", fontWeight: "bold" }}
        />
      </Appbar.Header>

      {/* Progress */}
      <ProgressBar progress={progress} color="green" style={{ height: 6 }} />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Step 1 */}
        {step === 1 && (
          <Card style={styles.card}>
            <Card.Content>
             <Text style={styles.label}>You're looking to?</Text>
<View style={styles.row}>
  {["Sell", "Rent / Lease", "Paying Guest"].map((opt) => {
    const isActive = lookingFor === opt;
    return (
      <Chip
        key={opt}
        onPress={() => setLookingFor(isActive ? "" : opt)} // ✅ toggle logic
        style={[styles.chip, isActive && styles.chipSelected]}
        textStyle={{
          fontWeight: "600",
          color: isActive ? "#fff" : "#1E1E2E",
        }}
      >
        {opt}
      </Chip>
    );
  })}
</View>

<Text style={styles.label}>What kind of property?</Text>
<View style={styles.row}>
  {["Residential", "Commercial"].map((opt) => {
    const isActive = propertyKind === opt;
    return (
      <Chip
        key={opt}
        onPress={() => setPropertyKind(isActive ? "" : opt)} // ✅ toggle logic
        style={[styles.chip, isActive && styles.chipSelected]}
        textStyle={{
          fontWeight: "600",
          color: isActive ? "#fff" : "#1E1E2E",
        }}
      >
        {opt}
      </Chip>
    );
  })}
</View>

<Text style={styles.label}>Select Property Type</Text>
<View style={styles.rowWrap}>
  {[
    "Apartment",
    "Independent House / Villa",
    "Builder Floor",
    "Plot / Land",
    "Studio",
    "Office",
  ].map((opt) => {
    const isActive = propertyType === opt;
    return (
      <Chip
        key={opt}
        onPress={() => setPropertyType(isActive ? "" : opt)} // ✅ toggle logic
        style={[styles.chip, isActive && styles.chipSelected]}
        textStyle={{
          fontWeight: "600",
          color: isActive ? "#fff" : "#1E1E2E",
        }}
      >
        {opt}
      </Chip>
    );
  })}
</View>

              <Divider style={{ marginVertical: 20 }} />

              <Text style={styles.label}>Your Contact Details</Text>
              <TextInput
                mode="outlined"
                label="Phone / Email"
                value={contact}
                onChangeText={setContact}
                style={styles.input}
                outlineStyle={{ borderRadius: 12, borderColor: "#ddd" }}
              />

              <Button
                mode="contained"
                onPress={handleNext}
                style={styles.mainBtn}
                labelStyle={styles.btnLabel}
              >
                Next
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.heading}>Upload Property Photos</Text>
              <Button
                mode="contained"
                onPress={pickImage}
                style={styles.mainBtn}
                icon="camera"
                labelStyle={styles.btnLabel}
              >
                Add Photo
              </Button>

              <View style={styles.imageGrid}>
                {images.map((img, idx) => (
                  <Card key={idx} style={styles.imageCard} mode="elevated">
                    <Image source={{ uri: img }} style={styles.image} />
                  </Card>
                ))}
              </View>

              <Button
                mode="contained"
                onPress={handleNext}
                style={styles.mainBtn}
                labelStyle={styles.btnLabel}
              >
                Next
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <Card style={styles.card}>
            <Card.Title title="Review & Submit" />
            <Card.Content>
              <Text style={styles.summary}>Looking For: {lookingFor}</Text>
              <Text style={styles.summary}>Kind: {propertyKind}</Text>
              <Text style={styles.summary}>Type: {propertyType}</Text>
              <Text style={styles.summary}>Contact: {contact}</Text>
              <Text style={styles.summary}>Photos: {images.length}</Text>

              <Button
                mode="contained"
                onPress={handleNext}
                style={styles.mainBtn}
                labelStyle={styles.btnLabel}
              >
                Submit Property
              </Button>
            </Card.Content>
          </Card>
        )}

        {/* Agents & Consultants */}
        <Card style={styles.card}>
          <Card.Title title="Agents & Consultants" />
          <Card.Content>
            {agents.map((a) => (
              <View key={a.id} style={styles.agentRow}>
                {/* Agent Image */}
                <Image source={{ uri: a.image }} style={styles.agentImage} />

                {/* Agent Info */}
                <View style={styles.agentInfo}>
                  <Text style={styles.agentName}>{a.name}</Text>
                  <Text style={styles.agentType}>{a.type}</Text>
                  <Text style={styles.agentContact}>{a.contact}</Text>
                </View>

                {/* Book Button */}
              <Button
  mode="contained"
  style={styles.smallBtn}
  labelStyle={styles.smallBtnLabel}
  onPress={() => router.push("/bookappointment")}   
>
  Book
</Button>

              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F5F7FA" },
  card: {
    marginVertical: 10,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "white",
    paddingBottom: 10,
  },
  heading: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#1E1E2E" },
  label: { fontSize: 14, marginVertical: 10, fontWeight: "500", color: "#444" },
  row: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap" },
  chip: {
    margin: 6,
    borderRadius: 20,
    borderColor: "green",
    borderWidth: 1,
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "green",
    borderColor: "green",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  imageGrid: { flexDirection: "row", flexWrap: "wrap" },
  imageCard: {
    margin: 5,
    width: (width - 80) / 3,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  summary: { fontSize: 14, marginVertical: 4, color: "#333" },

  // Button Styles
  mainBtn: {
    backgroundColor: "green",
    borderRadius: 10,
    marginTop: 20,
  },
  btnLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  smallBtn: {
    backgroundColor: "green",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  smallBtnLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Agent Section
  agentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  agentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentName: { fontWeight: "600", fontSize: 15, color: "#222" },
  agentType: { fontSize: 12, color: "#555" },
  agentContact: { fontSize: 12, color: "#888" },
});
