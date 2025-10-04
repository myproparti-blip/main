import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Appbar, Card, Text, Button } from "react-native-paper";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Generate 200 dummy properties
const generateProperties = () => {
  const list = [];
  for (let i = 1; i <= 200; i++) {
    list.push({
      id: i,
      title: `Property ${i}`,
      location: `Prime Location Area ${i}`,
      price: `₹${(50 + i) * 100000}`,
      image: `https://picsum.photos/seed/${i}/600/400`,
      size: `${(i % 5) + 1} BHK`,
    });
  }
  return list;
};

export default function Sale() {
  const router = useRouter();
  const allProperties = generateProperties();

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(20);
  const [loading, setLoading] = useState(false);

  // Load more on scroll
  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

    if (isBottom && !loading && visibleCount < allProperties.length) {
      setLoading(true);
      setTimeout(() => {
        setVisibleCount((prev) => prev + 20);
        setLoading(false);
      }, 800); // simulate API delay
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {/* Header */}
      <Appbar.Header style={{ backgroundColor: "#1E1E2E", elevation: 4 }}>
        <Appbar.BackAction onPress={() => router.back()} color="#fff" />
        <Appbar.Content
          title="Properties for Sale"
          titleStyle={{ color: "white", fontWeight: "bold" }}
        />
      </Appbar.Header>

      {/* Scroll + Cards */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {allProperties.slice(0, visibleCount).map((item) => (
          <Card key={item.id} style={styles.card}>
            <Card.Cover source={{ uri: item.image }} style={styles.image} />
            <Card.Content>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.size}>{item.size}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </Card.Content>
            <Card.Actions style={styles.actions}>
              <Button
                mode="contained"
                style={styles.buyBtn}
                labelStyle={styles.buyBtnLabel}
              >
                Buy
              </Button>
            </Card.Actions>
          </Card>
        ))}

        {loading && <ActivityIndicator size="large" color="green" />}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12, paddingBottom: 40 },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    elevation: 3,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  image: { height: 160 },
  title: { fontSize: 16, fontWeight: "700", color: "#222", marginTop: 8 },
  location: { fontSize: 13, color: "#555", marginTop: 4 },
  size: { fontSize: 13, color: "#777", marginTop: 2 },
  price: { fontSize: 15, fontWeight: "600", color: "green", marginTop: 6 },
  actions: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  buyBtn: {
    backgroundColor: "green",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  buyBtnLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
