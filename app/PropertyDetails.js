import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Button, Card, IconButton, Text } from "react-native-paper";
import Swiper from "react-native-swiper";
import { getListingById } from "./services/listingtab";

const STATIC_TOKEN = "my_static_token_123"; // For testing
const screenWidth = Dimensions.get("window").width;

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getListingById(id, STATIC_TOKEN);
        setProperty(data);
      } catch (error) {
        console.error("Error loading property:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id]);

  if (loading)
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ marginTop: 10 }}>Loading property details...</Text>
      </View>
    );

  if (!property)
    return (
      <View style={styles.centered}>
        <Text>No property found</Text>
        <Button onPress={() => router.back()} style={{ marginTop: 10 }}>
          Go Back
        </Button>
      </View>
    );

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <View style={{ flexDirection: "row" }}>
          <IconButton icon="magnify" size={28} onPress={() => alert("Search coming soon")} />
          <IconButton icon="share-variant" size={28} onPress={() => alert("Share coming soon")} />
        </View>
      </View>

      {/* Image Slider */}
      <Card style={{ borderRadius: 12, marginBottom: 15 }}>
        <Swiper
          style={{ height: 250 }}
          showsPagination
          loop={false}
          containerStyle={{ borderRadius: 12 }}
        >
          {property.images?.length > 0
            ? property.images.map((img, idx) => (
                <Card.Cover
                  key={idx}
                  source={{ uri: img.startsWith("http") ? img : `${apiUrl}/${img}` }}
                  style={{ height: 250, width: screenWidth - 20, borderRadius: 12 }}
                />
              ))
            : (
                <Card.Cover
                  source={{ uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png" }}
                  style={{ height: 250, width: screenWidth - 20, borderRadius: 12 }}
                />
              )}
        </Swiper>

        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>
            {property.title || "No Title"}
          </Text>
          <Text variant="titleMedium" style={styles.price}>
            ₹{property.price?.toLocaleString() || "N/A"}
          </Text>
          <Text style={styles.subText}>
            {property.propertyType || "Type N/A"} • {property.listingType || "Listing N/A"}
          </Text>
          <Text style={styles.description}>{property.description || "No description available"}</Text>

          {/* Key Details */}
          <Text style={styles.detail}>📍 {property.city || "City N/A"}, {property.state || "State N/A"}</Text>
          <Text style={styles.detail}>🛋 Furnishing: {property.furnishing || "N/A"}</Text>
          <Text style={styles.detail}>📐 Area: {property.builtUpArea || "N/A"} sq.ft</Text>
          <Text style={styles.detail}>🧾 Status: {property.status || "N/A"}</Text>
        </Card.Content>
      </Card>

      {/* Other Sections */}
      {[
        { title: "More About This Flat", value: property.moreAbout },
        { title: "Top Amenities", value: property.amenities?.join(", ") },
        { title: "Specifications", value: property.specifications?.map(s => `• ${s}`).join("\n") },
        { title: "Why Buy This Project", value: property.whyBuy },
        { title: "Ratings & Reviews", value: property.reviews?.map(r => `• ${r.user}: ⭐${r.rating} - ${r.comment}`).join("\n") },
        { title: "Compare Similar Projects", value: property.similarProjects?.map(p => `• ${p.title} - ₹${p.price?.toLocaleString()}`).join("\n") },
        { title: "What's Nearby", value: property.nearby?.join(", ") },
      ].map((section, idx) => (
        <Card key={idx} style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>{section.title}</Text>
            <Text>{section.value || "Information not available"}</Text>
          </Card.Content>
        </Card>
      ))}

      {/* Map */}
      {property.location?.latitude && property.location?.longitude && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
            <MapView
              style={{ width: "100%", height: 200, borderRadius: 12 }}
              initialRegion={{
                latitude: property.location.latitude,
                longitude: property.location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: property.location.latitude,
                  longitude: property.location.longitude,
                }}
                title={property.title}
              />
            </MapView>
          </Card.Content>
        </Card>
      )}

      {/* Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 20 }}>
        <Button
          mode="outlined"
          textColor="#009688"
          onPress={() => router.back()}
          style={{ flex: 1, marginRight: 6 }}
        >
          Back
        </Button>

        <Button
          mode="contained"
          buttonColor="#009688"
          style={{ flex: 1, marginLeft: 6 }}
          onPress={() => alert("Contact feature coming soon")}
        >
          Contact Seller
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: "#E0F2F1" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontWeight: "bold", marginTop: 12, fontSize: 20 },
  price: { marginTop: 6, color: "#009688", fontSize: 18 },
  subText: { marginTop: 4, color: "#555", fontSize: 14 },
  description: { marginTop: 8, color: "#555", fontSize: 14 },
  detail: { marginTop: 5, fontSize: 13 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 15 },
  sectionCard: { borderRadius: 12, marginBottom: 15, padding: 8 },
  sectionTitle: { fontWeight: "bold", marginBottom: 6, fontSize: 15 },
});