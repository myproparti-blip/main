import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import * as React from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  IconButton,
  Text,
  TextInput
} from "react-native-paper";
import SearchMenuBar from "../components/SearchMenuBar";

const { width } = Dimensions.get("window");
const H_PADDING = 16;
const COL_GAP = 12;
const COLS = 3;
const CARD_W = Math.floor((width - H_PADDING * 2 - COL_GAP * (COLS - 1)) / COLS);
const getId = (c) => c?._id ?? c?.id;

export default function HomeScreen({ userData = {} }) {
  const [currentLocation, setCurrentLocation] = React.useState("Search consultants or properties");
  const [locationLoading, setLocationLoading] = React.useState(false);
  const [submittedConsultants, setSubmittedConsultants] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [showForm, setShowForm] = React.useState(true);
  const router = useRouter();

  const [form, setForm] = React.useState({
    fullName: "",
    mobileNumber: "",
    photo: null,
    designation: "",
    experience: 1,
    languages: [],
    location: "",
    address: "",
    idProof: null,
    certifications: "",
    skills: "",
    consultingFee: 30, // Fee in Rupees (Default: 30)
    consultingDuration: 30, // Duration in minutes (Default: 30 min)
    paymentOption: "bank",
    upiId: "",
    bankDetails: { accountNumber: "", ifscCode: "" },
    cardDetails: { nameOnCard: "", lastFourDigits: "" },
  });

  const handleChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNestedChange = (parentKey, key, value) => setForm((prev) => ({
    ...prev,
    [parentKey]: { ...prev[parentKey], [key]: value },
  }));

  React.useEffect(() => {
    detectLocation();
    if (userData.contactNumber) {
      handleChange("mobileNumber", userData.contactNumber);
    }
  }, [userData.contactNumber]);

  React.useEffect(() => {
    if (currentLocation !== "Search consultants or properties") {
      handleChange("location", currentLocation);
    }
  }, [currentLocation]);

  const detectLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location Permission Required",
          "Please enable location to see nearby consultants.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Settings", onPress: () => Platform.OS === "ios" ? Linking.openURL("app-settings:") : Linking.openSettings() },
          ]
        );
        setLocationLoading(false);
        return;
      }
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      const detected = geocode[0]?.city || geocode[0]?.district || geocode[0]?.name || "Your Area";
      setCurrentLocation(detected);
      setSearchQuery(detected);
    } catch (err) {
      console.error("Location error:", err);
      setCurrentLocation("Your Area");
    } finally {
      setLocationLoading(false);
    }
  };

  const pickImage = async (field) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!result.canceled) handleChange(field, result.assets[0].uri);
  };

  const submitForm = () => {
    if (!form.fullName) {
      Alert.alert("Error", "Name is required.");
      return;
    }
    setSubmittedConsultants([form, ...submittedConsultants].slice(0, 5));
    setShowForm(false);
    Alert.alert("Success", "Consultant submitted successfully!");
  };

  const toggleLanguage = (lang) => {
    const langs = [...form.languages];
    if (langs.includes(lang)) langs.splice(langs.indexOf(lang), 1);
    else if (langs.length < 3) langs.push(lang);
    handleChange("languages", langs);
  };

  const incrementExp = () => handleChange("experience", form.experience + 1);
  const decrementExp = () => handleChange("experience", Math.max(1, form.experience - 1));

  const incrementFee = () => handleChange("consultingFee", form.consultingFee + 5);
  const decrementFee = () => handleChange("consultingFee", Math.max(5, form.consultingFee - 5));

  const incrementDuration = () => handleChange("consultingDuration", form.consultingDuration + 5);
  const decrementDuration = () => handleChange("consultingDuration", Math.max(5, form.consultingDuration - 5));

  const DocumentUploadField = ({ label, field, icon, onChange }) => (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
        <IconButton icon={icon || "file-document-outline"} size={20} color="#00796B" style={{ margin: 0, padding: 0 }} />
        <Text style={{ fontWeight: "bold", marginLeft: 4, color: "#444" }}>{label}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: 'space-between' }}>
        <Button
          mode="contained"
          buttonColor={form[field] ? "#009688" : "#2196F3"}
          textColor="#fff"
          onPress={() => onChange(field)}
          icon="upload"
          style={{ flexShrink: 1, marginRight: 10 }}
        >
          {form[field] ? "Change Document" : "Upload Document"}
        </Button>
        {form[field] && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#00796B', fontWeight: '500', marginRight: 4 }}>File Uploaded</Text>
            <IconButton icon="check-circle" size={24} color="#00796B" style={{ margin: 0, padding: 0 }} />
          </View>
        )}
      </View>
      <Text style={{ marginTop: 4, color: form[field] ? '#4CAF50' : '#777', fontSize: 12 }}>
        {form[field] ? `Status: Uploaded (${field})` : "No file selected."}
      </Text>
    </View>
  );

  const renderConsultantForm = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.heading}>Consultant Profile</Text>
            <IconButton icon="close" size={24} onPress={() => setShowForm(false)} />
          </View>
          <Divider style={{ marginVertical: 8 }} />

          {/* Profile Photo at Top */}
          <TouchableOpacity 
            style={styles.profilePhotoContainer}
            onPress={() => pickImage("photo")}
          >
            {form.photo ? (
              <Avatar.Image size={80} source={{ uri: form.photo }} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Avatar.Icon size={48} icon="camera-plus" style={{ backgroundColor: 'transparent' }} color="#00796B" />
                <Text style={{ fontSize: 10, color: '#00796B', fontWeight: 'bold' }}>Upload Photo</Text>
              </View>
            )}
          </TouchableOpacity>
          <Divider style={{ marginVertical: 12 }} />

          {/* Full Name */}
          <TextInput
            label="Full Name"
            value={form.fullName}
            onChangeText={(t) => handleChange("fullName", t)}
            mode="outlined"
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
          />

          {/* Contact Number (Auto-fetched after Full Name) */}
          <TextInput
            label="Contact Number"
            value={form.mobileNumber}
            onChangeText={(t) => handleChange("mobileNumber", t)}
            mode="outlined"
            keyboardType="phone-pad"
            style={styles.input}
            left={<TextInput.Icon icon="phone" />}
            disabled={!!userData.contactNumber}
          />
          
          {/* Experience (exp - 1 +) - HORIZONTAL */}
          <View style={[styles.counterRow, { marginBottom: 16, justifyContent: 'space-between', paddingHorizontal: 12 }]}>
            <Text style={[styles.counterText, { marginRight: 8, flexShrink: 1 }]}>Experience:</Text>
            
            <View style={styles.inlineCounterGroup}>
                <IconButton icon="minus-circle" size={24} color="#D32F2F" onPress={decrementExp} style={styles.counterBtn} />
                <Text style={[styles.counterText, styles.counterValueText]}>{form.experience} yrs</Text>
                <IconButton icon="plus-circle" size={24} color="#388E3C" onPress={incrementExp} style={styles.counterBtn} />
            </View>
          </View>

          <TextInput
            label="Designation / Type"
            value={form.designation}
            onChangeText={(t) => handleChange("designation", t)}
            mode="outlined"
            style={styles.input}
          />

          {/* Languages */}
          <Text style={{ marginBottom: 6, fontWeight: "bold" }}>Languages (Max 3)</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 12 }}>
            {["English", "Hindi", "Tamil", "Telugu", "Kannada"].map((lang) => (
              <Chip
                key={lang}
                selected={form.languages.includes(lang)}
                onPress={() => toggleLanguage(lang)}
                style={{ marginRight: 6, marginBottom: 6 }}
                selectedColor="#00796B"
              >{lang}</Chip>
            ))}
          </View>

          <TextInput
            label="Location"
            value={form.location}
            onChangeText={(t) => handleChange("location", t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Address"
            value={form.address}
            onChangeText={(t) => handleChange("address", t)}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Certifications / Licenses"
            value={form.certifications}
            onChangeText={(t) => handleChange("certifications", t)}
            mode="outlined"
            style={styles.input}
          />
          <TextInput
            label="Key Skills & Expertise"
            value={form.skills}
            onChangeText={(t) => handleChange("skills", t)}
            mode="outlined"
            style={styles.input}
          />

          {/*             The Consulting Fee section, updated to the requested 
            three-line structure with a 30 unit right padding (rp 30). 
          */}
          <View style={{ paddingRight: 30, marginBottom: 16 }}> 
            {/* 1. The Label - Single line on top */}
            <Text style={[styles.labelOptimized, { marginBottom: 8 }]}>Consulting Fee:</Text>
            
            {/* 2. Duration (Minutes) - min - + */}
            <View style={[styles.inlineCounterGroup, { marginBottom: 8, width: '100%', justifyContent: 'space-between' }]}>
                <Text style={[styles.counterText, styles.labelOptimized]}>Duration (min):</Text>
                <View style={styles.inlineCounterGroup}>
                    <IconButton icon="minus-circle" size={24} color="#D32F2F" onPress={decrementDuration} style={styles.counterBtn} />
                    <Text style={[styles.counterText, styles.counterValueText]}>{form.consultingDuration}</Text>
                    <IconButton icon="plus-circle" size={24} color="#388E3C" onPress={incrementDuration} style={styles.counterBtn} />
                </View>
            </View>

            {/* 3. Fee (Rupees) - ₹ - + (On its own line) */}
            <View style={[styles.inlineCounterGroup, { width: '100%', justifyContent: 'space-between' }]}>
                <Text style={[styles.counterText, styles.labelOptimized]}>Fee (₹):</Text>
                <View style={styles.inlineCounterGroup}>
                    <IconButton icon="minus-circle" size={24} color="#D32F2F" onPress={decrementFee} style={styles.counterBtn} />
                    <Text style={[styles.counterText, styles.counterValueText]}>₹ {form.consultingFee}</Text>
                    <IconButton icon="plus-circle" size={24} color="#388E3C" onPress={incrementFee} style={styles.counterBtn} />
                </View>
            </View>
          </View>

          {/* Identification Proof AFTER Consulting Fee */}
          <DocumentUploadField
            label="Identification Proof"
            field="idProof"
            icon="card-account-details-outline"
            onChange={pickImage}
          />

          {/* Payment Options with Field Details */}
          <Card style={{ marginVertical: 12, padding: 16, backgroundColor: "#e0f7fa" }}>
                     

            {/* Field Details based on paymentOption */}
            {form.paymentOption === "upi" && (
              <TextInput
                label="UPI ID"
                value={form.upiId}
                onChangeText={(t) => handleChange("upiId", t)}
                mode="outlined"
                style={{ marginTop: 8 }}
                left={<TextInput.Icon icon="qrcode" />}
              />
            )}
            {form.paymentOption === "bank" && (
              <View style={{ marginTop: 8 }}>
                <TextInput
                  label="Account Number"
                  value={form.bankDetails.accountNumber}
                  onChangeText={(t) => handleNestedChange("bankDetails", "accountNumber", t)}
                  mode="outlined"
                  keyboardType="numeric"
                  style={{ marginBottom: 8 }}
                  left={<TextInput.Icon icon="bank" />}
                />
                <TextInput
                  label="IFSC Code"
                  value={form.bankDetails.ifscCode}
                  onChangeText={(t) => handleNestedChange("bankDetails", "ifscCode", t)}
                  mode="outlined"
                  left={<TextInput.Icon icon="form-textbox" />}
                />
              </View>
            )}
            {form.paymentOption === "card" && (
              <View style={{ marginTop: 8 }}>
                <TextInput
                  label="Name on Card"
                  value={form.cardDetails.nameOnCard}
                  onChangeText={(t) => handleNestedChange("cardDetails", "nameOnCard", t)}
                  mode="outlined"
                  style={{ marginBottom: 8 }}
                  left={<TextInput.Icon icon="credit-card-outline" />}
                />
                <TextInput
                  label="Last 4 Digits"
                  value={form.cardDetails.lastFourDigits}
                  onChangeText={(t) => handleNestedChange("cardDetails", "lastFourDigits", t)}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={4}
                  left={<TextInput.Icon icon="numeric" />}
                />
              </View>
            )}
          </Card>

          <Button mode="contained" buttonColor="#00796B" textColor="#fff" onPress={submitForm} style={{ marginBottom: 20 }}>Submit</Button>
        </ScrollView>
      </View>
    </View>
  );

  const renderSubmittedCard = (item, index) => (
    <TouchableOpacity key={index} style={[styles.tile, { marginBottom: COL_GAP }]} onPress={() => router.push({ pathname: "/services", params: { bumpId: index } })}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.consultName}>{item.fullName}</Text>
          {item.designation ? <Text style={styles.consultType}>{item.designation}</Text> : null}
          <Text style={styles.consultMeta}>Exp: {item.experience} yrs</Text>
          {item.languages?.length ? <Text style={styles.lang}>{item.languages.join(", ")}</Text> : null}
          <Text style={styles.priceText}>₹{item.consultingFee}/{item.consultingDuration} min</Text>
          {item.location ? <Text style={styles.location}>{item.location}</Text> : null}
          <Button mode="contained" buttonColor="#009688" textColor="#fff" style={styles.bookBtn}>Book</Button>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{ uri: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600" }}
      style={styles.bg}
      resizeMode="cover"
      blurRadius={1.5}
    >
      <SearchMenuBar
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        detectLocation={detectLocation}
        locationLoading={locationLoading}
        currentLocation={currentLocation}
      />

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        {submittedConsultants.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff", marginBottom: 10 }}>Your Consultants</Text>
            <FlatList
              data={submittedConsultants}
              renderItem={({ item, index }) => renderSubmittedCard(item, index)}
              keyExtractor={(_, i) => String(i)}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </ScrollView>

      <Modal visible={showForm} animationType="slide" transparent>
        {renderConsultantForm()}
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, paddingHorizontal: H_PADDING, paddingTop: 16 },
  tile: { width: CARD_W },
  card: { borderRadius: 16, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.85)", minHeight: 180, elevation: 3 },
  consultName: { fontWeight: "bold", fontSize: 13, color: "#222" },
  consultType: { fontSize: 11, color: "#009688", marginTop: 2 },
  consultMeta: { fontSize: 11, color: "#444", lineHeight: 16 },
  lang: { fontSize: 10.5, color: "#555", marginTop: 3 },
  priceText: { fontSize: 11, color: "#00796B", fontWeight: "600", marginTop: 4 },
  location: { fontSize: 10.5, color: "#555", marginTop: 4 },
  bookBtn: { marginTop: 8, borderRadius: 6 },
  modalContainer: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 16 },
  modalContent: { backgroundColor: "#fff", borderRadius: 16, padding: 16, maxHeight: "90%" },
  heading: { fontSize: 20, fontWeight: "700", color: "#00796B" },
  input: { marginBottom: 12 },
  counterRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 12, 
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
  },
  inlineCounterGroup: { 
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  counterText: { 
    fontWeight: "bold", 
    marginRight: 10,
    color: '#333'
  },
  counterBtn: {
    margin: 0, 
    marginHorizontal: 4, 
    padding: 0
  },
  profilePhotoContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00796B',
    marginBottom: 10,
    overflow: 'hidden'
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
  },
  // Styles optimized for compact horizontal layout
  labelOptimized: { 
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 6, // Separate it from the first counter group
  },
  counterValueText: { 
    fontWeight: '700', 
    minWidth: 40, 
    textAlign: 'center',
    fontSize: 14, 
  },
});