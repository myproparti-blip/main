import { useState } from "react";
import { FlatList, Image, ScrollView, View } from "react-native";
import {
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Menu,
  Text,
} from "react-native-paper";

export default function TabtwoScreen() {
  const [favorites, setFavorites] = useState([
    {
      id: "1",
      title: "3 BHK Apartment in Koramangala",
      price: 12500000,
      location: "Bangalore, Karnataka",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      rating: 4.6,
      area: "1750 sqft",
      type: "Apartment",
      isFavorite: true,
    },
    {
      id: "2",
      title: "2 BHK Flat in Andheri West",
      price: 9500000,
      location: "Mumbai, Maharashtra",
      image:
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      rating: 4.3,
      area: "1250 sqft",
      type: "Flat",
      isFavorite: true,
    },
    {
      id: "3",
      title: "Luxury Villa in Jubilee Hills",
      price: 68000000,
      location: "Hyderabad, Telangana",
      image:
        "https://images.unsplash.com/photo-1613553492125-7f2b0a7b3c42?w=800",
      rating: 4.9,
      area: "5200 sqft",
      type: "Villa",
      isFavorite: true,
    },
    {
      id: "4",
      title: "Premium 4 BHK Penthouse in Gurugram",
      price: 25000000,
      location: "Gurugram, Haryana",
      image:
        "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
      rating: 4.8,
      area: "3200 sqft",
      type: "Penthouse",
      isFavorite: true,
    },
    {
      id: "5",
      title: "1 BHK Studio Apartment in Pune",
      price: 5500000,
      location: "Pune, Maharashtra",
      image:
        "https://images.unsplash.com/photo-1600607688964-6d1a5c3c1d3c?w=800",
      rating: 4.2,
      area: "850 sqft",
      type: "Studio",
      isFavorite: true,
    },
    {
      id: "6",
      title: "Farmhouse with Garden in ECR",
      price: 15000000,
      location: "Chennai, Tamil Nadu",
      image:
        "https://images.unsplash.com/photo-1599423300746-b62533397364?w=800",
      rating: 4.7,
      area: "4000 sqft",
      type: "Farmhouse",
      isFavorite: true,
    },
    {
      id: "7",
      title: "Modern Apartment near Salt Lake",
      price: 8800000,
      location: "Kolkata, West Bengal",
      image:
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
      rating: 4.4,
      area: "1400 sqft",
      type: "Apartment",
      isFavorite: true,
    },
    {
      id: "8",
      title: "Sea-facing Villa in Goa",
      price: 42000000,
      location: "Goa, India",
      image:
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      rating: 4.9,
      area: "4800 sqft",
      type: "Villa",
      isFavorite: true,
    },
    {
      id: "9",
      title: "Budget 2 BHK in Noida Extension",
      price: 7500000,
      location: "Noida, UP",
      image:
        "https://images.unsplash.com/photo-1560448075-bb485b067938?w=800",
      rating: 4.1,
      area: "1100 sqft",
      type: "Flat",
      isFavorite: true,
    },
    {
      id: "10",
      title: "Premium Smart Home in Ahmedabad",
      price: 16500000,
      location: "Ahmedabad, Gujarat",
      image:
        "https://images.unsplash.com/photo-1616627452679-4b1e9f6e1f1b?w=800",
      rating: 4.8,
      area: "2400 sqft",
      type: "Smart Home",
      isFavorite: true,
    },
  ]);

  const [filterType, setFilterType] = useState("All");
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [sortOption, setSortOption] = useState("None");

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const removeAllFavorites = () => {
    setFavorites([]);
  };

  const filteredFavorites = favorites
    .filter((item) => filterType === "All" || item.type === filterType)
    .sort((a, b) => {
      if (sortOption === "Price: Low → High") return a.price - b.price;
      if (sortOption === "Price: High → Low") return b.price - a.price;
      return 0;
    });

  const renderProperty = ({ item }) => (
    <Card
      style={{
        marginVertical: 10,
        borderRadius: 15,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
      }}
    >
      <Card.Cover source={{ uri: item.image }} style={{ height: 180 }} />
      <Card.Title
        title={item.title}
        subtitle={item.location}
        right={() => (
          <IconButton
            icon={item.isFavorite ? "heart" : "heart-outline"}
            iconColor={item.isFavorite ? "#e91e63" : "#888"}
            onPress={() => toggleFavorite(item.id)}
          />
        )}
      />
      <Card.Content>
        <Text
          variant="titleMedium"
          style={{ fontWeight: "bold", color: "#222" }}
        >
          ₹{item.price.toLocaleString()}
        </Text>
        <Text variant="bodySmall" style={{ color: "#666", marginBottom: 4 }}>
          {item.area} | {item.type}
        </Text>
        <Text variant="bodySmall" style={{ color: "#888" }}>
          ⭐ {item.rating} • Excellent Location
        </Text>
      </Card.Content>

      <Card.Actions
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 10,
          marginTop: 10,
          marginBottom: 6,
        }}
      >
        <Button
          mode="contained"
          buttonColor="#1976d2"
          onPress={() => alert(`Viewing details for ${item.title}`)}
        >
          View Details
        </Button>
        <Button
          mode="outlined"
          textColor="#1976d2"
          onPress={() => alert(`Contacting agent for ${item.title}`)}
        >
          Contact Agent
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f9fa", padding: 10 }}>
      <Text
        variant="headlineMedium"
        style={{
          textAlign: "center",
          fontWeight: "bold",
          marginVertical: 10,
          color: "#333",
        }}
      >
        Your Favorite Properties
      </Text>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 10 }}
      >
        {["All", "Apartment", "Flat", "Villa", "Penthouse", "Farmhouse", "Studio"].map(
          (type) => (
            <Chip
              key={type}
              selected={filterType === type}
              onPress={() => setFilterType(type)}
              style={{
                marginRight: 6,
                backgroundColor:
                  filterType === type ? "#1976d2" : "rgba(0,0,0,0.05)",
              }}
              textStyle={{
                color: filterType === type ? "#fff" : "#1976d2",
                fontWeight: "600",
              }}
            >
              {type}
            </Chip>
          )
        )}
      </ScrollView>

      {/* Sorting Menu */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              icon="sort"
              onPress={() => setSortMenuVisible(true)}
            >
              {sortOption === "None" ? "Sort by" : sortOption}
            </Button>
          }
        >
          <Menu.Item
            onPress={() => {
              setSortOption("Price: Low → High");
              setSortMenuVisible(false);
            }}
            title="Price: Low → High"
          />
          <Menu.Item
            onPress={() => {
              setSortOption("Price: High → Low");
              setSortMenuVisible(false);
            }}
            title="Price: High → Low"
          />
          <Divider />
          <Menu.Item
            onPress={() => {
              setSortOption("None");
              setSortMenuVisible(false);
            }}
            title="Clear Sort"
          />
        </Menu>

        <Button
          icon="delete"
          mode="text"
          textColor="#e53935"
          onPress={removeAllFavorites}
        >
          Clear All
        </Button>
      </View>

      {/* Property List */}
      {filteredFavorites.length > 0 ? (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id}
          renderItem={renderProperty}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            opacity: 0.7,
          }}
        >
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4076/4076549.png",
            }}
            style={{ width: 120, height: 120, marginBottom: 20 }}
          />
          <Text variant="titleMedium" style={{ color: "#666" }}>
            No favorite properties yet.
          </Text>
        </View>
      )}
    </View>
  );
}
