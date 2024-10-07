import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

export default function index() {

  const [getMobile, setMobile] = useState("");
  const [getPassword, setPassword] = useState("");
  const [getName, setName] = useState("");

  const [loaded, error] = useFonts({
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-Light": require("../assets/fonts/Montserrat-Light.ttf"),
    "Montserrat-Regular": require("../assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(
    () => {
      async function checkUserInAsyncStorage() {
        try {
          let userJson = await AsyncStorage.getItem("user");
          if (userJson != null) {
            router.replace("/home");
          }
        } catch (e) {
          console.log(e);
        }
      }
      checkUserInAsyncStorage();
    },[]
);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const logoPath = require("../assets/images/logo.png");

  return (
    <LinearGradient colors={["white", "white"]} style={styleSheet.view1}>
      <StatusBar hidden={true} />
      <ScrollView>
        <View style={styleSheet.view2}>
          <Image
            source={logoPath}
            style={styleSheet.image1}
            contentFit={"contain"}
          />

          <Text style={styleSheet.text1}>Create Account</Text>

          <Text style={styleSheet.text2}>
            Hello! Welcome Smart Chat. Let's start the Conversation.
          </Text>

          <View style={styleSheet.avater1}>
            <Text style={styleSheet.text6}>{getName}</Text>
          </View>

          <Text style={styleSheet.text3}>Mobile</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode="tel"
            maxLength={10}
            onChangeText={(text) => {
              setMobile(text);
            }}
            onEndEditing={async () => {
              if (getMobile.length == 10) {
                let response = await fetch(
                  "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/GetLetters?mobile=" +
                    getMobile
                );

                if (response.ok) {
                  let json = await response.json();
                  setName(json.letters);
                }
              }
            }}
          />

          <Text style={styleSheet.text3}>Password</Text>
          <TextInput
            style={styleSheet.input1}
            secureTextEntry={true}
            inputMode="text"
            maxLength={20}
            onChangeText={(text) => {
              setPassword(text);
            }}
          />

          <Pressable
            style={styleSheet.pressable1}
            onPress={async () => {
              let response = await fetch(
                "https://352f-2407-c00-e006-10c5-9dbd-f4fa-1f44-ed8a.ngrok-free.app//SmartChat/SignIn", // Correct URL
                {
                  method: "POST", // Ensure it's POST
                  body: JSON.stringify({
                    mobile: getMobile,
                    password: getPassword,
                  }),
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                let json = await response.json();

                if (json.success) {
                  //user registration complete.
                  let user = json.user;
                  //Alert.alert("Success", "Hi " + user.first_name + ", " + json.message);

                  try {
                    //store user in async storage
                    //console.log(user);
                    await AsyncStorage.setItem("user", JSON.stringify(user));
                    router.replace("/home");
                  } catch (e) {
                    Alert.alert(
                      "Error",
                      "Unable to process yor request. Please try again later."
                    );
                  }
                } else {
                  //problem occured.
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <FontAwesome6 name="right-to-bracket" size={20} color="white" />
            <Text style={styleSheet.text4}>Sign In</Text>
          </Pressable>

          <Pressable
            style={styleSheet.pressable2}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            <Text style={styleSheet.text5}>New User? Create Account.</Text>
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styleSheet = StyleSheet.create({
  view1: {
    flex: 1,
    justifyContent: "center",
  },

  image1: {
    width: "100%",
    height: 50,
  },

  text1: {
    fontSize: 32,
    fontFamily: "Montserrat-Bold",
    color: "#25D366",
  },

  text2: {
    fontSize: 20,
    fontFamily: "Montserrat-Regular",
    // color: "#fff",
    color: "#25D366",
    marginBottom: 10,
  },

  text3: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#384B70",
  },

  input1: {
    width: "100%",
    height: 50,
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 15,
    paddingStart: 10,
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
  },

  text4: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "white",
  },

  pressable1: {
    height: 50,
    backgroundColor: "#384B70",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 10,
    flexDirection: "row",
    columnGap: 10,
  },

  pressable2: {
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },

  text5: {
    fontSize: 18,
    fontFamily: "Montserrat-Light",
  },

  avater1: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 2,
  },

  view2: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 40,
    rowGap: 15,
  },

  text6: {
    fontSize: 40,
    fontFamily: "Montserrat-Bold",
    color: "#384B70",
    alignSelf: "center",
  },
});
