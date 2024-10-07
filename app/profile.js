import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const [name, setName] = useState(""); // Store user's name
  const [number, setNumber] = useState(""); // Store user's number
  const [profilePic, setProfilePic] = useState(null); // Store profile picture URI
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch initial profile details from the backend
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        let response = await fetch("https://your-backend-url.com/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
          },
        });
        let profileData = await response.json();

        if (response.ok) {
          setName(profileData.name);
          setNumber(profileData.mobile);
          setProfilePic(profileData.profilePic); // Assuming backend returns profilePic URL
        } else {
          Alert.alert("Error", "Failed to fetch profile.");
        }
      } catch (error) {
        Alert.alert("Error", "Unable to connect to the server.");
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  // Image picker for selecting a profile picture
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri); // Update profile picture URI
    }
  };

  // Save updated profile details to the backend
  const saveProfile = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);

    if (profilePic) {
      let fileName = profilePic.split("/").pop();
      let fileType = fileName.split(".").pop();

      formData.append("profilePic", {
        uri: profilePic,
        name: fileName,
        type: `image/${fileType}`,
      });
    }

    try {
      let response = await fetch("https://your-backend-url.com/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
        body: formData,
      });

      let result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Profile updated successfully.");
      } else {
        Alert.alert("Error", result.message || "Failed to update profile.");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to connect to the server.");
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.headerText}>Profile</Text>
          
          {/* Display Profile Picture */}
          <View style={styles.profilePicContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholderPic}>
                <Text style={styles.placeholderText}>No Picture</Text>
              </View>
            )}
            <Button title="Change Picture" onPress={pickImage} />
          </View>

          {/* Display and Update Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Display Number (Non-editable) */}
          <Text style={styles.infoText}>Phone Number: {number}</Text>

          <Button title="Save Profile" onPress={saveProfile} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  headerText: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: "bold",
  },
  profilePicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  placeholderPic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  placeholderText: {
    color: "#777",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  infoText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
