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
  StyleSheet,
  TextInput,
  View
} from "react-native";
import { Button, Chip, Text } from "react-native-paper";

// ----------------------------------------------------------------------
// DATA OPTIONS
// ----------------------------------------------------------------------
const PROPERTY_TYPE_OPTIONS = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Plot/Land", value: "plot" },
  { label: "Commercial", value: "commercial" },
  { label: "Villa", value: "villa" },
  { label: "Raw Land", value: "raw_land" },
  
]

const LISTING_TYPE_OPTIONS = [
  { label: "For Sale", value: "sale" },
  { label: "For Rent", value: "rent" },
];

const BEDROOM_OPTIONS = [
  { label: "Studio", value: "Studio" },
  { label: "Bedroom", value: "Bedroom" },
  { label: "1 RK", value: "1RK" },
  { label: "1.5 BHK", value: "1.5BHK" },
  { label: "2 BHK", value: "2BHK" },
  { label: "3 BHK", value: "3BHK" },
  { label: "4+ BHK", value: "4BHKPlus" },

];

const FURNISHING_OPTIONS = [
  { label: "Furnished", value: "furnished" },
  { label: "Semi-Furnished", value: "semi-furnished" },
  { label: "Unfurnished", value: "unfurnished" },
];

const POSTED_BY_OPTIONS = [
  { label: "Owner", value: "owner" },
  { label: "Partner Agent", value: "partner_agent" },
];

const AMENITY_OPTIONS = [
  { label: "24x7 Security", value: "security" },
  { label: "Attached Market", value: "market" },
  { label: "Visitor's Parking", value: "parking" },
  { label: "Kids Play Area", value: "kids_area" },
  { label: "Central AC", value: "central_ac" },
  { label: "Power Backup", value: "power_backup" },
  { label: "Intercom", value: "intercom" },
  { label: "Swimming Pool", value: "pool" },
  { label: "Clubhouse", value: "clubhouse" },
];
// ----------------------------------------------------------------------


// ----------------------------------------------------------------------
// CHIP SELECTOR COMPONENTS
// ----------------------------------------------------------------------

// Component for Single Selection (Radio-style)
const ChipSelector = ({ label, options, selectedValue, onSelect }) => (
  <View style={styles.chipContainer}>
    <Text style={styles.chipLabel}>{label}</Text>
    <View style={styles.chipWrapper}>
      {options.map((option) => (
        <Chip
          key={option.value.toString()} // Ensure key is a string
          mode="flat"
          selected={selectedValue === option.value}
          onPress={() => onSelect(option.value)}
          style={[
            styles.chip,
            selectedValue === option.value && styles.chipSelected,
          ]}
          textStyle={[
            styles.chipText,
            selectedValue === option.value && styles.chipTextSelected,
          ]}
          icon={selectedValue === option.value ? "check" : undefined}
        >
          {option.label}
        </Chip>
      ))}
    </View>
  </View>
);

// Component for Multiple Selection (Checkbox-style)
const MultiChipSelector = ({ label, options, selectedValues, onSelect }) => {
    const handleToggle = (value) => {
        const isSelected = selectedValues.includes(value);
        if (isSelected) {
            onSelect(selectedValues.filter(v => v !== value));
        } else {
            onSelect([...selectedValues, value]);
        }
    };

    return (
        <View style={styles.chipContainer}>
            <Text style={styles.chipLabel}>{label}</Text>
            <View style={styles.chipWrapper}>
                {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                        <Chip
                            key={option.value}
                            mode="flat"
                            selected={isSelected}
                            onPress={() => handleToggle(option.value)}
                            style={[
                                styles.chip,
                                isSelected && styles.chipSelected,
                            ]}
                            textStyle={[
                                styles.chipText,
                                isSelected && styles.chipTextSelected,
                            ]}
                            icon={isSelected ? "check-bold" : undefined}
                        >
                            {option.label}
                        </Chip>
                    );
                })}
            </View>
        </View>
    );
};
// ----------------------------------------------------------------------


export default function PostProperty() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    propertyType: "", 
    listingType: "",
    bedrooms: "",
    furnishingStatus: "",
    postedBy: "",
    amenities: [],
    price: "",
    addressLine1: "",
    city: "",
    state: "",
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  // Generic handler for form fields
  const handleFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Pick Images
  const pickImages = async () => {
    // Request permission if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload images.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newImgs = result.assets.map((a) => a.uri);
      // Ensure we only store unique URIs, if multiple selections overlap
      setImages((prev) => [...new Set([...prev, ...newImgs])]);
    }
  };

  // Pick Videos
  const pickVideos = async () => {
    // Request permission if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission required', 'We need camera roll permissions to upload videos.');
        return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });
    if (!result.canceled) {
      const newVids = result.assets.map((a) => a.uri);
      setVideos((prev) => [...new Set([...prev, ...newVids])]);
    }
  };


  // Validation helper
  const validateForm = () => {
    const requiredFields = [
        "title", "description", "propertyType", "listingType", "price", 
        "bedrooms", "furnishingStatus", "postedBy", 
        "addressLine1", "city", "state"
    ];
    
    for (const field of requiredFields) {
      if (!form[field] || (typeof form[field] === 'string' && !form[field].trim())) {
        const readableName = field.replace(/([A-Z])/g, ' $1').toLowerCase();
        Alert.alert("Missing Info", `Please select or fill the required field: ${readableName}`);
        return false;
      }
    }
    return true;
  };

  // Submit Form (placeholder for actual API call)
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        setLoading(true);
        const token = "my_static_token_123";
        const formData = new FormData();

        // Convert the form state into FormData
        Object.entries(form).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(`${key}[]`, item));
            } else {
                formData.append(key, value);
            }
        });
        
        // Append Images
        images.forEach((uri, i) => {
            const name = uri.split("/").pop() || `image_${i}.jpg`;
            const type = `image/${name.split(".").pop()}`;
            formData.append("images", {
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name,
                type,
            });
        });

        // Append Videos
        videos.forEach((uri, i) => {
            const name = uri.split("/").pop() || `video_${i}.mp4`;
            formData.append("videos", {
                uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
                name,
                type: "video/mp4",
            });
        });

        // Placeholder API call
        // const { data } = await api.post("/properties", formData, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } });

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

  // List of fields that should remain as TextInput
  const textInputFields = [
    { key: "title", label: "Title", multiline: false },
    { key: "description", label: "Description", multiline: true },
    { key: "price", label: "Price (₹)", multiline: false, keyboardType: "numeric" },
    { key: "addressLine1", label: "Address Line", multiline: true },
    { key: "city", label: "City", multiline: false },
    { key: "state", label: "State", multiline: false },
  ];

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
        
        {/* --- Listing & Property Type Selectors --- */}
        <ChipSelector
          label="Listing Type"
          options={LISTING_TYPE_OPTIONS}
          selectedValue={form.listingType}
          onSelect={(value) => handleFormChange("listingType", value)}
        />
        <ChipSelector
          label="Property Type"
          options={PROPERTY_TYPE_OPTIONS}
          selectedValue={form.propertyType}
          onSelect={(value) => handleFormChange("propertyType", value)}
        />

        {/* --- Bedrooms & Furnishing Status Selectors --- */}
        <ChipSelector
          label="Bedrooms"
          options={BEDROOM_OPTIONS}
          selectedValue={form.bedrooms}
          onSelect={(value) => handleFormChange("bedrooms", value)}
        />
        <ChipSelector
          label="Furnishing Status"
          options={FURNISHING_OPTIONS}
          selectedValue={form.furnishingStatus}
          onSelect={(value) => handleFormChange("furnishingStatus", value)}
        />

        {/* --- Posted By Selector --- */}
        <ChipSelector
          label="Posted By"
          options={POSTED_BY_OPTIONS}
          selectedValue={form.postedBy}
          onSelect={(value) => handleFormChange("postedBy", value)}
        />

        {/* --- Amenities Multi-Selector --- */}
        <MultiChipSelector
          label="Amenities"
          options={AMENITY_OPTIONS}
          selectedValues={form.amenities}
          onSelect={(values) => handleFormChange("amenities", values)}
        />
        
        {/* --- Text Input Fields --- */}
        <View style={{ height: 10 }} />
        {textInputFields.map((item) => (
          <TextInput
            key={item.key}
            placeholder={item.label}
            value={form[item.key]}
            onChangeText={(v) => handleFormChange(item.key, v)}
            multiline={item.multiline}
            keyboardType={item.keyboardType || 'default'}
            style={[
                styles.textInput, 
                item.multiline && { minHeight: 80, textAlignVertical: 'top' }
            ]}
          />
        ))}

        {/* 📸 Image Upload SECTION - FIX APPLIED HERE */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>📸 Property Images ({images.length} selected)</Text>
          <Button
            mode="outlined"
            textColor="#009688"
            onPress={pickImages} // <--- FIX: Added onPress handler
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

        {/* 🎥 Video Upload SECTION - FIX APPLIED HERE */}
        <View style={{ marginTop: 25 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 8 }}>🎥 Property Videos ({videos.length} selected)</Text>
          <Button
            mode="outlined"
            textColor="#009688"
            onPress={pickVideos} // <--- FIX: Added onPress handler
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

// ----------------------------------------------------------------------
// STYLES
// ----------------------------------------------------------------------
const styles = StyleSheet.create({
  // Style for the generic TextInput fields
  textInput: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#B2DFDB",
    textAlignVertical: "center",
    minHeight: 45,
  },
  
  // Styles for the new ChipSelector component
  chipContainer: {
    marginBottom: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0F2F1',
  },
  chipLabel: {
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
    fontSize: 15,
  },
  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8, // Spacing between chips
  },
  chip: {
    backgroundColor: '#fff',
    borderColor: "#009688",
    borderWidth: 1,
    paddingHorizontal: 4,
  },
  chipSelected: {
    backgroundColor: "#E0F2F1", // Light teal background
    borderColor: "#00796B",
    borderWidth: 1.5,
  },
  chipText: {
    color: "#009688",
    fontWeight: '500',
  },
  chipTextSelected: {
    color: "#00796B", // Darker teal text
    fontWeight: 'bold',
  },
});