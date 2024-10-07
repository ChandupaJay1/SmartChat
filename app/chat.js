import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

export default function Chat() {

  const item = useLocalSearchParams();
  const [getchatArray, setChatArray] = useState([]);
  const [getChatText, setChatText] = useState("");

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    async function fetchChatArray() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/LoadChat?logged_user_id="+user.id+"&other_user_id="+item.other_user_id
      );
      if (response.ok) {
        let chatArray = await response.json();
        setChatArray(chatArray);
      }
    }

    fetchChatArray();

    setInterval(() => {
      fetchChatArray();
    }, 5000);
    
  }, []);

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#E5E5E5", "#FFFFFF"]} style={styles.view1}>
      <StatusBar hidden={true} />

      {/* Header Section */}
      <View style={styles.view2}>
        <View style={styles.view3}>
          {item.avatar_image_found === "true" ? (
            <Image
              style={styles.image1}
              source={"https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/AvatarImages/" + item.other_user_mobile + ".png"}
            />
          ) : (
            <Text style={styles.text1}>{item.other_user_avatar_letters}</Text>
          )}
          {/* Online Status Indicator */}
          <View style={item.other_user_status === 1 ? styles.statusOnline : styles.statusOffline} />
        </View>

        <View style={styles.view4}>
          <Text style={styles.text2}>{item.other_user_name}</Text>
          <Text style={styles.text3}>{item.other_user_status === 1 ? "Online" : "Offline"}</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <View style={styles.center_view}>
        <FlashList
          data={getchatArray}
          renderItem={({ item }) => (
            <View style={item.side === "right" ? styles.view5_1 : styles.view5_2}>
              <Text style={styles.textMessage}>{item.message}</Text>
              <View style={styles.view6}>
                <Text style={styles.text4}>{item.datetime}</Text>
                {item.side === "right" ? (
                  <FontAwesome6 name="check" size={18} color={item.status === 1 ? "green" : "gray"} />
                ) : null}
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>

      {/* Input and Send Button */}
      <View style={styles.view7}>
        <TextInput
          style={styles.input1}
          value={getChatText}
          onChangeText={(text) => setChatText(text)}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <Pressable
          style={styles.pressable1}
          onPress={async () => {
            if (getChatText.length === 0) {
              Alert.alert("Error", "Please enter a message");
            } else {
              let userJson = await AsyncStorage.getItem("user");
              let user = JSON.parse(userJson);

              let response = fetch(
                "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/SendChat?logged_user_id=" +
                user.id + "&other_user_id=" + item.other_user_id + "&message=" + getChatText
              );
              if (response.ok) {
                let json = await response.json();
                if (json.success) {
                  setChatText("");
                }
              }
            }
          }}
        >
          <FontAwesome6 name="paper-plane" color="white" size={24} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  view2: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  view3: {
    position: "relative",
    backgroundColor: "white",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  statusOnline: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "green",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  statusOffline: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    backgroundColor: "gray",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  image1: {
    width: 58,
    height: 58,
    borderRadius: 30,
  },
  text1: {
    fontSize: 28,
    fontFamily: "Montserrat-Bold",
    color: "#333",
  },
  view4: {
    marginLeft: 15,
  },
  text2: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
    color: "#333",
  },
  text3: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
    color: "#888",
  },
  center_view: {
    flex: 1,
    marginVertical: 10,
  },
  view5_1: {
    backgroundColor: "#DCF8C6", // WhatsApp-like green bubble
    borderRadius: 20,
    borderTopRightRadius: 0,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    alignSelf: "flex-end",
    maxWidth: "80%",
    elevation: 2,  // Add shadow for floating effect
  },
  view5_2: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderTopLeftRadius: 0,
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    alignSelf: "flex-start",
    maxWidth: "80%",
    elevation: 2,  // Add shadow for floating effect
  },
  textMessage: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
    color: "#333",
  },
  view6: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
  },
  text4: {
    fontSize: 12,
    fontFamily: "Montserrat-Regular",
    color: "#888",
  },
  view7: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  input1: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    backgroundColor: "white",
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },
  pressable1: {
    backgroundColor: "#128C7E",
    borderRadius: 50,
    padding: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

