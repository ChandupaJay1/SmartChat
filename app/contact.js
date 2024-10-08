import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function fetchContacts() {
      let response = await fetch(
        "https://your-api-endpoint.com/api/getAllUsers" // Replace with your API endpoint
      );

      if (response.ok) {
        let json = await response.json();
        setContacts(json.users); // Assuming the API returns a users array
      }
    }

    fetchContacts();
  }, []);

  return (
    <LinearGradient colors={["#131C21", "#0B141A"]} style={styles.view1}>
      <StatusBar hidden={true} />

      <FlashList
        data={contacts}
        renderItem={({ item }) => (
          <Pressable
            style={styles.contactItem}
            onPress={() => {
              // Handle contact selection, maybe navigate to chat
              router.push({
                pathname: "/chat",
                params: { userId: item.id }, // Example parameter, adapt as necessary
              });
            }}
          >
            <View style={styles.avatarContainer}>
              {item.avatar_image_found ? (
                <Image
                  source={{ uri: item.avatar_url }} // Update according to your data structure
                  contentFit="contain"
                  style={styles.image}
                />
              ) : (
                <Text style={styles.initials}>{item.name.charAt(0)}</Text>
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.status}>
                {item.isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </Pressable>
        )}
        estimatedItemSize={200}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 25,
    backgroundColor: "#0B141A",
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  initials: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    color: "#D9D9D9", // Lighter color for initials
  },

  textContainer: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#D9D9D9",
  },

  status: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#A1A1A1", // Lighter gray for status
  },
});
