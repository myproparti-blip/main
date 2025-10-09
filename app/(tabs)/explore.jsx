import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  Chip,
  FAB,
  Portal,
  Text,
} from "react-native-paper";
import SearchMenuBar from "../components/SearchMenuBar";
import { fetchingListingData } from "../services/listingtab";

const BASE_URL = "http://192.168.29.78:5000";

export default function ExplorerScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);

  const [filterVisible, setFilterVisible] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("Any");
  const [furnishing, setFurnishing] = useState("Any");
  const [possessionStatus, setPossessionStatus] = useState("Any");
  const [amenitiesFilter, setAmenitiesFilter] = useState({
    lift: false,
    parking: false,
    gym: false,
    swimmingPool: false,
    security: false,
  });

  const loadUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed._id);
    }
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await fetchingListingData();
      setProperties(
        data.map((p) => ({
          id: p._id,
          userId: p.user,
          title: p.title,
          price: p.price,
          city: p.city,
          state: p.state,
          location: `${p.city || ""}${p.city && p.state ? ", " : ""}${p.state || ""}`,
          images: (p.images || []).map((img) =>
            img.startsWith("http")
              ? img
              : `${BASE_URL}/${img.replace(/\\/g, "/")}`
          ),
          description: p.description || "",
          area: p.builtUpArea || 0,
          propertyType: p.propertyType || "Property",
          listingType: p.listingType || "Sale",
          bedrooms: p.bedrooms || p.bhk || null,
          bathrooms: p.bathrooms || null,
          status: p.status || p.completionStatus || "Unknown",
          amenities: p.amenities || [],
          brochureUrl: p.brochureUrl || "",
          createdAt: p.createdAt,
        }))
      );
    } catch (err) {
      console.error("Error fetching properties:", err);
      Alert.alert("Error", "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadProperties();
      if (route.params?.refresh) {
        loadProperties();
        navigation.setParams({ refresh: false });
      }
    }, [route.params?.refresh])
  );

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (cityFilter && !p.city?.toLowerCase().includes(cityFilter.toLowerCase()))
        return false;
      if (listingTypeFilter !== "Any" && p.listingType !== listingTypeFilter)
        return false;
      if (possessionStatus !== "Any" && p.status !== possessionStatus) return false;
      if (furnishing !== "Any" && p.furnishing !== furnishing) return false;
      if (bedrooms && Number(p.bedrooms) !== Number(bedrooms)) return false;
      if (bathrooms && Number(p.bathrooms) !== Number(bathrooms)) return false;
      const price = Number(p.price) || 0;
      if (minBudget && price < Number(minBudget)) return false;
      if (maxBudget && price > Number(maxBudget)) return false;
      const selectedAmenities = Object.keys(amenitiesFilter).filter((k) => amenitiesFilter[k]);
      if (selectedAmenities.length) {
        for (let a of selectedAmenities) {
          if (!p.amenities || !p.amenities.includes(a)) return false;
        }
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !(p.title?.toLowerCase()?.includes(q) ||
            p.location?.toLowerCase()?.includes(q) ||
            p.description?.toLowerCase()?.includes(q))
        )
          return false;
      }
      return true;
    });
  }, [
    properties,
    cityFilter,
    minBudget,
    maxBudget,
    bedrooms,
    bathrooms,
    listingTypeFilter,
    furnishing,
    possessionStatus,
    amenitiesFilter,
    searchQuery,
  ]);

  const handleDownloadBrochure = async (url) => {
    try {
      if (!url) return Alert.alert("No brochure available");
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open brochure link.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to open brochure.");
    }
  };

  const renderProperty = ({ item }) => (
    <Card
      style={{
        marginVertical: 10,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
        backgroundColor: "#fff",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("PropertyDetails", { id: item.id })}
      >
        <Card.Cover
          source={{
            uri:
              item.images?.[0] ||
              "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
          }}
          style={{ height: 200 }}
        />
      </TouchableOpacity>

      <Card.Content style={{ paddingVertical: 10 }}>
        <Text variant="titleMedium" style={{ fontWeight: "700", color: "#333" }}>
          {item.title}
        </Text>

        <Text variant="bodyMedium" style={{ color: "#009688", marginVertical: 2 }}>
          ₹{Number(item.price || 0).toLocaleString()}
        </Text>

        <Text variant="bodySmall" style={{ color: "#555", marginTop: 2 }}>
          🏠 {item.propertyType}
        </Text>

        <Text variant="bodySmall" style={{ color: "#777", marginTop: 6 }}>
          {item.description?.length > 100
            ? `${item.description.slice(0, 100)}...`
            : item.description}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
          <Chip style={{ margin: 3 }}>{item.listingType}</Chip>
          <Chip style={{ margin: 3 }}>
            {item.area ? `${item.area} sq.ft` : "N/A"}
          </Chip>
          {item.bedrooms && <Chip style={{ margin: 3 }}>{item.bedrooms} BHK</Chip>}
          {item.bathrooms && <Chip style={{ margin: 3 }}>{item.bathrooms} Bath</Chip>}
        </View>
      </Card.Content>

      <Card.Actions style={{ justifyContent: "space-between", padding: 10 }}>
        <Button
          mode="contained"
          buttonColor="#009688"
          onPress={() => navigation.navigate("PropertyDetails", { id: item.id })}
        >
          View Details
        </Button>
        <Button
          mode="outlined"
          textColor="#009688"
          icon="download"
          onPress={() => handleDownloadBrochure(item.brochureUrl)}
        >
          Brochure
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#E0F2F1" }}>
      {/* 🔍 Search & Menu Bar */}
      <SearchMenuBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Filter Button (left side now) */}
      <View
        style={{
          backgroundColor: "#E0F2F1",
          paddingVertical: 10,
          paddingHorizontal: 15,
          alignItems: "flex-start",
        }}
      >
        <Button
          icon="filter-variant"
          mode="contained-tonal"
          onPress={() => setFilterVisible(true)}
          buttonColor="#009688"
          textColor="#fff"
        >
          Filter
        </Button>
      </View>

      {/* Property List */}
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#009688" />
          <Text style={{ marginTop: 8 }}>Loading properties...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
        />
      )}

      {/* Filter Modal */}
      <Portal>
        <Modal
          visible={filterVisible}
          animationType="slide"
          transparent
          onRequestClose={() => {}}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "flex-start",
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            >
              <ScrollView
                style={{
                  backgroundColor: "#fff",
                  marginLeft: 20,
                  borderRadius: 12,
                  padding: 16,
                  maxHeight: "60%",
                  width: "85%",
                }}
              >
                <Text
                  variant="titleMedium"
                  style={{ fontWeight: "700", marginBottom: 10 }}
                >
                  Filters
                </Text>

                <TextInput
                  placeholder="City"
                  value={cityFilter}
                  onChangeText={setCityFilter}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 8,
                    padding: 8,
                    marginBottom: 10,
                  }}
                />

                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <TextInput
                    placeholder="Min Price"
                    keyboardType="numeric"
                    value={minBudget}
                    onChangeText={setMinBudget}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 8,
                      width: "48%",
                    }}
                  />
                  <TextInput
                    placeholder="Max Price"
                    keyboardType="numeric"
                    value={maxBudget}
                    onChangeText={setMaxBudget}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 8,
                      width: "48%",
                    }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <TextInput
                    placeholder="Bedrooms"
                    keyboardType="numeric"
                    value={bedrooms}
                    onChangeText={setBedrooms}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 8,
                      width: "48%",
                    }}
                  />
                  <TextInput
                    placeholder="Bathrooms"
                    keyboardType="numeric"
                    value={bathrooms}
                    onChangeText={setBathrooms}
                    style={{
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      padding: 8,
                      width: "48%",
                    }}
                  />
                </View>

                <Text style={{ marginTop: 10, fontWeight: "600" }}>Listing Type:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {["Any", "Sale", "Rent"].map((type) => (
                    <Chip
                      key={type}
                      selected={listingTypeFilter === type}
                      onPress={() => setListingTypeFilter(type)}
                      style={{
                        marginRight: 6,
                        backgroundColor:
                          listingTypeFilter === type ? "#009688" : "#eee",
                      }}
                      textStyle={{
                        color: listingTypeFilter === type ? "#fff" : "#000",
                      }}
                    >
                      {type}
                    </Chip>
                  ))}
                </ScrollView>

                <Text style={{ marginTop: 10, fontWeight: "600" }}>Amenities:</Text>
                {Object.keys(amenitiesFilter).map((a) => (
                  <View key={a} style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                      status={amenitiesFilter[a] ? "checked" : "unchecked"}
                      onPress={() =>
                        setAmenitiesFilter((prev) => ({ ...prev, [a]: !prev[a] }))
                      }
                    />
                    <Text>{a}</Text>
                  </View>
                ))}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 16,
                  }}
                >
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setCityFilter("");
                      setMinBudget("");
                      setMaxBudget("");
                      setBedrooms("");
                      setBathrooms("");
                      setListingTypeFilter("Any");
                      setAmenitiesFilter({
                        lift: false,
                        parking: false,
                        gym: false,
                        swimmingPool: false,
                        security: false,
                      });
                      setFilterVisible(false);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    mode="contained"
                    buttonColor="#009688"
                    onPress={() => setFilterVisible(false)}
                  >
                    Apply
                  </Button>
                </View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </Portal>

      {/* FAB */}
      <FAB
        icon="plus"
        label="Post Property"
        style={{
          position: "absolute",
          right: 16,
          bottom: 16,
          backgroundColor: "#009688",
        }}
        color="#fff"
        onPress={() => navigation.navigate("PostProperty")}
      />
    </View>
  );
}
