import { MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import SearchMenuBar from "../components/SearchMenuBar";
import { getConsultants } from "../services/consultants";

const { width } = Dimensions.get("window");
const cardWidth = width / 3.3;

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = React.useState("Search consultants or properties");
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [consultants, setConsultants] = React.useState([]);
  const [loadingConsultants, setLoadingConsultants] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const router = useRouter();
  const { logout } = useAuth();

  React.useEffect(() => {
    detectLocation();
  }, []);

  React.useEffect(() => {
    if (currentLocation && currentLocation !== "Search consultants or properties") {
      fetchConsultantsByLocation();
    }
  }, [currentLocation]);

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location Permission Required", "Please enable location to see nearby consultants.", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () =>
              Platform.OS === "ios" ? Linking.openURL("app-settings:") : Linking.openSettings(),
          },
        ]);
        setLocationLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const geocode = await Location.reverseGeocodeAsync(location.coords);

      if (geocode.length > 0) {
        const { city, district, name } = geocode[0];
        const detected = city || district || name || "Your Area";
        setCurrentLocation(detected);
        setSearchQuery(detected);
      } else {
        setCurrentLocation("Your Area");
      }
    } catch (err) {
      console.error("Location error:", err);
      setCurrentLocation("Your Area");
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchConsultantsByLocation = async () => {
    try {
      setLoadingConsultants(true);
      const allConsultants = await getConsultants();
      const filtered = allConsultants.filter((c) =>
        c.location?.toLowerCase().includes(currentLocation.toLowerCase())
      );
      setConsultants(filtered);
    } catch (error) {
      console.error("Error fetching consultants:", error);
    } finally {
      setLoadingConsultants(false);
    }
  };

  const formatImage = (image) => {
    if (!image) return "https://via.placeholder.com/150";
    if (image.startsWith("http")) return image;
    return `http://192.168.29.194:5000${image}`;
  };

  const getTimePrice = (c) => {
    const time = c.time || c.duration || "30 min";
    const price = c.money || c.price || "1800";
    return `${time} - ₹${price}`;
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600",
      }}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <SearchMenuBar
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        detectLocation={detectLocation}
        locationLoading={locationLoading}
        currentLocation={currentLocation}
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          {/* ✅ Section Header with working “View All” */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Consultants in {currentLocation}</Text>
            <TouchableOpacity onPress={() => router.push("/services")}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {loadingConsultants ? (
            <ActivityIndicator animating color="#fff" size="large" />
          ) : consultants.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text style={{ color: "#fff", textAlign: "center", marginBottom: 10 }}>
                No consultants found in {currentLocation}.
              </Text>
              <Button mode="outlined" textColor="#fff" onPress={fetchConsultantsByLocation}>
                Retry
              </Button>
            </View>
          ) : (
            <View style={styles.grid}>
              {consultants.map((c) => (
                <TouchableOpacity
                  key={c._id}
                  style={styles.touchCard}
                  onPress={() => router.push("/services")}
                >
                  <Card style={styles.card}>
                    <Image source={{ uri: formatImage(c.image) }} style={styles.cardImage} />

                    <Card.Content>
                      <Text style={styles.consultName}>{c.name}</Text>
                      <Text style={styles.consultType}>{c.designation}</Text>

                      <View style={styles.ratingRow}>
                        <MaterialIcons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>
                          {c.rating || "N/A"} ({c.reviewsCount || 0})
                        </Text>
                      </View>

                      <Text style={styles.consultMeta}>Exp - {c.experience || "N/A"} yrs</Text>

                      {c.languages && c.languages.length > 0 && (
                        <Text style={styles.lang}>{c.languages.join(", ")}</Text>
                      )}

                      {/* ✅ Proper time-price format */}
                      <Text style={styles.priceText}>{getTimePrice(c)}</Text>

                      <Text style={styles.location}>{c.location}</Text>

                      <Button
                        mode="contained"
                        buttonColor="#009688"
                        textColor="#fff"
                        style={styles.bookBtn}
                        onPress={() => router.push("/services")}
                      >
                        Book
                      </Button>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, padding: 16 },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  viewAll: { color: "#00E5FF", fontSize: 14, fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  touchCard: { width: cardWidth, marginBottom: 12 },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    height: 320,
  },
  cardImage: {
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    margin: 6,
  },
  consultName: { fontWeight: "bold", fontSize: 13, color: "#222" },
  consultType: { fontSize: 11, color: "#009688", marginTop: 2 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  ratingText: { fontSize: 10.5, marginLeft: 3, color: "#333" },
  consultMeta: { fontSize: 11, color: "#444", lineHeight: 16 },
  lang: { fontSize: 10.5, color: "#555", marginTop: 3 },
  priceText: { fontSize: 11, color: "#00796B", fontWeight: "600", marginTop: 4 },
  location: { fontSize: 10.5, color: "#555", marginTop: 4 },
  bookBtn: { marginTop: 6, borderRadius: 6 },
});
