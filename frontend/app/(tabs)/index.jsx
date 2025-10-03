import { useNavigation } from "@react-navigation/native";
import * as Location from 'expo-location';
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  ActivityIndicator,
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  IconButton,
  Modal,
  Portal,
  Searchbar,
  Text
} from "react-native-paper";

const { width } = Dimensions.get("window");
const cardWidth = (width - 64) / 3;

export default function HomeScreen() {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const categories = ["Buy","Rent","Commercial","Luxury","PG/Hostels","Plots","Farmhouses","Villas","Apartments","Independent Houses","Office Spaces","Shops","Warehouses","New Projects","Resale"];

  const properties = [
    { title: "3 BHK Luxury Apartment", location: "Connaught Place, Delhi", price: "₹2.5 Cr", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
    { title: "2 BHK Modern Flat", location: "Koramangala, Bangalore", price: "₹85 L", img: "https://images.unsplash.com/photo-1560448075-bb0d5932c27e?auto=format&fit=crop&w=1200&q=80" },
    { title: "4 BHK Penthouse", location: "Marine Drive, Mumbai", price: "₹5.8 Cr", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" },
    { title: "1 BHK Compact Studio", location: "Whitefield, Bangalore", price: "₹45 L", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" },
    { title: "5 BHK Villa", location: "Jubilee Hills, Hyderabad", price: "₹3.2 Cr", img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" },
    { title: "3 BHK Sea View Apartment", location: "Bandra West, Mumbai", price: "₹4.5 Cr", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" },
    { title: "2 BHK Smart Home", location: "Sector 62, Noida", price: "₹68 L", img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" },
    { title: "4 BHK Duplex", location: "Anna Nagar, Chennai", price: "₹1.9 Cr", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
    { title: "3 BHK Garden Apartment", location: "Gachibowli, Hyderabad", price: "₹1.1 Cr", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" },
  ];

  const agents = [
    { name: "Rohan Desai", role: "Luxury Property Consultant", img: "https://randomuser.me/api/portraits/men/75.jpg" },
    { name: "Isha Kapoor", role: "Commercial Specialist", img: "https://randomuser.me/api/portraits/women/65.jpg" },
    { name: "Amit Sharma", role: "Residential Expert", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Patel", role: "Investment Advisor", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Vikram Singh", role: "Premium Property Expert", img: "https://randomuser.me/api/portraits/men/46.jpg" },
    { name: "Neha Reddy", role: "New Projects Specialist", img: "https://randomuser.me/api/portraits/women/68.jpg" },
  ];

  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please enable location to see nearby properties.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings() }
          ]
        );
        setLocationLoading(false);
        return;
      }

      const lastLocation = await Location.getLastKnownPositionAsync();
      const location = lastLocation || await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
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
        const fullAddr = `${addr.name ? addr.name + ", " : ""}${addr.street ? addr.street + ", " : ""}${addr.district ? addr.district + ", " : ""}${addr.city ? addr.city + ", " : ""}${addr.region || ""}`.replace(/,\s*$/, '');
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

  const openModal = (agent) => { setSelectedAgent(agent); setVisible(true); };
  const closeModal = () => setVisible(false);
  const clearSearchAndLocation = () => { setSearchQuery(""); setCurrentLocation(""); setFullAddress(""); };
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  return (
    <>
      <Appbar.Header style={{ backgroundColor: "#009688", elevation: 8 }}>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} color="#fff" />
        <View style={styles.searchContainer}>
          <Searchbar
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchbar}
            inputStyle={{ fontSize:14 }}
            icon={locationLoading ? "crosshairs" : "crosshairs-gps"}
            iconColor={currentLocation ? "#009688" : "#999"}
            onIconPress={detectLocation}
            clearIcon={currentLocation ? "close" : "magnify"}
            clearIconColor={currentLocation ? "#FF5252" : "#999"}
            onClearIconPress={clearSearchAndLocation}
            placeholder="Search location..."
          />
          {locationLoading && <ActivityIndicator size="small" color="#009688" style={styles.loadingIndicator} />}
        </View>
        <Appbar.Action icon="map-marker" onPress={detectLocation} color="#fff" />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.locationBanner}>
          <View style={styles.locationBannerContent}>
            <View style={styles.locationIconContainer}>
              <IconButton
                icon="map-marker"
                iconColor="#fff"
                size={24}
                style={styles.locationIconButton}
              />
            </View>
            <View style={styles.locationTextContainer}>
              {currentLocation ? (
                <>
                  <Text style={styles.locationLabel}>Property in</Text>
                  <Text style={styles.locationCity}>{currentLocation}</Text>
                  {fullAddress && <Text style={styles.locationAddress} numberOfLines={1}>{fullAddress}</Text>}
                </>
              ) : (
                <>
                  <Text style={styles.locationLabel}>No location selected</Text>
                  <Text style={styles.locationCity}>Tap to detect location</Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.locationActions}>
            <Button 
              mode="contained" 
              onPress={detectLocation} 
              style={styles.detectButton}
              labelStyle={styles.detectButtonLabel}
              disabled={locationLoading}
              loading={locationLoading}
            >
              {currentLocation ? "Change" : "Detect"}
            </Button>
          </View>
        </View>

        <Text variant="titleLarge" style={styles.sectionTitle}>🔥 Hot Properties in {currentLocation || "Your Area"}</Text>
        <View style={styles.grid}>
          {properties.map((property, index)=>(
            <Card key={index} style={styles.propertyCard}>
              <Card.Cover source={{ uri:property.img }} style={{ height:100 }} />
              <Card.Content>
                <Text style={styles.propertyTitle}>{property.title}</Text>
                <Text style={styles.propertySubtitle}>{property.location}</Text>
                <Text style={styles.price}>{property.price}</Text>
              </Card.Content>
              <Card.Actions style={{ justifyContent:"center" }}>
                <Button mode="contained" style={styles.buyButton} onPress={()=>router.push("/sale")}>View Details</Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        <Divider style={{ marginVertical:12 }} />

        <Text variant="titleLarge" style={styles.sectionTitle}>🌟 Top Agents in {currentLocation || "Your Area"}</Text>
        <View style={styles.grid}>
          {agents.map((item, index)=>(
            <Card key={index} style={styles.agentCard}>
              <Card.Title title={item.name} subtitle={item.role} left={()=> <Avatar.Image size={35} source={{ uri:item.img }} />} />
              <Card.Actions style={{ justifyContent:"center" }}>
                <Button mode="outlined" style={styles.bookButton} onPress={()=>openModal(item)}>Contact</Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
        <View style={{ height:100 }} />
      </ScrollView>

      <Portal>
        <Modal visible={menuVisible} onDismiss={closeMenu} contentContainerStyle={styles.modalBox}>
          <Text variant="headlineSmall" style={styles.modalTitle}>Menu</Text>
          <View style={{ marginTop:20, gap:10 }}>
            <Button mode="contained" style={styles.modalActionButton} icon="home">Home</Button>
            <Button mode="outlined" style={styles.modalActionButton} icon="account">Profile</Button>
            <Button mode="outlined" style={styles.modalActionButton} icon="heart">Favorites</Button>
            <Button mode="outlined" style={styles.modalActionButton} icon="cog">Settings</Button>
            <Button mode="text" onPress={closeMenu}>Close</Button>
          </View>
        </Modal>

        <Modal visible={visible} onDismiss={closeModal} contentContainerStyle={styles.modalBox}>
          {selectedAgent && (
            <>
              <Avatar.Image size={90} source={{ uri:selectedAgent.img }} style={{ alignSelf:"center", marginBottom:12 }} />
              <Text variant="headlineSmall" style={styles.modalTitle}>{selectedAgent.name}</Text>
              <Text variant="bodyMedium" style={styles.modalSubtitle}>{selectedAgent.role}</Text>
              <View style={{ marginTop:20, gap:10 }}>
                <Button mode="contained" style={styles.modalActionButton} icon="phone">Call Now</Button>
                <Button mode="outlined" style={styles.modalActionButton} icon="whatsapp">WhatsApp</Button>
                <Button mode="text" onPress={closeModal}>Cancel</Button>
              </View>
            </>
          )}
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:"#F5F7FA", padding:16 },
  searchContainer: { flex:1, flexDirection:"row", alignItems:"center", marginRight:8 },
  locationIcon: { marginRight:4, backgroundColor:'rgba(76, 175, 80, 0.1)', borderRadius:20 },
  loadingIndicator: { position:'absolute', top:12, left:12 },
  searchbar: { flex:1, marginVertical:8, borderRadius:30, backgroundColor:"#fff", height:40 },
  sectionTitle: { marginTop:20, marginBottom:10, fontWeight:"bold", color:"#1E1E2E" },
  chipContainer: { flexDirection:"row", flexWrap:"wrap", marginBottom:20 },
  chip: { marginRight:8, marginBottom:8, borderRadius:20, borderColor:"#009688", borderWidth:1, backgroundColor:"#fff", height:32, justifyContent:"center" },
  chipSelected: { backgroundColor:"#009688", borderColor:"#009688" },
  grid: { flexDirection:"row", flexWrap:"wrap", justifyContent:"space-between" },
  propertyCard: { width:cardWidth, marginBottom:16, borderRadius:12, backgroundColor:"#fff", elevation:3 },
  propertyTitle: { fontWeight:"bold", fontSize:12, marginTop:4 },
  propertySubtitle: { fontSize:10, color:"gray" },
  price: { fontWeight:"bold", marginTop:2, fontSize:12, color:"#009688" },
  buyButton: { backgroundColor:"#009688", borderRadius:8, marginHorizontal:4 },
  agentCard: { width:cardWidth, marginBottom:16, borderRadius:12, backgroundColor:"#fff", elevation:3 },
  bookButton: { borderColor:"#009688", borderRadius:8, marginHorizontal:4 },
  modalBox: { backgroundColor:"white", padding:24, margin:20, borderRadius:20, elevation:6 },
  modalTitle: { fontWeight:"bold", textAlign:"center" },
  modalSubtitle: { textAlign:"center", color:"gray", marginBottom:8 },
  modalActionButton: { marginVertical:4 },
  locationBanner: { backgroundColor:'#009688', padding:16, borderRadius:16, marginBottom:16, elevation:6, marginTop:8 },
  locationBannerContent: { flexDirection:'row', alignItems:'center', marginBottom:12 },
  locationIconContainer: { marginRight:12 },
  locationIconButton: { backgroundColor:'rgba(255,255,255,0.2)', margin:0 },
  locationTextContainer: { flex:1 },
  locationLabel: { fontSize:11, color:'rgba(255,255,255,0.9)', fontWeight:'600', textTransform:'uppercase', letterSpacing:0.5 },
  locationCity: { fontSize:20, color:'#fff', fontWeight:'bold', marginTop:2 },
  locationAddress: { fontSize:12, color:'rgba(255,255,255,0.85)', marginTop:4 },
  locationActions: { flexDirection:'row', justifyContent:'flex-end' },
  detectButton: { backgroundColor:'#fff', borderRadius:8 },
  detectButtonLabel: { color:'#009688', fontWeight:'bold', fontSize:12 },
});
