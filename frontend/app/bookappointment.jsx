import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import {
  Appbar,
  Card,
  Avatar,
  Text,
  Button,
  Divider,
  Portal,
  Dialog,
  Chip,
} from "react-native-paper";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function BookAppointment() {
  const router = useRouter();
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content title="Book Consultation" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.container}>
        {/* Consultant Card */}
        <Card style={styles.card}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.consultantImage}
          />
          <Card.Content>
            <Text style={styles.name}>Mr. Ramesh Kumar</Text>
            <Text style={styles.subtitle}>🏢 Dream Homes Realty</Text>
            <Text style={styles.details}>📍 Hyderabad</Text>
            <Text style={styles.experience}>💼 10+ years experience</Text>

            {/* Languages Section */}
            <View style={styles.languageContainer}>
              <Text style={styles.languageLabel}>🗣️ Languages:</Text>
              <View style={styles.languageChips}>
                <Chip mode="outlined" style={styles.chip}>English</Chip>
                <Chip mode="outlined" style={styles.chip}>Hindi</Chip>
                <Chip mode="outlined" style={styles.chip}>Telugu</Chip>
              </View>
            </View>

            {/* Reviews */}
            <TouchableOpacity onPress={() => router.push("/reviews")}>
              <Text style={styles.rating}>⭐ 4.8 (200+ reviews)</Text>
            </TouchableOpacity>

            <Text style={styles.fee}>💰 ₹1500 / session</Text>
          </Card.Content>
        </Card>

        <Divider style={{ marginVertical: 20 }} />

        {/* Book Button */}
        <Button
          mode="contained"
          style={styles.bookBtn}
          labelStyle={{ fontWeight: "600", fontSize: 16, color: "#fff" }}
          onPress={() => setDialogVisible(true)}
        >
          Book Appointment
        </Button>
      </View>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>✅ Appointment Confirmed</Dialog.Title>
          <Dialog.Content>
            <Text>
              Your consultation with{" "}
              <Text style={{ fontWeight: "bold" }}>Mr. Ramesh Kumar</Text> has
              been successfully booked.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#1E1E2E",
    elevation: 4,
  },
  headerTitle: {
    color: "white",
    fontWeight: "bold",
  },
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  card: {
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  consultantImage: {
    width: "100%",
    height: 220,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  experience: {
    fontSize: 14,
    color: "#444",
    marginTop: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: "600",
    color: "#f4b400",
    marginTop: 6,
  },
  fee: {
    fontSize: 15,
    fontWeight: "600",
    color: "green",
    marginTop: 6,
  },
  bookBtn: {
    backgroundColor: "green",
    borderRadius: 12,
    paddingVertical: 10,
  },
  languageContainer: {
    marginTop: 10,
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  languageChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  chip: {
    marginRight: 6,
    borderRadius: 20,
  },
});
