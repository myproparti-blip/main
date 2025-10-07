import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { Button, Card, Chip, IconButton, Searchbar, Text } from "react-native-paper";

const CONSULTANTS = {
  Legal: [
    {
      id: 1,
      name: "Adv. Ramesh Kumar",
      title: "Property Legal Advisor",
      rating: 4.8,
      experience: "12 yrs",
      reviews: 248,
      price: "₹999 / session",
      languages: ["English", "Hindi", "Kannada"],
      image: "https://images.unsplash.com/photo-1603415526960-f8f0f3fc0c23?w=800",
      desc: "Specialist in real estate documentation, property title and legal verification.",
    },
    {
      id: 2,
      name: "Adv. Priya Deshmukh",
      title: "Senior Legal Consultant",
      rating: 4.9,
      experience: "15 yrs",
      reviews: 312,
      price: "₹1499 / session",
      languages: ["English", "Marathi", "Hindi"],
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=800",
      desc: "Expert in NRI property disputes and legal due diligence.",
    },
  ],
  Vastu: [
    {
      id: 3,
      name: "Dr. Neha Sharma",
      title: "Certified Vastu Consultant",
      rating: 4.7,
      experience: "8 yrs",
      reviews: 180,
      price: "₹799 / session",
      languages: ["English", "Hindi", "Gujarati"],
      image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=800",
      desc: "Helps create energy-balanced homes for better health, wealth, and peace.",
    },
  ],
  HomeLoan: [
    {
      id: 5,
      name: "Ankit Mehra",
      title: "Loan Advisor - HDFC",
      rating: 4.9,
      experience: "7 yrs",
      reviews: 320,
      price: "Free Consultation",
      languages: ["English", "Hindi"],
      image: "https://images.unsplash.com/photo-1603415526960-f8f0f3fc0c23?w=800",
      desc: "Provides assistance with home loan eligibility, interest rates, and documentation.",
    },
  ],
  Interiors: [
    {
      id: 7,
      name: "Kavya Bansal",
      title: "Home Interior Designer",
      rating: 4.9,
      experience: "10 yrs",
      reviews: 450,
      price: "₹1199 / session",
      languages: ["English", "Hindi"],
      image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=800",
      desc: "Transforms spaces with aesthetic design and space optimization.",
    },
  ],
};

export default function ServicesScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Legal");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConsultants = CONSULTANTS[selectedCategory].filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBook = (consultant) => alert(`Booking consultation with ${consultant.name}`);
  const handleChat = (consultant) => alert(`Starting chat with ${consultant.name}`);
  const handleCall = (consultant) => alert(`Calling ${consultant.name}`);

  const renderConsultant = ({ item }) => (
    <Card
      style={{
        marginVertical: 8,
        borderRadius: 15,
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <Image
          source={{ uri: item.image }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 12,
            margin: 10,
            backgroundColor: "#f2f2f2",
          }}
        />
        <View style={{ flex: 1, justifyContent: "center", paddingRight: 10 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold", color: "#222" }}>
            {item.name}
          </Text>
          <Text variant="bodySmall" style={{ color: "#777" }}>
            {item.title}
          </Text>
          <Text variant="bodyMedium" style={{ color: "#1976d2", marginTop: 4 }}>
            ⭐ {item.rating} ({item.reviews} reviews)
          </Text>
          <Text variant="bodySmall" style={{ color: "#555" }}>
            {item.experience} experience
          </Text>
        </View>
      </View>

      <Card.Content>
        <Text variant="bodySmall" style={{ color: "#666", marginBottom: 8 }}>
          {item.desc}
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 8 }}>
          {item.languages.slice(0, 3).map((lang, index) => (
            <Chip
              key={index}
              style={{
                marginRight: 6,
                marginBottom: 4,
                backgroundColor: "#e3f2fd",
                borderRadius: 8,
              }}
              textStyle={{ color: "#1976d2", fontSize: 12 }}
            >
              {lang}
            </Chip>
          ))}
        </View>
      </Card.Content>

      <Card.Actions
        style={{
          justifyContent: "space-between",
          marginBottom: 8,
          marginHorizontal: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <IconButton icon="chat" size={20} onPress={() => handleChat(item)} />
          <IconButton icon="phone" size={20} onPress={() => handleCall(item)} />
        </View>
        <Button mode="contained" buttonColor="#1976d2" onPress={() => handleBook(item)}>
          Book Consultation
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f5f9" }}>
      {/* Simple blue header (no background image now) */}
      <View
        style={{
          backgroundColor: "#1976d2",
          paddingVertical: 18,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          marginBottom: 12,
        }}
      >
        <Text
          variant="headlineMedium"
          style={{
            textAlign: "center",
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Book a Property Consultant
        </Text>
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        {/* Category Chips */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {Object.keys(CONSULTANTS).map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={{
                margin: 4,
                backgroundColor: selectedCategory === category ? "#1976d2" : "#fff",
              }}
              textStyle={{
                color: selectedCategory === category ? "#fff" : "#1976d2",
                fontWeight: "600",
              }}
            >
              {category}
            </Chip>
          ))}
        </View>

        <Searchbar
          placeholder="Search consultant or service..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={{ marginBottom: 10, borderRadius: 12 }}
        />

        <FlatList
          data={filteredConsultants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderConsultant}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <Button
        mode="contained"
        onPress={() => alert("View All Available Consultants")}
        style={{
          position: "absolute",
          bottom: 20,
          alignSelf: "center",
          borderRadius: 30,
          backgroundColor: "#1976d2",
          width: "80%",
          elevation: 5,
        }}
      >
        View All Consultants
      </Button>
    </View>
  );
}
