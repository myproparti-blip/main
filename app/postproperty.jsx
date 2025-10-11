import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Platform as RNPlatform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import api from "./services/axios";

export default function PostProperty() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
const router = useRouter();
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

  // Validation helper
  const validateForm = () => {
    const requiredFields = ["title", "description", "propertyType", "listingType", "price", "addressLine1", "city", "state"];
    for (const field of requiredFields) {
      if (!form[field]?.trim()) {
        Alert.alert("Missing Info", `Please fill the "${field}" field`);
        return false;
      }
    }
    return true;
  };

  // Submit Form
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = "my_static_token_123"; // Static token for testing
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      images.forEach((uri, i) => {
        const name = uri.split("/").pop() || `image_${i}.jpg`;
        const type = `image/${name.split(".").pop()}`;
        formData.append("images", {
          uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
          name,
          type,
        });
      });

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
      router.push({
  pathname: "/explore",
  params: { refresh: true },
});
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      Alert.alert(
        "❌ Error",
        error.response?.data?.message || "Failed to post property. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#E0F2F1" }}
      behavior={RNPlatform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text
          variant="headlineMedium"
          style={{ color: "#009688", fontWeight: "bold", marginBottom: 20, marginTop: 10 }}
        >
          🏠 Post Your Property
        </Text>

        {/* Input fields */}
        {[
          { key: "title", label: "Title", multiline: false },
          { key: "description", label: "Description", multiline: true },
          { key: "propertyType", label: "Property Type (Apartment/Villa...)", multiline: false },
          { key: "listingType", label: "Listing Type (Sale/Rent)", multiline: false },
          { key: "price", label: "Price (₹)", multiline: false },
          { key: "addressLine1", label: "Address Line", multiline: true },
          { key: "city", label: "City", multiline: false },
          { key: "state", label: "State", multiline: false },
        ].map((item) => (
          <TextInput
            key={item.key}
            placeholder={item.label}
            value={form[item.key]}
            onChangeText={(v) => setForm({ ...form, [item.key]: v })}
            multiline={item.multiline}
            style={{
              backgroundColor: "#fff",
              marginTop: 10,
              padding: item.multiline ? 15 : 12,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#B2DFDB",
              textAlignVertical: item.multiline ? "top" : "center",
              minHeight: item.multiline ? 60 : 40,
            }}
          />
        ))}

        {/* Image Upload */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>📸 Property Images</Text>
          <Button
            mode="outlined"
            textColor="#009688"
            onPress={pickImages}
            style={{ borderColor: "#009688", marginBottom: 10 }}
          >
            Upload Images
          </Button>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                style={{ width: 100, height: 100, borderRadius: 8, marginRight: 10 }}
              />
            ))}
          </ScrollView>
        </View>

        {/* Video Upload */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>🎥 Property Videos</Text>
          <Button
            mode="outlined"
            textColor="#009688"
            onPress={pickVideos}
            style={{ borderColor: "#009688", marginBottom: 10 }}
          >
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
                  marginRight: 10,
                }}
              >
                <Text>🎬 Video {idx + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          buttonColor="#009688"
          style={{ marginTop: 30, paddingVertical: 8 }}
          loading={loading}
          onPress={handleSubmit}
        >
          {loading ? "Posting..." : "Submit Property"}
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

