// profile.jsx
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity // <-- ADD THIS IMPORT
  ,


  View
} from "react-native";
import {
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";

// --- Custom Component for Quick Action Tiles ---
const QuickActionTile = ({ icon, title, onPress, backgroundColor }) => (
  // TouchableOpacity is used here, so it must be imported from 'react-native'
  <TouchableOpacity 
    style={[styles.actionTile, { backgroundColor }]}
    onPress={onPress}
  >
    <List.Icon icon={icon} color="#fff" style={{ margin: 0 }} />
    <Text style={styles.actionTileText}>{title}</Text>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const theme = useTheme();
  const primaryColor = '#009688';

  return (
    <ScrollView style={styles.container}>

      <View style={[styles.headerBanner, { backgroundColor: primaryColor }]}>
        <Avatar.Image
          size={90}
          source={{ uri: "https://i.pravatar.cc/300" }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
          xyz name
        </Text>
        <Text style={styles.userEmail}>
          xyz@email.com
        </Text>
        <Button
          mode="contained"
          icon="account-edit"
          labelStyle={{ fontWeight: 'bold' }}
          buttonColor="#fff"
          textColor={primaryColor}
          style={{ marginTop: 12, width: '65%', borderRadius: 12 }}
          onPress={() => console.log("Edit Profile")}
        >
          Edit Profile
        </Button>
      </View>

      <View style={styles.actionContainer}>
        <QuickActionTile
          icon="plus-box"
          title="Post Property"
          backgroundColor="#009688"
          onPress={() => console.log("Post Property")}
        />
        <QuickActionTile
          icon="currency-usd"
          title="Loan Services"
          backgroundColor="#FF9800"
          onPress={() => console.log("Loan Services")}
        />
        <QuickActionTile
          icon="eye"
          title="Recently Viewed"
          backgroundColor="#2196F3"
          onPress={() => console.log("Recently Viewed")}
        />
      </View>
      
      {/* 3. Transactional Links */}
      <Card style={styles.card}>
        <List.Section title="My Transactions & Listings" titleStyle={styles.listSectionTitle}>
          <List.Item
            title="My Listings"
            left={(props) => <List.Icon {...props} icon="home-city" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("My Listings")}
          />
          <Divider />
          <List.Item
            title="Shortlisted Properties"
            left={(props) => <List.Icon {...props} icon="heart" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Shortlisted Properties")}
          />
          <Divider />
          <List.Item
            title="My Enquiries"
            left={(props) => <List.Icon {...props} icon="chat-question" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("My Enquiries")}
          />
        </List.Section>
      </Card>

      {/* 4. Settings & Support Links */}
      <Card style={styles.card}>
        <List.Section title="App & Account Settings" titleStyle={styles.listSectionTitle}>
          <List.Item
            title="Notifications"
            left={(props) => <List.Icon {...props} icon="bell-ring" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Notifications")}
          />
          <Divider />
          <List.Item
            title="App Settings"
            left={(props) => <List.Icon {...props} icon="cog" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Settings")}
          />
          <Divider />
          <List.Item
            title="Help & Support"
            left={(props) => <List.Icon {...props} icon="lifebuoy" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => console.log("Help & Support")}
          />
        </List.Section>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        icon="logout"
        style={styles.logoutButton}
        buttonColor="#e53935" // Red for sign out
        textColor="#fff"
        onPress={() => console.log("Logout")}
      >
        LOGOUT
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Light gray background
  },
  headerBanner: {
    padding: 32,
    alignItems: 'center',
    marginBottom: 12,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 10,
  },
  avatar: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  // --- Quick Action Tiles Styles ---
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 0,
    marginBottom: 20,
  },
  actionTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 4,
    elevation: 4,
  },
  actionTileText: {
    color: '#fff',
    marginTop: 4,
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
  },
  // --- Card/List Styles ---
  card: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    paddingHorizontal: 0, // Reset padding for List.Section
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 40,
    borderRadius: 12,
    paddingVertical: 4,
    elevation: 4,
  }
});