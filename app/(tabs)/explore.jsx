import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  View
} from "react-native";
import {
  Button,
  Card,
  Checkbox,
  FAB,
  Modal,
  Portal,
  Provider,
  Text,
  TextInput
} from "react-native-paper";
import SearchMenuBar from "../components/SearchMenuBar";
import { fetchingListingData } from "../services/listingtab";

const BASE_URL = "http://192.168.29.78:5000";

const chunkArray = (arr, size) => {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
};

export default function ExplorerScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerLoad] = useState(9);

  const [filterVisible, setFilterVisible] = useState(false);

  const [cityFilter, setCityFilter] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [listingTypeFilter, setListingTypeFilter] = useState("Any");
  const [furnishing, setFurnishing] = useState("Any");
  const [possessionStatus, setPossessionStatus] = useState("");
  const [coveredArea, setCoveredArea] = useState({ min: "", max: "" });
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [photosOnly, setPhotosOnly] = useState(false);
  const [videosOnly, setVideosOnly] = useState(false);
  const [sourceFilter, setSourceFilter] = useState({ magicBricks: false, "99Squar": false });

  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const loadUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) setUserId(JSON.parse(user)._id);
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await fetchingListingData();
      const mapped = data.map((p) => ({
        id: p._id,
        userId: p.user,
        title: p.title,
        price: p.price,
        city: p.city,
        state: p.state,
        location: `${p.city || ""}${p.city && p.state ? ", " : ""}${p.state || ""}`,
        images: (p.images || []).map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}/${img.replace(/\\/g, "/")}`
        ),
        area: p.builtUpArea || 0,
        propertyType: p.propertyType || "Property",
        listingType: p.listingType || "Sale",
        bedrooms: p.bedrooms || p.bhk || null,
        bathrooms: p.bathrooms || null,
        status: p.status || p.completionStatus || "Unknown",
        source: p.source || "Other",
        verified: p.verified || false,
        photosCount: (p.images || []).length,
        videosCount: (p.videos || []).length,
      }));
      setProperties(mapped);
      setDisplayedProperties(mapped.slice(0, itemsPerLoad));
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
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
      if (cityFilter && !p.city?.toLowerCase().includes(cityFilter.toLowerCase())) return false;
      if (listingTypeFilter !== "Any" && p.listingType !== listingTypeFilter) return false;
      if (bedrooms && Number(p.bedrooms) !== Number(bedrooms)) return false;
      if (bathrooms && Number(p.bathrooms) !== Number(bathrooms)) return false;
      const price = Number(p.price) || 0;
      if (minBudget && price < Number(minBudget)) return false;
      if (maxBudget && price > Number(maxBudget)) return false;
      const area = Number(p.area || 0);
      if (coveredArea.min && area < Number(coveredArea.min)) return false;
      if (coveredArea.max && area > Number(coveredArea.max)) return false;
      if (verifiedOnly && !p.verified) return false;
      if (photosOnly && (!p.photosCount || p.photosCount === 0)) return false;
      if (videosOnly && (!p.videosCount || p.videosCount === 0)) return false;

      const selectedSources = Object.keys(sourceFilter).filter((k) => sourceFilter[k]);
      if (selectedSources.length && !selectedSources.includes(p.source)) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !(
            p.title?.toLowerCase()?.includes(q) ||
            p.location?.toLowerCase()?.includes(q)
          )
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
    sourceFilter,
    searchQuery,
    coveredArea,
    verifiedOnly,
    photosOnly,
    videosOnly,
  ]);

  const loadMore = () => {
    if (isFetchingMore) return;
    const nextPage = currentPage + 1;
    const start = currentPage * itemsPerLoad;
    const nextItems = filteredProperties.slice(start, start + itemsPerLoad);
    if (nextItems.length === 0) return;
    setIsFetchingMore(true);
    setDisplayedProperties((prev) => [...prev, ...nextItems]);
    setCurrentPage(nextPage);
    setIsFetchingMore(false);
  };

  const resetFilters = () => {
    setCityFilter("");
    setMinBudget("");
    setMaxBudget("");
    setBedrooms("");
    setBathrooms("");
    setListingTypeFilter("Any");
    setFurnishing("Any");
    setPossessionStatus("");
    setCoveredArea({ min: "", max: "" });
    setVerifiedOnly(false);
    setPhotosOnly(false);
    setVideosOnly(false);
    setSourceFilter({ magicBricks: false, "99Squar": false });
  };

  const displayRows = useMemo(() => {
    const rows = chunkArray(filteredProperties, 3).map((r, idx) => ({ items: r, id: idx }));
    const finalRows = [];
    for (let i = 0; i < rows.length; i++) {
      finalRows.push(rows[i]);
      if ((i + 1) % 3 === 0) finalRows.push({ ad: true, id: `ad-${i}` });
    }
    return finalRows;
  }, [filteredProperties]);

  const formatPrice = (price) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
    return `₹${price.toLocaleString()}`;
  };

  const renderPropertyRow = ({ item }) => {
    if (item.ad) {
      return (
        <View style={styles.adContainer}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#009688", textAlign: "center" }}>
            Need a Home Loan? Know how much you can take. Select your Monthly Income.
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.rowContainer} key={item.id}>
        {item.items.map((prop) => (
          <Card key={prop.id} style={styles.gridCard}>
            <Card.Cover
              source={{ uri: prop.images?.[0] || "https://cdn-icons-png.flaticon.com/512/4076/4076549.png" }}
              style={{ height: 120 }}
            />
            <Card.Content style={{ paddingVertical: 6 }}>
              <Text variant="titleSmall" style={{ fontWeight: "700", color: "#020202ff" }}>
                {prop.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: "#59b9b1ff", marginVertical: 2 }}>
                {formatPrice(prop.price || 0)}
              </Text>
              <Text variant="bodySmall" style={{ color: "#121010ff" }}>
                {prop.propertyType} | {prop.listingType}
              </Text>
              <Text variant="bodySmall" style={{ color: "#090d0dff", marginTop: 2 }}>
                {prop.location} | {prop.area} sq.ft
              </Text>
            </Card.Content>
            <View style={{ flex: 1 }} />
            <Card.Actions style={{ justifyContent: "center", paddingHorizontal: 6, paddingBottom: 8 }}>
              <Button
                mode="contained"
                compact
                buttonColor="#009688"
                onPress={() => navigation.navigate("PropertyDetails", { id: prop.id })}
              >
                View
              </Button>
            </Card.Actions>
          </Card>
        ))}
        {Array.from({ length: 3 - item.items.length }).map((_, i) => (
          <View key={`ph-${i}`} style={styles.gridCardPlaceholder} />
        ))}
      </View>
    );
  };

  return (
    <Provider>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600" }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <SearchMenuBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} removeLocationIcon={true} />

        <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
          <Button
            icon="filter-variant"
            mode="contained"
            buttonColor="#009688"
            textColor="#fff"
            onPress={() => setFilterVisible(true)}
          >
            Filter
          </Button>
          <Button buttonColor="#009688" textColor="#fff" style={{ marginLeft: "auto" }} onPress={resetFilters}>
            Clear All
          </Button>
        </View>

        <Portal>
          <Modal
            visible={filterVisible}
            onDismiss={() => setFilterVisible(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <ScrollView>
              <TextInput label="City" value={cityFilter} onChangeText={setCityFilter} style={styles.input} />
              <TextInput label="Min Budget" value={minBudget} onChangeText={setMinBudget} keyboardType="numeric" style={styles.input} />
              <TextInput label="Max Budget" value={maxBudget} onChangeText={setMaxBudget} keyboardType="numeric" style={styles.input} />
              <TextInput label="Bedrooms" value={bedrooms} onChangeText={setBedrooms} keyboardType="numeric" style={styles.input} />
              <TextInput label="Bathrooms" value={bathrooms} onChangeText={setBathrooms} keyboardType="numeric" style={styles.input} />
              <Text style={{ fontWeight: "700", marginTop: 10 }}>Covered Area (sqft)</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <TextInput
                  label="Min"
                  value={coveredArea.min}
                  onChangeText={(v) => setCoveredArea({ ...coveredArea, min: v })}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1, marginRight: 5 }]}
                />
                <TextInput
                  label="Max"
                  value={coveredArea.max}
                  onChangeText={(v) => setCoveredArea({ ...coveredArea, max: v })}
                  keyboardType="numeric"
                  style={[styles.input, { flex: 1, marginLeft: 5 }]}
                />
              </View>

              <Text style={{ fontWeight: "700", marginTop: 10 }}>Source</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <Checkbox
                  status={sourceFilter.magicBricks ? "checked" : "unchecked"}
                  onPress={() => setSourceFilter({ ...sourceFilter, magicBricks: !sourceFilter.magicBricks })}
                />
                <Text style={{ marginRight: 20 }}>villa</Text>
                <Checkbox
                  status={sourceFilter["99Squar"] ? "checked" : "unchecked"}
                  onPress={() => setSourceFilter({ ...sourceFilter, "99Squar": !sourceFilter["99Squar"] })}
                />
                <Text>flat</Text>
              </View>

              <Button
                mode="contained"
                buttonColor="#009688"
                textColor="#fff"
                onPress={() => setFilterVisible(false)}
              >
                Apply Filters
              </Button>
            </ScrollView>
          </Modal>
        </Portal>

        {loading ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#009688" />
            <Text style={{ marginTop: 8 }}>Loading properties...</Text>
          </View>
        ) : (
          <FlatList
            data={displayRows}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPropertyRow}
            contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore && <ActivityIndicator size="large" color="#009688" />}
          />
        )}

        <FAB
          icon="plus"
          label="Post Property"
          style={{ position: "absolute", right: 16, bottom: 16, backgroundColor: "#009688" }}
          color="#fff"
          onPress={() => navigation.navigate("PostProperty")}
        />
      </ImageBackground>
    </Provider>
  );
}

const styles = StyleSheet.create({
  rowContainer: { flexDirection: "row", marginBottom: 12, alignItems: "stretch" },
  gridCard: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "rgba(255, 255, 255, 0.56)", // semi-transparent card
    minWidth: 0
  },
  gridCardPlaceholder: { flex: 1, marginHorizontal: 6, backgroundColor: "transparent" },
  adContainer: {
    flex: 1,
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#B2DFDB",
    borderRadius: 15,
  },
  modalContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  input: {
    marginBottom: 10,
    backgroundColor: "#fff",
  },
});
