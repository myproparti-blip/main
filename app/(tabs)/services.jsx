import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import SearchMenuBar from "../components/SearchMenuBar";
import { getConsultants } from "../services/consultants";

const { width } = Dimensions.get("window");

// layout constants for a 3-column grid
const H_PADDING = 16; // container horizontal padding
const COL_GAP = 12; // space between columns
const CARD_WIDTH = Math.floor((width - H_PADDING * 2 - COL_GAP * 2) / 3); // 3 columns

// supports either _id or id
const getId = (c) => c?._id ?? c?.id;

// fix: proper template literal and URL quotes
const formatImage = (image) => {
  if (!image) return "https://via.placeholder.com/150";
  if (typeof image === "string" && image.startsWith("http")) return image;
  return `http://192.168.29.194:5000${image}`;
};

// fix: proper template literal for text
const getTimePrice = (c) => {
  const time = c?.time || c?.duration || "30 min";
  const price = c?.money || c?.price || "1800";
  return `${time} - ₹${price}`;
};

// abbreviate each language to first 3 letters
const abbrevLangs = (langs) =>
  Array.isArray(langs) && langs.length
    ? langs.map((l) => String(l).slice(0, 3)).join(", ")
    : null;

export default function Services() {
  const router = useRouter();
  const { bumpId } = useLocalSearchParams(); // id passed from Home

  const [searchQuery, setSearchQuery] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLive = useCallback(async (idToBump) => {
    try {
      setLoading(true);
      const data = await getConsultants(); // LIVE data
      const arr = Array.isArray(data) ? data : [];

      if (idToBump) {
        const found = arr.find((c) => String(getId(c)) === String(idToBump));
        setList(
          found
            ? [found, ...arr.filter((c) => String(getId(c)) !== String(idToBump))]
            : arr
        );
      } else {
        setList(arr);
      }
    } catch (e) {
      console.error("services: getConsultants failed:", e);
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLive(bumpId);
  }, [fetchLive, bumpId]);

  useFocusEffect(
    useCallback(() => {
      fetchLive(bumpId);
    }, [fetchLive, bumpId])
  );

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c?.name?.toLowerCase().includes(q) ||
        c?.designation?.toLowerCase().includes(q) ||
        c?.location?.toLowerCase().includes(q)
    );
  }, [searchQuery, list]);

  const detectLocation = async () => {
    setLocationLoading(true);
    setTimeout(() => {
      setCurrentLocation("Surat, Gujarat");
      setLocationLoading(false);
    }, 800);
  };

  // Promote tapped consultant to TOP, then navigate to detail screen
  const openDetails = (consultant) => {
    const id = getId(consultant);
    if (id) {
      setList((prev) => {
        const found = prev.find((x) => String(getId(x)) === String(id));
        if (!found) return prev;
        const rest = prev.filter((x) => String(getId(x)) !== String(id));
        return [found, ...rest];
      });
    }
    router.push({ pathname: "/consultantDetails", params: { ...consultant } });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <SearchMenuBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchChange={setSearchQuery}
        detectLocation={detectLocation}
        locationLoading={locationLoading}
        currentLocation={currentLocation}
      />

      <ScrollView style={styles.container}>
        {loading ? (
          <View style={styles.empty}>
            <Text>Loading...</Text>
          </View>
        ) : filtered.length ? (
          <View style={styles.grid}>
            {filtered.map((c, i) => {
              const langs = abbrevLangs(c.languages);
              return (
                <Card
                  key={getId(c) ?? i}
                  style={[styles.card, i % 3 !== 2 && styles.cardGapRight]} // right gap except every 3rd
                >
                  <TouchableOpacity onPress={() => openDetails(c)}>
                    <Image
                      source={{ uri: formatImage(c.image) }}
                      style={styles.image}
                    />
                  </TouchableOpacity>

                  <Card.Content>
                    <Text style={styles.name} numberOfLines={1}>
                      {c.name}
                    </Text>
                    {!!c.designation && (
                      <Text style={styles.designation} numberOfLines={1}>
                        {c.designation}
                      </Text>
                    )}

                    {!!c.rating && (
                      <Text style={styles.rating}>
                        ⭐ {c.rating} {c.reviewsCount ? `(${c.reviewsCount})` : ""}
                      </Text>
                    )}

                    {!!c.experience && (
                      <Text style={styles.meta}>Exp - {c.experience} yrs</Text>
                    )}

                    {!!langs && <Text style={styles.meta}>Lang - {langs}</Text>}

                    <Text style={styles.priceText}>{getTimePrice(c)}</Text>
                    {!!c.location && (
                      <Text style={styles.location} numberOfLines={1}>
                        {c.location}
                      </Text>
                    )}
                  </Card.Content>

                  <Card.Actions>
                    <Button
                      mode="contained"
                      buttonColor="#009688"
                      textColor="#fff"
                      onPress={() => openDetails(c)}
                    >
                      Book
                    </Button>
                  </Card.Actions>
                </Card>
              );
            })}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={{ color: "#666", fontSize: 16 }}>
              No consultants found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 12 },

  // 3-column responsive grid (wraps to next line)
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start", // important: no space-between so width doesn't stretch
    paddingBottom: 24,
  },

  // fixed width for 3 columns
  card: {
    width: CARD_WIDTH,
    marginBottom: COL_GAP, // vertical gap between rows
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 10px 24px rgba(0,0,0,0.10)" }
      : { elevation: 3 }),
  },

  // Right gap for 1st & 2nd items in each row; none for 3rd
  cardGapRight: {
    marginRight: COL_GAP,
  },

  image: { width: "100%", height: 120 },

  name: { fontWeight: "bold", marginTop: 6, fontSize: 14.5, color: "#222" },
  designation: { fontSize: 12, color: "#009688", marginTop: 2 },
  rating: { fontSize: 12, color: "#333", marginTop: 6 },
  meta: { fontSize: 12, color: "#444", marginTop: 4 },
  priceText: {
    fontSize: 12.5,
    color: "#00796B",
    fontWeight: "600",
    marginTop: 6,
  },
  location: { fontSize: 12, color: "#666", marginTop: 4, marginBottom: 6 },

  empty: { alignItems: "center", justifyContent: "center", marginTop: 100 },
});
