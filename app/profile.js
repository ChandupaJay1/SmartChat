import {
  View,
  Text,
  StyleSheet,
  Alert,
  TextInput,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Profile() {
  const [getFName, setFName] = useState("");
  const bPath = require("../assets/icon.png");
  const [getImage, setImage] = useState(bPath);
  const [getLName, setLName] = useState("");
  const [getMobile, setMobile] = useState("");
  const [getIsImageSet, setIsImageSet] = useState(false);
  const [getHasImageSet, setHasImageSet] = useState(false);

  const backendUrl =
    "https://65a2-2407-c00-4007-5b6e-f152-fb40-8318-e8e0.ngrok-free.app/";

  // Load fonts
  const [loaded] = useFonts({
    poppins: require("../assets/fonts/Montserrat-Bold.ttf"),
    poppins2: require("../assets/fonts/Montserrat-Light.ttf"),
    poppins3: require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  // Ensure the splash screen is hidden after fonts are loaded
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Load user details from AsyncStorage
  useEffect(() => {
    async function userDetail() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);
      if (user) {
        setFName(user.first_name);
        setLName(user.last_name);
        setMobile(user.mobile);
        if (user.hasProfilePic) {
          setImage("https://65a2-2407-c00-4007-5b6e-f152-fb40-8318-e8e0.ngrok-free.app/SmartChat/AvatarImages/" +
            item.other_user_mobile +
            ".png");
          setHasImageSet(true);
        }
      }
    }
    userDetail();
  }, []);

  if (!loaded) {
    return null; // Return null until fonts are loaded
  }

  const handleProfileSave = async () => {
    if (!getMobile) {
      Alert.alert("Error", "Mobile number is missing!");
      return;
    }

    let formData = new FormData();
    formData.append("mobile", getMobile);
    formData.append("firstName", getFName);
    formData.append("lastName", getLName);
    formData.append("isImageSet", getIsImageSet);

    if (getIsImageSet) {
      formData.append("avatarImage", {
        name: "avatarImage.png",
        type: "image/png",
        uri: getImage,
      });
    }

    console.log("FormData ready to be sent:", formData);

    try {
      const response = await fetch(backendUrl + "EditProfile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          Alert.alert("Success", json.message);
        } else {
          Alert.alert("Error", json.message);
        }
      } else {
        Alert.alert("Error", "Unable to connect to the server.");
      }
    } catch (error) {
      console.error("Error occurred: ", error);
      Alert.alert("Error", "An unexpected error occurred: " + error.message);
    }

  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={getHasImageSet ? { uri: getImage } : bPath}
            style={styles.avatar}
            contentFit={"cover"}
          />
          <Pressable
            style={styles.cameraButton}
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });
              if (!result.canceled) {
                setImage(result.assets[0].uri);
                setIsImageSet(true);
              }
            }}
          >
            <FontAwesome6 name={"camera"} color={"white"} size={20} />
          </Pressable>
        </View>
      </View>

      <View style={styles.detailsSection}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            value={getFName}
            onChangeText={setFName}
            style={styles.input}
            maxLength={20}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            value={getLName}
            onChangeText={setLName}
            style={styles.input}
            maxLength={20}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile</Text>
          <TextInput
            value={getMobile}
            onChangeText={setMobile}
            style={styles.input}
            editable={false}
            maxLength={20}
          />
        </View>

        <Pressable style={styles.saveButton} onPress={handleProfileSave}>
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    padding: 20,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 20,
  },
  detailsSection: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    color: "#A0A0A0",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#333333",
    color: "#FFFFFF",
    padding: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
