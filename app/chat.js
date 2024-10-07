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

export default function chat() {

  //get parameters
  const item = useLocalSearchParams();

  // store chat array
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

  //fetch chat array from server
  useEffect(() => {
    async function fetchChatArray() {

      let userJson = await AsyncStorage.getItem("user");
      let user = JSON.parse(userJson);

      let response = await fetch(
        "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/LoadChat?logged_user_id="+user.id+"&other_user_id="+item.other_user_id
      );
      if (response.ok) {
        let chatArray = await response.json();
        //console.log(chatArray);
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
    <LinearGradient colors={["#83a4d4", "#b6fbff"]} style={styles.view1}>
      <StatusBar hidden={true} />

      <View style={styles.view2}>
        <View style={styles.view3}>
          {
             item.avatar_image_found == "true"
              ? <Image
                  style={styles.image1}
                  source={
                    "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/AvatarImages/" + item.other_user_mobile+".png"
                  }
                />
                : <Text style={styles.text1}>{item.other_user_avatar_letters}</Text>
          }
        </View>
        <View style={styles.view4}>
          <Text style={styles.text2}>{item.other_user_name}</Text>
          <Text style={styles.text3}>{item.other_user_id==1 ? "Online" : "Offline"}</Text>
        </View>
      </View>
  
      <View style={styles.center_view}>
        <FlashList
          data={getchatArray}
          renderItem={({ item }) => (
            <View style={item.side=="right"?styles.view5_1:styles.view5_2}>
              <Text style={styles.text3}>{item.message}</Text>
              <View style={styles.view6}>
                <Text style={styles.text4}>{item.datetime}</Text>
                {
                  item.side == "right" ? (
                    <FontAwesome6 name="check" size={18} color={item.status==1 ? "green" : "gray"}/>
                  ) : null
                }
              </View>
            </View>
          )}
          estimatedItemSize={200}
        />
      </View>

      <View style={styles.view7}>
        <TextInput style={styles.input1} value={getChatText} onChangeText={
          (text) =>{
            setChatText(text);
          }    
        }/>
        <Pressable style={styles.pressable1} onPress={
            async () => {

              if (getChatText.length == 0) {
                Alert.alert("Error", "Please enter a message");
              }else{

                let userJson = await AsyncStorage.getItem("user");
                let user = JSON.parse(userJson);

                let response = fetch("https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/SendChat?logged_user_id="+user.id+"&other_user_id="+item.other_user_id+"&message="+getChatText)
                if (response.ok) {
                  let json = response.json();

                  if (json.success) {
                    console.log("msg sent");
                    setChatText("");
                  }
                }
              }
            }
          }>
          <FontAwesome6 name="paper-plane" color="white" size={20} />
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view1: {
    flex: 1,
  },

  view2: {
    marginTop: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    columnGap: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  view3: {
    backgroundColor: "white",
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dotted",
    borderColor: "red",
    borderWidth: 4,
  },

  image1: {
    width: 75,
    height: 75,
    borderRadius: 50,
  },

  text1: {
    fontSize: 36,
    fontFamily: "Montserrat-Bold",
  },

  view4: {
    rowGap: 4,
  },

  text2: {
    fontSize: 20,
    fontFamily: "Montserrat-Bold",
  },

  text3: {
    fontSize: 16,
    fontFamily: "Montserrat-Regular",
  },

  view5_1: {
    backgroundColor: "white",
    borderRadius: 10,
    borderTopRightRadius: 0,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-end",
    rowGap: 5,
    width: "auto",
    maxWidth: "80%",
  },

  view5_2: {
    backgroundColor: "white",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignSelf: "flex-start",
    rowGap: 5,
    width: "auto",
  },

  view6: {
    flexDirection: "row",
    columnGap: 10,
  },

  text4: {
    fontSize: 14,
    fontFamily: "Montserrat-Regular",
  },

  view7: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
    paddingHorizontal: 20,
    margin: 10,
    alignSelf: "flex-end",
  },

  input1: {
    height: 40,
    borderRadius: 10,
    borderStyle: "solid",
    borderWidth: 2,
    fontFamily: "Montserrat-Regular",
    fontSize: 18,
    flex: 1,
    paddingStart: 10,
  },

  pressable1: {
    backgroundColor: "blue",
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  center_view: {
    flex: 1,
    justifyContent: "flex-start",
    marginVertical: 20,
  },
});
