import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View, Text, Pressable } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { FontAwesome6 } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useEffect } from "react";
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
        "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/LoadHomeData?id=" +
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

      // Ensure that navigation happens only after AsyncStorage is cleared

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
    <LinearGradient colors={["white", "white"]} style={styleSheet.view1}>
      <StatusBar hidden={true} />

      {/* Sign Out Button */}
      {/* <Pressable onPress={signOut} style={styleSheet.signOutButton}>
        <Text style={styleSheet.signOutText}>Sign Out</Text>
      </Pressable> */}

      <FlashList
        data={getchatArray}
        renderItem={({ item }) => (
          <Pressable
            style={styleSheet.view5} // Wrap the entire chat item
            onPress={() => {
              router.push({
                pathname: "/chat",
                params: item,
              });
            }}
          >
            <View style={styleSheet.avatarContainer}>
              {item.avatar_image_found ? (
                <Image
                  source={
                    "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/AvatarImages/" +
                    item.other_user_mobile +
                    ".png"
                  }
                  contentFit="contain"
                  style={styleSheet.image1}
                />
              ) : (
                <Text style={styleSheet.text6}>{item.other_user_avatar_letters}</Text>
              )}
            </View>

            <View style={styleSheet.textContainer}>
              <View style={styleSheet.nameAndStatus}>
                <Text style={styleSheet.text1}>{item.other_user_name}</Text>
                {/* Online/Offline Status Dot */}
                <View
                  style={[
                    styleSheet.statusDot,
                    { backgroundColor: item.other_user_status == 1 ? "green" : "gray" },
                  ]}
                />
              </View>
              <Text style={styleSheet.text4}>{item.message}</Text>

              <View style={styleSheet.view7}>
                <Text style={styleSheet.text5}>{item.datetime}</Text>
                <FontAwesome6
                  name="check"
                  size={20}
                  color={item.other_user_status == 1 ? "green" : "gray"}
                />
              </View>
            </View>
          </Pressable>


        )}
        estimatedItemSize={200}
      />
    </LinearGradient>

    
  );

  
}

const styleSheet = StyleSheet.create({
  view1: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 25,
  },

  view2: {
    flexDirection: "row",
    columnGap: 20,
    alignItems: "center",
  },

  view3: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 40,
  },

  view4: {
    flex: 1,
  },

  text1: {
    fontFamily: "Montserrat-Bold",
    fontSize: 22,
  },

  text2: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
  },

  text3: {
    fontFamily: "Montserrat-Light",
    fontSize: 14,
    alignSelf: "flex-end",
  },

  view5: {
    flexDirection: "row",
    alignItems: "center",  
    paddingVertical: 10,   
    paddingHorizontal: 15, 
    borderBottomWidth: 1,  
    borderBottomColor: "#ddd",  
  },

  view6_1: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 4,
    borderColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },

  view6_2: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "white",
    borderStyle: "dotted",
    borderWidth: 4,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },

  text4: {
    fontFamily: "Montserrat-Regular",
    fontSize: 16,
    color: "#555",  
  },

  text5: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
  },

  scrollview1: {
    //marginTop: 30,
  },

  view7: {
    flexDirection: "row",
    columnGap: 10,
    alignSelf: "flex-end",
    alignItems: "center",
    marginTop: 5,  
  },

  text6: {
    fontFamily: "Montserrat-Bold",
    fontSize: 28,
  },

  image1: {
    width: 60,  
    height: 60,
    backgroundColor: "white",
    borderRadius: 30,  
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 3,
    borderColor: "#ddd",  
  },

  signOutButton: {
    backgroundColor: "#e74c3c", 
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 20,
  },
  signOutText: {
    color: "white",
    fontFamily: "Montserrat-Bold",
    fontSize: 16,
  },

  nameAndStatus: {
    flexDirection: "row",
    alignItems: "center",  
    marginBottom: 5,  
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 10,  
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  textContainer: {
    flex: 1,  
    justifyContent: "center",
  },

});
