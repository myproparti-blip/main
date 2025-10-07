import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  Appbar,
  Button,
  Card,
  Divider,
  Menu,
  Searchbar,
  Text,
} from "react-native-paper";
import { useAuth } from "../../context/AuthContext";


const { width } = Dimensions.get("window");
const cardWidth = width / 3.3;

export default function HomeScreen() {


  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentLocation, setCurrentLocation] = React.useState("Search consultants or properties");
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    router.replace("/auth/login");
  };

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

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
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

  // === Property & Consultant Data ===
  const propertyData = [
    {
      title: "Book Consultant",
      route: "services",
      items: [
        {
          id: "c1",
          name: "Amit Sharma",
          type: "Luxury Expert",
          experience: "8 yrs",
          city: "Mumbai",
          languages: ["Eng", "Hin", "Mar"],
          timePrice: "30 min – ₹1000",
          reviews: "⭐ 4.9 (112)",
          img: "https://randomuser.me/api/portraits/men/75.jpg",
        },
        {
          id: "c2",
          name: "Priya Mehta",
          type: "Retail Expert",
          experience: "6 yrs",
          city: "Delhi",
          languages: ["Eng", "Hin", "Guj"],
          timePrice: "45 min – ₹1200",
          reviews: "⭐ 4.8 (89)",
          img: "https://randomuser.me/api/portraits/women/68.jpg",
        },
        {
          id: "c3",
          name: "Ravi Kumar",
          type: "Lease Agent",
          experience: "5 yrs",
          city: "Chennai",
          languages: ["Eng", "Tam"],
          timePrice: "25 min – ₹900",
          reviews: "⭐ 4.7 (76)",
          img: "https://randomuser.me/api/portraits/men/60.jpg",
        },
        {
          id: "c4",
          name: "Neha Gupta",
          type: "Home Advisor",
          experience: "7 yrs",
          city: "Pune",
          languages: ["Eng", "Hin"],
          timePrice: "40 min – ₹1100",
          reviews: "⭐ 5.0 (130)",
          img: "https://randomuser.me/api/portraits/women/85.jpg",
        },
        {
          id: "c5",
          name: "Karan Patel",
          type: "Sale Expert",
          experience: "9 yrs",
          city: "Ahm",
          languages: ["Eng", "Guj"],
          timePrice: "30 min – ₹1500",
          reviews: "⭐ 4.8 (102)",
          img: "https://randomuser.me/api/portraits/men/81.jpg",
        },
        {
          id: "c6",
          name: "Sneha Nair",
          type: "Villa Agent",
          experience: "6 yrs",
          city: "Kochi",
          languages: ["Eng", "Mal"],
          timePrice: "35 min – ₹1300",
          reviews: "⭐ 4.9 (98)",
          img: "https://randomuser.me/api/portraits/women/71.jpg",
        },
      ],
    },
    {
      title: "Property Listing",
      route: "explore",
      items: [
        {
          id: "l1",
          title: "3 BHK Modern Apartment",
          location: "Delhi",
          price: "₹1.8 Cr",
          img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "l2",
          title: "2 BHK Premium Flat",
          location: "Hyderabad",
          price: "₹85 L",
          img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "l3",
          title: "Luxury Penthouse Suite",
          location: "Mumbai",
          price: "₹3.5 Cr",
          img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "l4",
          title: "Cozy 1 BHK Apartment",
          location: "Pune",
          price: "₹45 L",
          img: "https://images.unsplash.com/photo-1600585154208-1fe8a8a48b0b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "l5",
          title: "Beach View Villa",
          location: "Goa",
          price: "₹2.8 Cr",
          img: "https://images.unsplash.com/photo-1600585154154-14b54d8d5e4c?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "l6",
          title: "Downtown Studio Apartment",
          location: "Bangalore",
          price: "₹60 L",
          img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    {
      title: "Property Management",
      route: "management",
      items: [
        {
          id: "m1",
          title: "Property Maintenance",
          location: "Pan India",
          price: "₹10K/month",
          img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "m2",
          title: "Tenant & Lease Handling",
          location: "Delhi NCR",
          price: "₹15K/month",
          img: "https://images.unsplash.com/photo-1600585154208-1fe8a8a48b0b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "m3",
          title: "Facility Management",
          location: "Mumbai",
          price: "₹20K/month",
          img: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "m4",
          title: "Security & Cleaning Services",
          location: "Hyderabad",
          price: "₹12K/month",
          img: "https://images.unsplash.com/photo-1600585154234-4e2390c3b8f0?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "m5",
          title: "Renovation & Repair",
          location: "Chennai",
          price: "₹18K/month",
          img: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: "m6",
          title: "Inventory & Asset Tracking",
          location: "Bangalore",
          price: "₹25K/month",
          img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
  ];

  const renderSection = (section) => (
    <View style={styles.section} key={section.title}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push(`/${section.route}`)}
        >
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        {section.items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(`/${section.route}`)}
            style={styles.touchCard}
          >
            <Card style={styles.card}>
              <Card.Cover source={{ uri: item.img }} style={styles.cardImage} />
              <Card.Content>
                {section.title === "Book Consultant" ? (
                  <>
                    <Text style={styles.consultName}>{item.name}</Text>
                    <Text style={styles.consultType}>{item.type}</Text>
                    <Text style={styles.consultReview}>{item.reviews}</Text>
                    <Text style={styles.consultMeta}>
                      {item.experience} • {item.city}
                    </Text>
                    <Text style={styles.consultMeta}>
                      {item.languages.join(", ")}
                    </Text>
                    <Text style={styles.timePrice}>{item.timePrice}</Text>
                    <Button
                      mode="contained"
                      buttonColor="#009688"
                      textColor="#fff"
                      style={styles.bookBtn}
                    >
                      Book
                    </Button>
                  </>
                ) : (
                  <>
                    <Text style={styles.propertyTitle}>{item.title}</Text>
                    <Text style={styles.propertySubtitle}>{item.location}</Text>
                    <Text style={styles.price}>{item.price}</Text>
                  </>
                )}
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600",
      }}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <Appbar.Header
        style={{ backgroundColor: "rgba(0,150,136,0.85)", elevation: 8 }}
      >
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder={
              locationLoading
                ? "Detecting your location..."
                : currentLocation
                  ? ` ${currentLocation}`
                  : "Search consultants or properties"
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
            inputStyle={{ fontSize: 14 }}
            icon={locationLoading ? "loading" : "crosshairs-gps"}
            iconColor={currentLocation ? "#009688" : "#999"}
            onIconPress={detectLocation}
          />

        </View>

       <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Appbar.Action
            icon="dots-vertical"
            color="#fff"
            onPress={() => setMenuVisible(true)}
          />
        }
      >
        <Menu.Item onPress={() => router.push("/index")} title="Home" />
        <Menu.Item onPress={() => router.push("/explore")} title="Properties" />
        <Menu.Item onPress={() => router.push("/management")} title="Management" />
        <Divider />
        <Menu.Item onPress={() => router.push("/profile")} title="Profile" />
        <Menu.Item onPress={() => router.push("/settings")} title="Settings" />
        <Divider />
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu>
      </Appbar.Header>



      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {propertyData.map(renderSection)}
        <View style={{ height: 100 }} />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, padding: 16 },
  searchContainer: { flex: 1, marginHorizontal: 10 },
  searchbar: {
    borderRadius: 30,
    elevation: 2,
    backgroundColor: "#fff",
  },
  locationWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  locationChip: {
    backgroundColor: "#E0F2F1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#009688",
  },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#fff" },
  viewAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  viewAll: { color: "#fff", fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  touchCard: { width: cardWidth, marginBottom: 12 },
  card: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.55)",
    height: 290,
  },
  cardImage: {
    height: 100,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    margin: 6,
  },
  consultName: { fontWeight: "bold", fontSize: 13, color: "#222" },
  consultType: { fontSize: 11, color: "#009688", marginTop: 2 },
  consultReview: { fontSize: 11, color: "#fbc02d", marginVertical: 2 },
  consultMeta: { fontSize: 11, color: "#444", lineHeight: 16 },
  timePrice: {
    fontSize: 11,
    color: "#00796B",
    fontWeight: "600",
    marginTop: 4,
  },
  bookBtn: { marginTop: 6, borderRadius: 6 },
  propertyTitle: { fontWeight: "bold", fontSize: 12, color: "#222" },
  propertySubtitle: { fontSize: 10, color: "#555" },
  price: { fontWeight: "bold", fontSize: 11, color: "#009688" },
});
