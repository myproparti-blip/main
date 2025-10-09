import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import api from "./services/axios";

export default function PostProperty() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "",
    listingType: "",
    price: "",
    addressLine1: "",
    city: "",
    state: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  // Pick Images
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newImgs = result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...newImgs]);
    }
  };

  // Pick Videos
  const pickVideos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      const newVids = result.assets.map((a) => a.uri);
      setVideos((prev) => [...prev, ...newVids]);
    }
  };

  // Submit Form
  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.city || !form.state) {
      Alert.alert("Missing Info", "Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      const token = "my_static_token_123"; // ✅ static token for testing
      const formData = new FormData();

      // Append text fields
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append images
      images.forEach((uri, i) => {
        const name = uri.split("/").pop() || `image_${i}.jpg`;
        const type = `image/${name.split(".").pop()}`;
        formData.append("images", {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name,
          type,
        });
      });

      // Append videos
      videos.forEach((uri, i) => {
        const name = uri.split("/").pop() || `video_${i}.mp4`;
        formData.append("videos", {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name,
          type: "video/mp4",
        });
      });

      const { data } = await api.post("/properties", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("✅ Success", "Property posted successfully!");
      navigation.navigate("Explorer", { refresh: true });
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert("❌ Error", "Failed to post property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ backgroundColor: "#E0F2F1", padding: 15 }}>
      <Text
        variant="headlineMedium"
        style={{ color: "#009688", fontWeight: "bold" }}
      >
        🏠 Post Your Property
      </Text>

      {[ // Input fields
        { key: "title", label: "Title" },
        { key: "description", label: "Description" },
        { key: "propertyType", label: "Property Type (Apartment/Villa...)" },
        { key: "listingType", label: "Listing Type (Sale/Rent)" },
        { key: "price", label: "Price (₹)" },
        { key: "addressLine1", label: "Address Line" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
      ].map((item) => (
        <TextInput
          key={item.key}
          placeholder={item.label}
          value={form[item.key]}
          onChangeText={(v) => setForm({ ...form, [item.key]: v })}
          style={{
            backgroundColor: "#fff",
            marginTop: 10,
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#B2DFDB",
          }}
        />
      ))}

      {/* Image Upload */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>📸 Property Images</Text>
        <Button mode="outlined" textColor="#009688" onPress={pickImages} style={{ borderColor: "#009688" }}>
          Upload Images
        </Button>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((uri, idx) => (
            <Image
              key={idx}
              source={{ uri }}
              style={{ width: 100, height: 100, borderRadius: 8, marginTop: 10, marginRight: 10 }}
            />
          ))}
        </ScrollView>
      </View>

      {/* Video Upload */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>🎥 Property Videos</Text>
        <Button mode="outlined" textColor="#009688" onPress={pickVideos} style={{ borderColor: "#009688" }}>
          Upload Videos
        </Button>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {videos.map((uri, idx) => (
            <View
              key={idx}
              style={{
                width: 100,
                height: 100,
                backgroundColor: "#ccc",
                borderRadius: 8,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
                marginRight: 10,
              }}
            >
              <Text>🎬 Video {idx + 1}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Submit */}
      <Button
        mode="contained"
        buttonColor="#009688"
        style={{ marginTop: 30, padding: 5 }}
        loading={loading}
        onPress={handleSubmit}
      >
        {loading ? "Posting..." : "Submit Property"}
      </Button>
    </ScrollView>
  );
}
