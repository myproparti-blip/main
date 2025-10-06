import { useRouter } from "expo-router";
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";

const { width } = Dimensions.get("window");
const cardWidth = (width - 60) / 3; // 3 columns

const properties = [
  {
    id: 1,
    name: "Sunset Villa",
    location: "Los Angeles, CA",
    status: "Occupied",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=60",
    price: "$850,000",
    description: "Luxury villa with ocean view and private pool.",
  },
  {
    id: 2,
    name: "Ocean Heights",
    location: "Miami, FL",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=600&q=60",
    price: "$720,000",
    description: "Modern beachfront apartment with full amenities.",
  },
  {
    id: 3,
    name: "Skyline Apartment",
    location: "New York, NY",
    status: "Under Maintenance",
    image:
      "https://images.unsplash.com/photo-1600585154154-7127c7d1a2c4?auto=format&fit=crop&w=600&q=60",
    price: "$1,200,000",
    description: "City-view apartment located in the heart of Manhattan.",
  },
  {
    id: 4,
    name: "Palm Residency",
    location: "San Diego, CA",
    status: "Occupied",
    image:
      "https://images.unsplash.com/photo-1600585153706-c2c1d3a5f5f2?auto=format&fit=crop&w=600&q=60",
    price: "$960,000",
    description: "Spacious modern home near the beach.",
  },
  {
    id: 5,
    name: "Mountain Retreat",
    location: "Denver, CO",
    status: "Available",
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=60",
    price: "$540,000",
    description: "Peaceful getaway surrounded by nature.",
  },
  {
    id: 6,
    name: "City Loft",
    location: "Chicago, IL",
    status: "Occupied",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4dfdd?auto=format&fit=crop&w=600&q=60",
    price: "$690,000",
    description: "Modern loft apartment in downtown Chicago.",
  },
];

const Management = () => {
  const router = useRouter();

  const handleOpenDetails = (property) => {
    router.push({
      pathname: "/propertyDetails",
      params: { ...property },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        Property Management
      </Text>

      <View style={styles.grid}>
        {properties.map((property) => (
          <Card key={property.id} style={styles.card}>
            <TouchableOpacity onPress={() => handleOpenDetails(property)}>
              <Image source={{ uri: property.image }} style={styles.image} />
            </TouchableOpacity>
            <Card.Content>
              <Text style={styles.title}>{property.name}</Text>
              <Text style={styles.location}>{property.location}</Text>
              <Text
                style={[
                  styles.status,
                  {
                    color:
                      property.status === "Available"
                        ? "green"
                        : property.status === "Occupied"
                        ? "red"
                        : "orange",
                  },
                ]}
              >
                {property.status}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="outlined"
                textColor="#0066cc"
                onPress={() => handleOpenDetails(property)}
              >
                Details
              </Button>
            </Card.Actions>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9f9f9" },
  header: {
    fontWeight: "700",
    marginBottom: 16,
    color: "#222",
    textAlign: "center",
  },
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
  image: { width: "100%", height: 100, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  title: { fontWeight: "bold", marginTop: 6 },
  location: { fontSize: 12, color: "#666" },
  status: { marginTop: 4, fontWeight: "600" },
});

export default Management;
