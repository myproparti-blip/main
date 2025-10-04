import React from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import {
  Appbar,
  Card,
  Text,
  Divider,
  ProgressBar,
  Avatar,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Review() {
  const router = useRouter();

  // Dummy Reviews Data
  const reviews = [
    {
      id: 1,
      name: "Anita Sharma",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      comment: "Very professional and explained everything clearly. Highly recommended!",
    },
    {
      id: 2,
      name: "Rahul Verma",
      avatar: "https://randomuser.me/api/portraits/men/50.jpg",
      rating: 4,
      comment: "Good consultation. Suggested great property options in my budget.",
    },
    {
      id: 3,
      name: "Sanjana Rao",
      avatar: "https://randomuser.me/api/portraits/women/55.jpg",
      rating: 5,
      comment: "Excellent experience, very polite and gave detailed market insights.",
    },
    {
      id: 4,
      name: "Vikram Singh",
      avatar: "https://randomuser.me/api/portraits/men/46.jpg",
      rating: 5,
      comment: "Very experienced consultant, helped me finalize a property quickly.",
    },
    {
      id: 5,
      name: "Megha Kapoor",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
      rating: 4,
      comment: "Had a smooth session. Explained the pros and cons in detail.",
    },
  ];

  // Ratings breakdown data
  const ratingStats = [
    { stars: 5, progress: 0.7, count: "70%" },
    { stars: 4, progress: 0.2, count: "20%" },
    { stars: 3, progress: 0.08, count: "8%" },
    { stars: 2, progress: 0.02, count: "2%" },
    { stars: 1, progress: 0, count: "0%" },
  ];

  return (
    <>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content
          title="Consultant Profile"
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>

      <ScrollView style={styles.container}>
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
            <Text style={styles.fee}>💰 ₹1500 / session</Text>
          </Card.Content>
        </Card>

        {/* Ratings Overview in Card */}
        <Card style={styles.reviewCard}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.avgRating}>4.8</Text>
            <Ionicons name="star" size={22} color="#f4b400" />
            <Text style={{ color: "#555", marginLeft: 6 }}>(200+ reviews)</Text>
          </View>

          {ratingStats.map((item) => (
            <View key={item.stars} style={styles.progressRow}>
              <Text style={styles.starLabel}>{item.stars}★</Text>
              <ProgressBar
                progress={item.progress}
                style={styles.progressBar}
                color="#4CAF50"
              />
              <Text style={styles.percent}>{item.count}</Text>
            </View>
          ))}
        </Card>

        {/* Divider */}
        <Divider style={{ marginVertical: 16 }} />

        {/* Customer Reviews */}
        <Text style={styles.sectionTitle}>Customer Reviews</Text>
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <Card style={styles.reviewCard}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Avatar.Image size={48} source={{ uri: item.avatar }} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.reviewerName}>{item.name}</Text>
                  <View style={{ flexDirection: "row" }}>
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={16}
                        color="#f4b400"
                      />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.comment}>{item.comment}</Text>
            </Card>
          )}
        />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: "#1E1E2E" },
  headerTitle: { color: "white", fontWeight: "bold" },
  container: { flex: 1, padding: 16, backgroundColor: "#F9FAFB" },
  card: {
    borderRadius: 16,
    elevation: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  consultantImage: { width: "100%", height: 220 },
  name: { fontSize: 20, fontWeight: "bold", marginTop: 12 },
  subtitle: { fontSize: 14, color: "#555", marginTop: 4 },
  details: { fontSize: 14, color: "#777", marginTop: 2 },
  experience: { fontSize: 14, color: "#444", marginTop: 4 },
  fee: { fontSize: 15, fontWeight: "600", color: "green", marginTop: 6 },

  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avgRating: { fontSize: 28, fontWeight: "bold", marginRight: 6 },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  starLabel: { width: 28, fontSize: 14, fontWeight: "500" },
  progressBar: { flex: 1, height: 10, borderRadius: 6, marginHorizontal: 8 },
  percent: { width: 40, fontSize: 13, color: "#333" },

  reviewCard: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  reviewerName: { fontWeight: "600", fontSize: 15 },
  comment: { marginTop: 6, fontSize: 14, color: "#444", lineHeight: 20 },
});
