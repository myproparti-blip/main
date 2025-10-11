// import { useRouter } from "expo-router";
// import { useMemo, useState } from "react";
// import {
//   Dimensions,
//   Image,
//   ImageBackground,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { Button, Card, Text } from "react-native-paper";
// import SearchMenuBar from "../components/SearchMenuBar";

// const { width } = Dimensions.get("window");
// const cardWidth = (width - 48) / 3; // 3 columns with spacing

// // Demo properties
// const properties = Array.from({ length: 30 }, (_, i) => ({
//   id: i + 1,
//   name: `Property ${i + 1}`,
//   location: ["New York, NY", "Miami, FL", "Los Angeles, CA", "Chicago, IL"][i % 4],
//   status: ["Available", "Occupied", "Maintenance"][i % 3],
//   image: `https://picsum.photos/300/200?random=${i + 1}`,
//   price: `$${500 + i * 10},000`,
//   description: "Beautiful property with modern amenities.",
// }));

// const chunkArray = (arr, size) => {
//   const chunks = [];
//   for (let i = 0; i < arr.length; i += size) {
//     chunks.push(arr.slice(i, i + size));
//   }
//   return chunks;
// };

// const Management = () => {
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   // Filter properties based on search
//   const filteredProperties = useMemo(() => {
//     const query = searchQuery.toLowerCase();
//     return properties.filter(
//       (p) =>
//         p.name.toLowerCase().includes(query) ||
//         p.location.toLowerCase().includes(query) ||
//         p.status.toLowerCase().includes(query)
//     );
//   }, [searchQuery]);

//   // Pagination
//   const paginatedProperties = useMemo(() => {
//     return filteredProperties.slice(0, currentPage * itemsPerPage);
//   }, [filteredProperties, currentPage]);

//   const handleLoadMore = () => {
//     if (currentPage * itemsPerPage >= filteredProperties.length) return;
//     setCurrentPage((prev) => prev + 1);
//   };

//   const handleOpenDetails = (property) => {
//     router.push({
//       pathname: "/propertyDetails",
//       params: { ...property },
//     });
//   };

//   // Insert ad after every 9 items
//   const displayRows = useMemo(() => {
//     const chunks = chunkArray(paginatedProperties, 3); // 3 cards per row
//     const rows = [];
//     chunks.forEach((chunk, index) => {
//       rows.push({ items: chunk, id: index });
//       if ((index + 1) % 3 === 0) {
//         rows.push({ ad: true, id: `ad-${index}` });
//       }
//     });
//     return rows;
//   }, [paginatedProperties]);

//   return (
//     <ImageBackground
//       source={{
//         uri:
//           "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600",
//       }}
//       style={{ flex: 1 }}
//       resizeMode="cover"
//     >
//       <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
//         <SearchMenuBar
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           onSearchChange={setSearchQuery}
//         />

//         <ScrollView
//           style={styles.container}
//           onScroll={({ nativeEvent }) => {
//             if (
//               nativeEvent.layoutMeasurement.height +
//                 nativeEvent.contentOffset.y >=
//               nativeEvent.contentSize.height - 20
//             ) {
//               handleLoadMore();
//             }
//           }}
//           scrollEventThrottle={400}
//         >
//           {displayRows.length > 0 ? (
//             <View>
//               {displayRows.map((row) =>
//                 row.ad ? (
//                   <View key={row.id} style={styles.adContainer}>
//                     <Text style={styles.adText}>
//                       Looking for Property Management? Contact us for full services!
//                     </Text>
//                     <Button
//                       mode="contained"
//                       buttonColor="#00796B"
//                       onPress={() => alert("Contact us!")}
//                     >
//                       Learn More
//                     </Button>
//                   </View>
//                 ) : (
//                   <View key={row.id} style={styles.grid}>
//                     {row.items.map((property) => (
//                       <Card key={property.id} style={styles.card}>
//                         <TouchableOpacity
//                           onPress={() => handleOpenDetails(property)}
//                           activeOpacity={0.9}
//                         >
//                           <Image
//                             source={{ uri: property.image }}
//                             style={styles.image}
//                           />
//                         </TouchableOpacity>
//                         <View style={styles.cardContent}>
//                           <Text style={styles.title}>{property.name}</Text>
//                           <Text style={styles.location}>{property.location}</Text>
//                           <Text
//                             style={[
//                               styles.status,
//                               {
//                                 color:
//                                   property.status === "Available"
//                                     ? "green"
//                                     : property.status === "Occupied"
//                                     ? "red"
//                                     : "orange",
//                               },
//                             ]}
//                           >
//                             {property.status}
//                           </Text>
//                           <Text style={styles.price}>{property.price}</Text>
//                           <Button
//                             mode="outlined"
//                             buttonColor="#167368ff"
//                             textColor="#e1efedff"
//                             style={styles.detailsButton}
//                             onPress={() => handleOpenDetails(property)}
//                           >
//                             Details
//                           </Button>
//                         </View>
//                       </Card>
//                     ))}
//                     {Array.from({ length: 3 - row.items.length }).map((_, i) => (
//                       <View key={`ph-${i}`} style={styles.cardPlaceholder} />
//                     ))}
//                   </View>
//                 )
//               )}
//             </View>
//           ) : (
//             <View style={styles.empty}>
//               <Text style={{ color: "#fff", fontSize: 16 }}>
//                 No matching properties found
//               </Text>
//             </View>
//           )}
//         </ScrollView>
//       </View>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   grid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
//   card: {
//     width: cardWidth,
//     borderRadius: 12,
//     overflow: "hidden",
//     backgroundColor: "rgba(255, 255, 255, 0.62)", // transparent glass effect
//     borderWidth: 1,
//     borderColor: "rgba(255,255,255,0.3)",
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//   },
//   cardPlaceholder: { width: cardWidth, backgroundColor: "transparent" },
//   image: {
//     width: "100%",
//     height: 90,
//     padding: 20,
//     opacity: 0.9,
//   },
//   cardContent: {
//     padding: 8,
//     flex: 1,
//     justifyContent: "space-between",
//   },
//   title: { fontWeight: "bold", marginTop: 6, color: "#fff" },
//   location: { fontSize: 12, color: "#fff" },
//   status: { marginTop: 4, fontWeight: "600", color: "#4e9642ff" },
//   price: { color: "#2f936bff", marginTop: 4, fontWeight: "bold" },
//   detailsButton: { marginTop: 8 },
//   empty: { alignItems: "center", justifyContent: "center", marginTop: 100 },
//   adContainer: {
//     padding: 16,
//     marginVertical: 10,
//     backgroundColor: "rgba(160, 226, 221, 0.8)",
//     borderRadius: 12,
//     alignItems: "center",
//   },
//   adText: {
//     fontSize: 16,
//     fontWeight: "700",
//     marginBottom: 10,
//     textAlign: "center",
//     color: "#00796B",
//   },
// });

// export default Management;


import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Card, // 👈 Imported for Modal/Portal functionality
  IconButton // 👈 Imported for the close button
  ,



  Modal, // 👈 Imported for modal overlay
  PaperProvider, // 👈 Imported for form display
  Portal,
  Text
} from "react-native-paper";
import AgentRegistrationForm from "../agentForm";
import SearchMenuBar from "../components/SearchMenuBar";
// 👈 Import the Agent Registration Form

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 3; // 3 columns with spacing

// Demo properties
const properties = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Property ${i + 1}`,
  location: ["New York, NY", "Miami, FL", "Los Angeles, CA", "Chicago, IL"][i % 4],
  status: ["Available", "Occupied", "Maintenance"][i % 3],
  image: `https://picsum.photos/300/200?random=${i + 1}`,
  price: `$${500 + i * 10},000`,
  description: "Beautiful property with modern amenities.",
}));

const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

const Management = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // 1. State for Agent Registration Modal
  const [showAgentForm, setShowAgentForm] = useState(false);
  const openForm = () => setShowAgentForm(true);
  const closeForm = () => setShowAgentForm(false);


  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        p.status.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Pagination
  const paginatedProperties = useMemo(() => {
    return filteredProperties.slice(0, currentPage * itemsPerPage);
  }, [filteredProperties, currentPage]);

  const handleLoadMore = () => {
    if (currentPage * itemsPerPage >= filteredProperties.length) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleOpenDetails = (property) => {
    router.push({
      pathname: "/propertyDetails",
      params: { ...property },
    });
  };

  // Insert ad after every 9 items
  const displayRows = useMemo(() => {
    const chunks = chunkArray(paginatedProperties, 3); // 3 cards per row
    const rows = [];
    chunks.forEach((chunk, index) => {
      rows.push({ items: chunk, id: index });
      if ((index + 1) % 3 === 0) {
        rows.push({ ad: true, id: `ad-${index}` });
      }
    });
    return rows;
  }, [paginatedProperties]);

  return (
    // 2. Wrap the component in PaperProvider
    <PaperProvider> 
        <ImageBackground
            source={{
                uri:
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80&h=1600",
            }}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.3)" }}>
                <SearchMenuBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearchChange={setSearchQuery}
                />

                <ScrollView
                    style={styles.container}
                    onScroll={({ nativeEvent }) => {
                        if (
                            nativeEvent.layoutMeasurement.height +
                            nativeEvent.contentOffset.y >=
                            nativeEvent.contentSize.height - 20
                        ) {
                            handleLoadMore();
                        }
                    }}
                    scrollEventThrottle={400}
                >
                    
                    {/* 3. Button to Open Agent Registration Form */}
                    <Button 
                        mode="contained" 
                        icon="account-tie-voice" 
                        onPress={openForm} 
                        buttonColor="#00796B"
                        style={styles.agentButton}
                        labelStyle={{ fontSize: 16 }}
                    >
                        Register as a Partner Agent
                    </Button>


                    {displayRows.length > 0 ? (
                        <View>
                            {displayRows.map((row) =>
                                row.ad ? (
                                    <View key={row.id} style={styles.adContainer}>
                                        <Text style={styles.adText}>
                                            Looking for Property Management? Contact us for full services!
                                        </Text>
                                        <Button
                                            mode="contained"
                                            buttonColor="#00796B"
                                            onPress={() => alert("Contact us!")}
                                        >
                                            Learn More
                                        </Button>
                                    </View>
                                ) : (
                                    <View key={row.id} style={styles.grid}>
                                        {row.items.map((property) => (
                                            <Card key={property.id} style={styles.card}>
                                                <TouchableOpacity
                                                    onPress={() => handleOpenDetails(property)}
                                                    activeOpacity={0.9}
                                                >
                                                    <Image
                                                        source={{ uri: property.image }}
                                                        style={styles.image}
                                                    />
                                                </TouchableOpacity>
                                                <View style={styles.cardContent}>
                                                    <Text style={styles.title}>{property.name}</Text>
                                                    <Text style={styles.location}>{property.location}</Text>
                                                    <Text
                                                        style={[
                                                            styles.status,
                                                            {
                                                                color:
                                                                    property.status === "Available"
                                                                        ? "green"
                                                                        : property.status === "Occupied"
                                                                        ? "red"
                                                                        : "orange",
                                                            },
                                                        ]}
                                                    >
                                                        {property.status}
                                                    </Text>
                                                    <Text style={styles.price}>{property.price}</Text>
                                                    <Button
                                                        mode="outlined"
                                                        buttonColor="#167368ff"
                                                        textColor="#e1efedff"
                                                        style={styles.detailsButton}
                                                        onPress={() => handleOpenDetails(property)}
                                                    >
                                                        Details
                                                    </Button>
                                                </View>
                                            </Card>
                                        ))}
                                        {Array.from({ length: 3 - row.items.length }).map((_, i) => (
                                            <View key={`ph-${i}`} style={styles.cardPlaceholder} />
                                        ))}
                                    </View>
                                )
                            )}
                        </View>
                    ) : (
                        <View style={styles.empty}>
                            <Text style={{ color: "#fff", fontSize: 16 }}>
                                No matching properties found
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </ImageBackground>

        {/* 4. Modal for Agent Registration Form */}
        <Portal>
            <Modal 
                visible={showAgentForm} 
                onDismiss={closeForm} 
                contentContainerStyle={styles.modalContainer}
            >
                {/* Modal Header with Close Button */}
                <View style={styles.modalHeader}>
                    <IconButton 
                        icon="close-circle-outline" 
                        size={28} 
                        color="#D32F2F" 
                        onPress={closeForm} 
                    />
                </View>
                
                {/* The Agent Registration Form Component */}
                <AgentRegistrationForm
                    // Pass the close function so the form can dismiss itself on submit
                    onSubmissionComplete={closeForm} 
                />
            </Modal>
        </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    // New style for the Agent Registration button
    agentButton: {
        marginBottom: 20,
        marginTop: 5,
        paddingVertical: 4,
        width: '100%',
        alignSelf: 'center',
    },
    grid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
    card: {
        width: cardWidth,
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.62)", // transparent glass effect
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    cardPlaceholder: { width: cardWidth, backgroundColor: "transparent" },
    image: {
        width: "100%",
        height: 90,
        padding: 20,
        opacity: 0.9,
    },
    cardContent: {
        padding: 8,
        flex: 1,
        justifyContent: "space-between",
    },
    title: { fontWeight: "bold", marginTop: 6, color: "#000" }, // Changed color for better contrast
    location: { fontSize: 12, color: "#333" },                   // Changed color for better contrast
    status: { marginTop: 4, fontWeight: "600", color: "#4e9642ff" },
    price: { color: "#2f936bff", marginTop: 4, fontWeight: "bold" },
    detailsButton: { marginTop: 8 },
    empty: { alignItems: "center", justifyContent: "center", marginTop: 100 },
    adContainer: {
        padding: 16,
        marginVertical: 10,
        backgroundColor: "rgba(160, 226, 221, 0.8)",
        borderRadius: 12,
        alignItems: "center",
    },
    adText: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
        textAlign: "center",
        color: "#00796B",
    },
    // --- Modal Styles ---
    modalContainer: {
        backgroundColor: 'white',
        padding: 0,
        margin: 10,
        borderRadius: 15,
        flex: 0.95, 
        alignSelf: 'center',
        width: '95%',
        maxHeight: '95%',
    },
    modalHeader: {
        alignItems: 'flex-end',
        paddingHorizontal: 10,
        paddingTop: 5,
    }
});

export default Management;
