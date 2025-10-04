
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Drawer,
  Searchbar,
  Text,
} from "react-native-paper";

const { width } = Dimensions.get("window");
// Use two columns with percentage widths so cards fill available space nicely
const cardWidth = "48%";

export default function HomeScreen() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = React.useState("");
  const [visible, setVisible] = React.useState(false);
  const [selectedAgent, setSelectedAgent] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState("");
  const [fullAddress, setFullAddress] = React.useState("");
  const [locationLoading, setLocationLoading] = React.useState(false);

  // 👇 Drawer animation state
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const slideAnim = React.useRef(new Animated.Value(-250)).current;

  const categories = [
    "Buy",
    "Rent",
    "Commercial",
    "Luxury",
    "PG/Hostels",
    "Plots",
    "Farmhouses",
    "Villas",
    "Apartments",
    "Independent Houses",
    "Office Spaces",
    "Shops",
    "Warehouses",
    "New Projects",
    "Resale",
  ];

  const properties = [
    { title: "3 BHK Luxury Apartment", location: "Connaught Place, Delhi", price: "₹2.5 Cr", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
    { title: "2 BHK Modern Flat", location: "Koramangala, Bangalore", price: "₹85 L", img: "https://images.unsplash.com/photo-1560448075-bb0d5932c27e?auto=format&fit=crop&w=1200&q=80" },
    { title: "4 BHK Penthouse", location: "Marine Drive, Mumbai", price: "₹5.8 Cr", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" },
    { title: "1 BHK Compact Studio", location: "Whitefield, Bangalore", price: "₹45 L", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" },
    { title: "5 BHK Villa", location: "Jubilee Hills, Hyderabad", price: "₹3.2 Cr", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" },
  ];

  const agents = [
    { name: "Rohan Desai", role: "Luxury Property Consultant", img: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Isha Kapoor", role: "Commercial Specialist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Amit Sharma", role: "Residential Expert", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  ];

  React.useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location to see nearby properties.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () =>
                Platform.OS === "ios"
                  ? Linking.openURL("app-settings:")
                  : Linking.openSettings(),
            },
          ]
        );
        setLocationLoading(false);
        return;
      }

      const lastLocation = await Location.getLastKnownPositionAsync();
      const location =
        lastLocation ||
        (await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Highest,
        }));
      await setLocation(location.coords);
    } catch (err) {
      console.log("Location error", err);
      Alert.alert("Error", "Unable to detect your location.");
    } finally {
      setLocationLoading(false);
    }
  };

  const setLocation = async (coords) => {
    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const addr = geocode[0];
        const area = addr.district || addr.city || "Your Area";
        const fullAddr = `${addr.name ? addr.name + ", " : ""}${addr.street ? addr.street + ", " : ""
          }${addr.district ? addr.district + ", " : ""}${addr.city ? addr.city + ", " : ""
          }${addr.region || ""}`.replace(/,\s*$/, "");
        setCurrentLocation(area);
        setFullAddress(fullAddr);
        setSearchQuery(fullAddr);
      }
    } catch (err) {
      console.log("Reverse geocode failed", err);
      setCurrentLocation("Your Area");
      setSearchQuery("Your Area");
    }
  };

  // 👇 Drawer open/close animations
  const toggleDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: drawerOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(!drawerOpen));
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -250,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setDrawerOpen(false));
  };

  return (
    <>
      {/* App Header */}
      <Appbar.Header style={{ backgroundColor: "#009688", elevation: 8 }}>
        <Appbar.Action icon="menu" onPress={toggleDrawer} color="#fff" />
        <View style={styles.searchContainer}>
          <Searchbar
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
            inputStyle={{ fontSize: 14 }}
            icon={locationLoading ? "crosshairs" : "crosshairs-gps"}
            iconColor={currentLocation ? "#009688" : "#999"}
            onIconPress={detectLocation}
            clearIcon={currentLocation ? "close" : "magnify"}
            clearIconColor={currentLocation ? "#FF5252" : "#999"}
            onClearIconPress={() => {
              setSearchQuery("");
              setCurrentLocation("");
              setFullAddress("");
            }}
          />
          {locationLoading && (
            <ActivityIndicator
              size="small"
              color="#009688"
              style={styles.loadingIndicator}
            />
          )}
        </View>
      </Appbar.Header>

      {/* Main content */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>


        {/* Short paragraph above chips */}
        <Text style={styles.paragraph}>Filter properties by category:</Text>
        {/* Category chips (wrapped rows above hot properties) */}
        <View style={styles.chipsContainerRow}>
          {categories.map((cat) => (
            <Chip
              key={cat}
              onPress={() => setActiveCategory(activeCategory === cat ? "" : cat)}
              style={[
                styles.chip,
                activeCategory === cat ? styles.chipActive : styles.chipOutline,
              ]}
              textStyle={activeCategory === cat ? styles.chipTextActive : styles.chipText}
            >
              {cat}
            </Chip>
          ))}


        </View>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          🔥 Hot Properties in {currentLocation || "Your Area"}
        </Text>
        <View style={styles.grid}>
          {properties.map((property, index) => (
            <Card key={index} style={styles.propertyCard}>
              <Card.Cover source={{ uri: property.img }} style={{ height: 100 }} />
              <Card.Content>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertySubtitle}>{property.location}</Text>
                <Text style={styles.price}>{property.price}</Text>
              </Card.Content>
              <Card.Actions style={{ justifyContent: "center" }}>
                <Button
                  mode="contained"
                  style={styles.buyButton}
                  onPress={() => router.push("/sale")}
                >
                  Buy
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        <Divider style={{ marginVertical: 12 }} />

        <Text variant="titleLarge" style={styles.sectionTitle}>
          🌟 Top Agents
        </Text>

        <View style={styles.grid}>
          {agents.map((item, index) => (
            <Card key={index} style={styles.agentCard}>
              <Card.Title
                title={item.name}
                subtitle={item.role}
                left={() => (
                  <Avatar.Image size={35} source={{ uri: item.img }} />
                )}
              />
              <Card.Actions style={{ justifyContent: "center" }}>
                <Button mode="contained" style={styles.bookButton} onPress={() => router.push('/bookappointment')}>
                  Book
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Drawer Sidebar */}
      <Animated.View
        style={[
          styles.drawerContainer,
          { left: slideAnim },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Avatar.Image
            size={60}
            source={{ uri: "https://randomuser.me/api/portraits/men/41.jpg" }}
          />
          <Text style={styles.drawerName}>John Doe</Text>
          <Text style={styles.drawerEmail}>john.doe@email.com</Text>
        </View>

        <Drawer.Section style={{ marginTop: 16 }}>
          <Drawer.Item label="Home" icon="home" onPress={closeDrawer} />
          <Drawer.Item label="Properties" icon="office-building" onPress={closeDrawer} />
          {/* Favorites and Account removed from drawer */}
        </Drawer.Section>

        <Divider />
        <Drawer.Item label="Logout" icon="logout" onPress={closeDrawer} />
      </Animated.View>

      {/* Transparent overlay to close drawer */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 16 },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", marginRight: 8 },
  loadingIndicator: { position: "absolute", top: 12, left: 12 },
  searchbar: { flex: 1, marginVertical: 8, borderRadius: 30, backgroundColor: "#fff", height: 40 },
  sectionTitle: { marginTop: 20, marginBottom: 10, fontWeight: "bold", color: "#1E1E2E" },
  paragraph: { fontSize: 14, color: '#333', marginBottom: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8 },
  propertyCard: { width: cardWidth, marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", elevation: 3, overflow: 'hidden' },
  propertyTitle: { fontWeight: "bold", fontSize: 12, marginTop: 4 },
  propertySubtitle: { fontSize: 10, color: "gray" },
  price: { fontWeight: "bold", marginTop: 2, fontSize: 12, color: "#009688" },
  buyButton: { backgroundColor: "#009688", borderRadius: 8, marginHorizontal: 4, paddingHorizontal: 12, minWidth: 80 },
  agentCard: { width: cardWidth, marginBottom: 16, borderRadius: 12, backgroundColor: "#fff", elevation: 3, overflow: 'hidden' },
  bookButton: { backgroundColor: "#009688", borderRadius: 8, marginHorizontal: 4, paddingHorizontal: 12, minWidth: 80 },
  chipsContainer: { paddingVertical: 8, paddingHorizontal: 4, marginBottom: 8 },
  chipsContainerRow: { paddingVertical: 8, paddingHorizontal: 4, marginBottom: 8, alignItems: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: 8, marginBottom: 8, backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  chipOutline: { borderWidth: 1, borderColor: '#009688', backgroundColor: '#fff' },
  chipActive: { backgroundColor: '#009688', borderWidth: 1, borderColor: '#009688' },
  chipText: { color: '#004D40', fontSize: 14 },
  chipTextActive: { color: '#fff', fontSize: 14 },
  drawerContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: "#fff",
    elevation: 10,
    paddingTop: 50,
    zIndex: 100,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 50,
  },
  drawerHeader: {
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  drawerName: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  drawerEmail: {
    fontSize: 12,
    color: "gray",
  },
});
