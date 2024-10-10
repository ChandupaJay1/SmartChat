import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Pressable } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Home() {
  const [getchatArray, setChatArray] = useState([]);
  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    async function fetchData() {
      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        "https://65a2-2407-c00-4007-5b6e-f152-fb40-8318-e8e0.ngrok-free.app/SmartChat/LoadHomeData?id=" +
        user.id
      );

      if (response.ok) {
        let json = await response.json();
        if (json.success) {
          let chatArray = json.jsonChatArray;
          setChatArray(chatArray);
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  const signOut = async () => {
    try {
      // Clear user data
      await AsyncStorage.removeItem("user");
      router.replace("/index");
      console.log("Navigating to /index");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  }

  if (!loaded && !error) {
    return null;
  }

  return (
    <LinearGradient colors={["#131C21", "#0B141A"]} style={styles.view1}>
      <StatusBar hidden={true} />

      <Text style={styles.Uppdertext}>
        Chats 💬
      </Text>

      <FlashList
        data={getchatArray}
        renderItem={({ item }) => (
          <Pressable
            style={styles.view5}
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View style={styles.leftContainer}>
              <View style={styles.avatarContainer}>
                {item.avatar_image_found ? (
                  <Image
                    source={
                      "https://65a2-2407-c00-4007-5b6e-f152-fb40-8318-e8e0.ngrok-free.app/SmartChat/AvatarImages/" +
                      item.other_user_mobile +
                      ".png"
                    }
                    contentFit="contain"
                    style={styles.image1}
                  />
                ) : (
                  <Text style={styles.text6}>{item.other_user_avatar_letters}</Text>
                )}
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.text1}>{item.other_user_name}</Text>
                <Text style={styles.text4}>{item.message}</Text>
              </View>
            </View>

            <View style={styles.rightContainer}>
              <Text style={styles.text5}>{item.datetime}</Text>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: item.other_user_status == 1 ? "green" : "gray" },
                ]}
              />
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
  view5: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  textContainer: {
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  text1: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
    color: "#D9D9D9",
  },
  text4: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#A1A1A1",
    marginTop: 5,
  },
  text5: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "#A1A1A1",
    marginTop: 5,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
  },
  image1: {
    width: 65,
    height: 65,
    backgroundColor: "white",
    borderRadius: 32.5,
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#ddd",
  },
  text6: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
    color: "#D9D9D9",
  },
  Uppdertext: {
    fontFamily: "Montserrat-Bold",
    fontSize: 40,
    color: "#32a856",
    textAlign: "left",
    marginTop: -30,
    paddingBottom: 20,
    paddingTop: 10,
    right: 20,
  },
});
