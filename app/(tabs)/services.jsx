import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import SearchMenuBar from "../components/SearchMenuBar";


const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 2;

// Dummy consultant data (replace with API later)
const consultants = [
  {
    id: 1,
    name: "Ravi Sharma",
    designation: "Property Consultant",
    experience: "6 years",
    location: "Surat, Gujarat",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1603415526960-f7e0328a1ec0?auto=format&fit=crop&w=600&q=60",
    fees: "₹1500 / session",
  },
  {
    id: 2,
    name: "Anjali Mehta",
    designation: "Investment Advisor",
    experience: "5 years",
    location: "Mumbai, Maharashtra",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=60",
    fees: "₹1200 / session",
  },
  {
    id: 3,
    name: "Rahul Verma",
    designation: "Legal Consultant",
    experience: "8 years",
    location: "Pune, Maharashtra",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1598970434795-0c54fe7c0644?auto=format&fit=crop&w=600&q=60",
    fees: "₹2000 / session",
  },
  {
    id: 4,
    name: "Sneha Patel",
    designation: "Real Estate Expert",
    experience: "7 years",
    location: "Ahmedabad, Gujarat",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=60",
    fees: "₹1800 / session",
  },
];

export default function Services() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  // ✅ Filter consultants by search
  const filteredConsultants = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return consultants.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.designation.toLowerCase().includes(query) ||
        c.location.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // ✅ Detect location simulation
  const detectLocation = async () => {
    try {
      setLocationLoading(true);
      setTimeout(() => {
        setCurrentLocation("Surat, Gujarat");
        setLocationLoading(false);
      }, 1500);
    } catch (err) {
      setLocationLoading(false);
      console.error("Location error:", err);
    }
  };

  // ✅ Navigate to consultant details (works inside tabs)
  const handleOpenDetails = (consultant) => {
    router.push({
      pathname: "/consultantDetails",
      params: { ...consultant },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {/* ✅ Search bar on top */}
      <SearchMenuBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchChange={setSearchQuery}
        detectLocation={detectLocation}
        locationLoading={locationLoading}
        currentLocation={currentLocation}
      />

      {/* ✅ Consultants Grid */}
      <ScrollView style={styles.container}>
        {filteredConsultants.length > 0 ? (
          <View style={styles.grid}>
            {filteredConsultants.map((consultant) => (
              <Card key={consultant.id} style={styles.card}>
                <TouchableOpacity onPress={() => handleOpenDetails(consultant)}>
                  <Image source={{ uri: consultant.image }} style={styles.image} />
                </TouchableOpacity>
                <Card.Content>
                  <Text style={styles.name}>{consultant.name}</Text>
                  <Text style={styles.designation}>{consultant.designation}</Text>
                  <Text style={styles.location}>{consultant.location}</Text>
                  <Text style={styles.experience}>Experience: {consultant.experience}</Text>
                  <Text style={styles.rating}>⭐ {consultant.rating}</Text>
                  <Text style={styles.fees}>{consultant.fees}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button
                    mode="contained-tonal"
                    textColor="#00796B"
                    onPress={() => handleOpenDetails(consultant)}
                  >
                    Book Now
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={{ color: "#666", fontSize: 16 }}>No consultants found</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: cardWidth,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  name: { fontWeight: "bold", marginTop: 6 },
  designation: { fontSize: 12, color: "#666" },
  location: { fontSize: 12, color: "#888" },
  experience: { marginTop: 2, fontSize: 12, color: "#555" },
  rating: { marginTop: 4, color: "#FFD700", fontWeight: "bold" },
  fees: { color: "#009688", marginTop: 4, fontWeight: "bold" },
  empty: { alignItems: "center", justifyContent: "center", marginTop: 100 },
});
