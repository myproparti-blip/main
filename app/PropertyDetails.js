import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, IconButton, Text } from "react-native-paper";
import Swiper from "react-native-swiper"; // ✅ For multiple image slider
import { getListingById } from "./services/listingtab";

const STATIC_TOKEN = "my_static_token_123"; // For testing

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
    <ScrollView style={styles.container}>
      {/* Top bar: Back, Search, Share */}
      <View style={styles.topBar}>
        <IconButton icon="arrow-left" size={28} onPress={() => router.back()} />
        <View style={{ flexDirection: "row" }}>
          <IconButton icon="magnify" size={28} onPress={() => alert("Search feature coming soon")} />
          <IconButton icon="share-variant" size={28} onPress={() => alert("Share feature coming soon")} />
        </View>
      </View>

      {/* Image slider */}
      <Card style={{ borderRadius: 10, marginBottom: 15 }}>
        <Swiper style={{ height: 250 }} showsPagination={true} loop={false}>
          {property.images?.length > 0
            ? property.images.map((img, index) => (
                <Card.Cover
                  key={index}
                  source={{ uri: `${apiUrl}/${img}` }}
                  style={{ height: 250 }}
                />
              ))
            : (
              <Card.Cover
                source={{ uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png" }}
                style={{ height: 250 }}
              />
            )}
        </Swiper>

        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>{property.title}</Text>
          <Text variant="titleMedium" style={styles.price}>₹{property.price?.toLocaleString()}</Text>
          <Text style={styles.subText}>{property.propertyType} • {property.listingType}</Text>
          <Text style={styles.description}>{property.description || "No description available"}</Text>

          {/* Key details */}
          <Text style={styles.detail}>📍 {property.city}, {property.state}</Text>
          <Text style={styles.detail}>🛋 Furnishing: {property.furnishing || "N/A"}</Text>
          <Text style={styles.detail}>📐 Area: {property.builtUpArea || "N/A"} sq.ft</Text>
          <Text style={styles.detail}>🧾 Status: {property.status}</Text>
        </Card.Content>
      </Card>

      {/* More about this flat */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>More About This Flat</Text>
          <Text>{property.moreAbout || "Details not available"}</Text>
        </Card.Content>
      </Card>

      {/* Top Amenities */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Top Amenities</Text>
          <Text>{property.amenities?.join(", ") || "Not listed"}</Text>
        </Card.Content>
      </Card>

      {/* Specifications */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Specifications</Text>
          {property.specifications?.map((spec, idx) => (
            <Text key={idx}>• {spec}</Text>
          )) || <Text>Not listed</Text>}
        </Card.Content>
      </Card>

      {/* Why Buy This Project */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Why Buy This Project</Text>
          <Text>{property.whyBuy || "Information not available"}</Text>
        </Card.Content>
      </Card>

      {/* Ratings & Reviews */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Ratings & Reviews</Text>
          {property.reviews?.length > 0
            ? property.reviews.map((rev, idx) => (
                <View key={idx} style={{ marginBottom: 8 }}>
                  <Text style={{ fontWeight: "bold" }}>{rev.user}</Text>
                  <Text>⭐ {rev.rating}/5</Text>
                  <Text>{rev.comment}</Text>
                </View>
              ))
            : <Text>No reviews yet</Text>}
        </Card.Content>
      </Card>

      {/* Compare Similar Projects */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>Compare Similar Projects</Text>
          {property.similarProjects?.length > 0
            ? property.similarProjects.map((proj, idx) => (
                <Text key={idx}>• {proj.title} - ₹{proj.price?.toLocaleString()}</Text>
              ))
            : <Text>No similar projects</Text>}
        </Card.Content>
      </Card>

      {/* Nearby Places */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>What's Nearby</Text>
          <Text>{property.nearby?.join(", ") || "Not available"}</Text>
        </Card.Content>
      </Card>

      Map
      {property.location?.latitude && property.location?.longitude && (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>Location</Text>
            <MapView
              style={{ width: "100%", height: 200, borderRadius: 10 }}
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

      {/* Contact / Back Buttons */}
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
  title: { fontWeight: "bold", marginTop: 10 },
  price: { marginTop: 5, color: "#009688" },
  subText: { marginTop: 4, color: "#555" },
  description: { marginTop: 8, color: "#555" },
  detail: { marginTop: 5 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  sectionCard: { borderRadius: 10, marginBottom: 15, padding: 5 },
  sectionTitle: { fontWeight: "bold", marginBottom: 5 },
});
