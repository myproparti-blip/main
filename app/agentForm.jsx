import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform as RNPlatform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ActivityIndicator, Button, Chip, Divider, Text } from "react-native-paper";

// --- MOCK DATA / API PLACEHOLDERS ---
const ALL_CITIES = [
    { label: "Ahmedabad", value: "ahmedabad" },
    { label: "Surat", value: "surat" },
    { label: "Vadodara", value: "vadodara" },
    { label: "Mumbai", value: "mumbai" },
    { label: "Delhi", value: "delhi" },
    { label: "Bangalore", value: "bangalore" },
];

const MOCK_AREAS_BY_CITY = {
    'ahmedabad': [
        { label: "Gota", value: "gota" },
        { label: "Bopal", value: "bopal" },
        { label: "Chandkheda", value: "chandkheda" },
        { label: "Sarkhej", value: "sarkhej" },
        { label: "Satellite", value: "satellite" },
    ],
    // Add more city-area mappings here
};

const fetchAreasForCity = async (cityValue) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_AREAS_BY_CITY[cityValue] || [];
};

const DEAL_OPTIONS = [
    { label: "Rent/Lease", value: "rent_lease" },
    { label: "Pre-launch", value: "pre_launch" },
    { label: "Original Booking", value: "original_booking" },
    { label: "Resale", value: "resale" },
    { label: "Others", value: "others", isCustom: true }, // Added flag for custom input
];
// ----------------------------------------------------------------------

// --- CHIP SELECTOR COMPONENT (Multi-Select) ---
const MultiChipSelector = ({ label, options, selectedValues, onSelect, onCustomInput, customInputValue }) => {
    const handleToggle = (option) => {
        const { value, isCustom } = option;
        const isSelected = selectedValues.includes(value);

        let newSelectedValues;
        if (isSelected) {
            newSelectedValues = selectedValues.filter(v => v !== value);
        } else {
            newSelectedValues = [...selectedValues, value];
        }
        onSelect(newSelectedValues);
        
        // Clear custom input if 'Others' is deselected
        if (isCustom && isSelected) {
            onCustomInput("");
        }
    };

    const isOthersSelected = selectedValues.includes('others');

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
                            onPress={() => handleToggle(option)}
                            style={[styles.chip, isSelected && styles.chipSelected,]}
                            textStyle={[styles.chipText, isSelected && styles.chipTextSelected,]}
                            icon={isSelected ? "check-bold" : undefined}
                        >
                            {option.label}
                        </Chip>
                    );
                })}
            </View>
            {/* Conditional Input for "Others" */}
            {isOthersSelected && (
                <TextInput
                    placeholder="Specify what you deal in (e.g., Commercial plots, Industrial sheds)"
                    value={customInputValue}
                    onChangeText={onCustomInput}
                    style={[styles.textInput, { marginTop: 10 }]}
                />
            )}
        </View>
    );
};
// ----------------------------------------------------------------------


export default function AgentRegistrationForm({ onSubmissionComplete }) {
    const [loading, setLoading] = useState(false);
    
    // City Selection State
    const [cityQuery, setCityQuery] = useState("");
    const [citySelected, setCitySelected] = useState(null); 
    const [isSearchingCity, setIsSearchingCity] = useState(false); 

    // Area State
    const [suggestedAreas, setSuggestedAreas] = useState([]);
    const [areaLoading, setAreaLoading] = useState(false);

    const [form, setForm] = useState({
        isPropertyDealer: "yes", // Changed to chip option
        agentName: "",
        firmName: "",
        operatingCity: "", 
        operatingAreaChips: [],
        operatingAreaInput: "", 
        operatingSince: "",
        teamMembers: "",
        dealsIn: [], 
        dealsInOther: "", // New state for 'Others' custom input
        aboutAgent: "",
    });

    // Fetch areas whenever a city is selected/changes
    useEffect(() => {
        if (citySelected) {
            const loadAreas = async () => {
                setAreaLoading(true);
                const areas = await fetchAreasForCity(citySelected.value);
                setSuggestedAreas(areas);
                setAreaLoading(false);
            };
            loadAreas();
        } else {
            setSuggestedAreas([]);
            setForm(prev => ({ ...prev, operatingCity: "", operatingAreaChips: [] }));
        }
    }, [citySelected]);


    // --- Handlers ---
    const handleFormChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };
    
    // City search filtering
    const filteredCities = useMemo(() => {
        if (!isSearchingCity || !cityQuery) return []; 
        
        const query = cityQuery.toLowerCase().trim();

        if (citySelected && citySelected.label.toLowerCase() === query) {
             return [];
        }

        return ALL_CITIES.filter(city => 
            city.label.toLowerCase().includes(query)
        );
    }, [cityQuery, isSearchingCity, citySelected]);

    // City Selection
    const handleSelectCity = useCallback((city) => {
        setCitySelected(city);
        setCityQuery(city.label); 
        setIsSearchingCity(false); 
        setForm(prev => ({ 
            ...prev, 
            operatingCity: city.value,
            operatingAreaChips: [], 
        }));
    }, []);

    // Function to handle changes in the city input field
    const handleCityInputChange = (text) => {
        setCityQuery(text);
        if (citySelected && text.toLowerCase() !== citySelected.label.toLowerCase()) {
            setCitySelected(null);
        }
    };
    
    // Area Chip Toggle
    const handleToggleArea = (areaValue) => {
        const isSelected = form.operatingAreaChips.includes(areaValue);
        const currentAreas = form.operatingAreaChips;

        handleFormChange(
            "operatingAreaChips",
            isSelected 
            ? currentAreas.filter(v => v !== areaValue)
            : [...currentAreas, areaValue]
        );
    };

    // Handler for adding a new area from the text input
    const handleAddArea = () => {
        if (!citySelected) {
            Alert.alert("Error", "Please select an Operating City first.");
            return;
        }

        const newArea = form.operatingAreaInput.trim();
        if (newArea) {
            const newAreaValue = newArea.toLowerCase().replace(/\s/g, '_'); 

            if (!form.operatingAreaChips.includes(newAreaValue)) {
                setForm((prev) => ({
                    ...prev,
                    operatingAreaChips: [...prev.operatingAreaChips, newAreaValue],
                    operatingAreaInput: "", 
                }));
            } else {
                Alert.alert("Already Added", `The area '${newArea}' is already in your list.`);
                setForm(prev => ({ ...prev, operatingAreaInput: "" })); 
            }
        }
    };


    const handleSubmit = async () => {
        setLoading(true);
        
        // Validation check for Deals In -> if 'others' is selected, must fill 'dealsInOther'
        const isDealsInOtherSelected = form.dealsIn.includes('others');
        if (isDealsInOtherSelected && !form.dealsInOther.trim()) {
            Alert.alert("Missing Details", "Please specify what you deal in under 'Others'.");
            setLoading(false);
            return;
        }

        if (!form.agentName || form.dealsIn.length === 0 || !form.operatingCity) {
             Alert.alert("Missing Fields", "Please fill in your Name, Deals In, and Operating City.");
             setLoading(false);
             return;
        }

        // --- MOCK API CALL ---
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log("Submitting Agent Data:", form);
            Alert.alert("Registration Successful!", "Your details have been submitted for review. Thank you!");
            
            if (onSubmissionComplete) {
                onSubmissionComplete();
            }

        } catch (error) {
            console.error("Submission Error:", error);
            Alert.alert("Submission Failed", "There was an error processing your request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Function to render area chip label nicely
    const getAreaLabel = (areaValue) => {
        const suggested = suggestedAreas.find(a => a.value === areaValue);
        return suggested ? suggested.label : areaValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: "#fff" }}
            behavior={RNPlatform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
                <Text variant="headlineMedium" style={styles.header}>
                    💼 Agent Registration
                </Text>
                
                <Divider style={{ marginVertical: 15 }} />

                {/* 1. Property Dealer Chips (Yes/No) */}
                <Text style={styles.sectionTitle}>Are you a property dealer?</Text>
                <View style={styles.chipWrapper}>
                    {/* Yes Chip */}
                    <Chip
                        mode="flat"
                        selected={form.isPropertyDealer === 'yes'}
                        onPress={() => handleFormChange("isPropertyDealer", "yes")}
                        style={[styles.chip, form.isPropertyDealer === 'yes' && styles.chipSelected, {minWidth: 80}]}
                        textStyle={[styles.chipText, form.isPropertyDealer === 'yes' && styles.chipTextSelected]}
                        icon={form.isPropertyDealer === 'yes' ? "check-bold" : undefined}
                    >
                        Yes
                    </Chip>

                    {/* No Chip */}
                    <Chip
                        mode="flat"
                        selected={form.isPropertyDealer === 'no'}
                        onPress={() => handleFormChange("isPropertyDealer", "no")}
                        style={[styles.chip, form.isPropertyDealer === 'no' && styles.chipSelected, {minWidth: 80}]}
                        textStyle={[styles.chipText, form.isPropertyDealer === 'no' && styles.chipTextSelected]}
                        icon={form.isPropertyDealer === 'no' ? "check-bold" : undefined}
                    >
                        No
                    </Chip>
                </View>
                
                <Divider style={{ marginVertical: 15 }} />


                {form.isPropertyDealer === "yes" && (
                    <>
                        {/* 2. Agent Details (Basic Inputs) */}
                        <Text style={styles.sectionTitle}>Agent & Firm Details</Text>
                        <TextInput
                            placeholder="Your Full Name *"
                            value={form.agentName}
                            onChangeText={(v) => handleFormChange("agentName", v)}
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="Firm Name (Optional)"
                            value={form.firmName}
                            onChangeText={(v) => handleFormChange("firmName", v)}
                            style={styles.textInput}
                        />
                         <TextInput
                            placeholder="Years Operating Since (e.g., 2005)"
                            value={form.operatingSince}
                            onChangeText={(v) => handleFormChange("operatingSince", v)}
                            keyboardType="numeric"
                            style={styles.textInput}
                        />
                        <TextInput
                            placeholder="Team Members Count"
                            value={form.teamMembers}
                            onChangeText={(v) => handleFormChange("teamMembers", v)}
                            keyboardType="numeric"
                            style={styles.textInput}
                        />
                        <Divider style={{ marginVertical: 15 }} />
                        
                        
                        {/* 3. Deals In (Multi-Select Chips with Custom Input) */}
                        <MultiChipSelector
                            label="Deals In *"
                            options={DEAL_OPTIONS}
                            selectedValues={form.dealsIn}
                            onSelect={(values) => handleFormChange("dealsIn", values)}
                            customInputValue={form.dealsInOther}
                            onCustomInput={(value) => handleFormChange("dealsInOther", value)}
                        />
                        <Divider style={{ marginVertical: 15 }} />


                        {/* 4. Operating City (Search Bar Style) */}
                        <View style={styles.citySearchWrapper}>
                            <Text style={[styles.subLabel, { fontWeight: 'bold', fontSize: 15, marginBottom: 5 }]}>Operating City *</Text>
                            <TextInput
                                placeholder="Search and Select City"
                                value={cityQuery}
                                onChangeText={handleCityInputChange}
                                onFocus={() => setIsSearchingCity(true)}
                                onBlur={() => {
                                    // Delay hiding results slightly to allow click event to register
                                    setTimeout(() => setIsSearchingCity(false), 200);
                                    if (!citySelected) {
                                        setCityQuery("");
                                    } else {
                                        setCityQuery(citySelected.label);
                                    }
                                }}
                                style={[styles.textInput, citySelected && styles.selectedCityInput]}
                            />
                            
                            {/* City Suggestions/Results */}
                            {filteredCities.length > 0 && isSearchingCity && (
                                <View style={styles.cityResultsContainer}>
                                    {filteredCities.map((city) => (
                                        <TouchableOpacity 
                                            key={city.value} 
                                            style={styles.cityResultItem}
                                            onPress={() => handleSelectCity(city)}
                                        >
                                            <Text style={styles.cityResultText}>
                                                {city.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}
                        </View>
                        
                        <Divider style={{ marginVertical: 15 }} />


                        {/* 5. Operates In Areas (Combined Section) */}
                        {citySelected ? (
                            <View style={styles.chipContainer}>
                                <Text style={styles.chipLabel}>Operates In Areas - {citySelected.label}</Text>
                                
                                {/* Area Input and Add Button */}
                                <Text style={[styles.subLabel, { marginTop: 10 }]}>Search or Add Custom Area:</Text>
                                <View style={styles.areaInputRow}>
                                    <TextInput
                                        placeholder="Type an area name (e.g., Satellite)"
                                        value={form.operatingAreaInput}
                                        onChangeText={(v) => handleFormChange("operatingAreaInput", v)}
                                        style={styles.areaTextInput}
                                        onSubmitEditing={handleAddArea}
                                    />
                                    <Button mode="contained" onPress={handleAddArea} buttonColor="#009688">
                                        Add
                                    </Button>
                                </View>
                                
                                {/* Suggested/Current Chips (Combined Display) */}
                                <Text style={[styles.subLabel, { marginTop: 15 }]}>Tap to Select Suggested Areas or Remove Current Areas:</Text>
                                <View style={styles.chipWrapper}>
                                    
                                    {areaLoading && <ActivityIndicator size="small" color="#009688" style={{ marginVertical: 10 }} />}
                                    
                                    {/* Suggested Chips that aren't already selected */}
                                    {!areaLoading && suggestedAreas.map((area) => {
                                        const isSelected = form.operatingAreaChips.includes(area.value);
                                        if (isSelected) return null;
                                        return (
                                            <Chip
                                                key={area.value}
                                                mode="outlined"
                                                onPress={() => handleToggleArea(area.value)}
                                                style={styles.chipOutline}
                                                textStyle={styles.chipText}
                                            >
                                                {area.label}
                                            </Chip>
                                        );
                                    })}

                                    {/* All Currently Selected Chips (Suggested and Custom) */}
                                    {form.operatingAreaChips.map((areaValue) => {
                                        const label = getAreaLabel(areaValue);
                                        
                                        return (
                                            <Chip
                                                key={areaValue}
                                                mode="contained"
                                                onClose={() => handleToggleArea(areaValue)} 
                                                style={styles.chipSelected}
                                                textStyle={styles.chipTextSelected}
                                                closeIcon="close-circle"
                                            >
                                                {label}
                                            </Chip>
                                        );
                                    })}
                                    
                                    {!areaLoading && suggestedAreas.length === 0 && form.operatingAreaChips.length === 0 && (
                                        <Text style={styles.subLabel}>No suggested areas available. Add custom areas above.</Text>
                                    )}
                                </View>
                            </View>
                        ) : (
                            <Text style={[styles.subLabel, { textAlign: 'center', color: '#FF9800', fontSize: 14, marginTop: 15 }]}>
                                👆 Please select an Operating City to see and add areas.
                            </Text>
                        )}
                        
                        <Divider style={{ marginVertical: 15 }} />

                        {/* 6. About Agent */}
                        <Text style={styles.sectionTitle}>About Agent</Text>
                        <TextInput
                            placeholder="Write a brief description about your services and firm."
                            value={form.aboutAgent}
                            onChangeText={(v) => handleFormChange("aboutAgent", v)}
                            multiline
                            numberOfLines={4}
                            style={[styles.textInput, styles.multiLineInput]}
                        />
                    </>
                )}
                
                <View style={{ height: 20 }} />

                {/* 7. Submit Button */}
                <Button
                    mode="contained"
                    buttonColor="#009688"
                    style={{ marginTop: 20, paddingVertical: 8 }}
                    loading={loading}
                    onPress={handleSubmit}
                    disabled={form.isPropertyDealer === "no" || loading}
                >
                    {loading ? "Registering..." : "Submit Registration"}
                </Button>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// --- STYLES ---
const styles = StyleSheet.create({
    header: { color: "#00796B", fontWeight: "bold", marginBottom: 10, marginTop: 10, textAlign: 'center', },
    sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10, color: "#333", },
    textInput: {
        backgroundColor: "#F5F5F5", marginTop: 10, padding: 12, borderRadius: 8,
        borderWidth: 1, borderColor: "#B2DFDB", minHeight: 45,
    },
    multiLineInput: { minHeight: 100, textAlignVertical: 'top', },
    
    // Location Styles
    citySearchWrapper: { position: 'relative', zIndex: 10 }, 
    selectedCityInput: {
        borderColor: '#00796B', 
        backgroundColor: '#E8F5E9',
        fontWeight: 'bold',
        color: '#004D40',
    },
    cityResultsContainer: {
        position: 'absolute', 
        top: 85, 
        left: 0,
        right: 0,
        borderWidth: 1, 
        borderColor: '#B2DFDB', 
        borderRadius: 8, 
        maxHeight: 200, 
        backgroundColor: '#FFFFFF', 
        zIndex: 10, 
        elevation: 3, 
    },
    cityResultItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5', },
    cityResultText: { color: '#333', fontSize: 16, },
    
    // Chip Styles
    chipContainer: { marginBottom: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#E0F2F1', },
    chipLabel: { fontWeight: "bold", marginBottom: 8, color: "#333", fontSize: 15, },
    subLabel: { fontSize: 12, color: '#666', marginTop: 5, marginBottom: 5, },
    chipWrapper: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 10, minHeight: 40, alignItems: 'center' },
    
    chipOutline: { backgroundColor: '#fff', borderColor: "#B2DFDB", borderWidth: 1, },
    chipSelected: { 
        backgroundColor: "#E0F2F1", 
        borderColor: "#00796B", 
        borderWidth: 1.5, 
        // Style for selected Deals In/Yes/No chips
        backgroundColor: '#009688', // Green for selection
    },
    chipText: { color: "#009688", fontWeight: '500', },
    chipTextSelected: { 
        color: "#FFFFFF", // White text on green background
        fontWeight: 'bold', 
    },
    
    areaInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5, },
    areaTextInput: {
        flex: 1, marginRight: 10, backgroundColor: "#F5F5F5", padding: 10, borderRadius: 8,
        borderWidth: 1, borderColor: "#B2DFDB", minHeight: 45,
    },
});