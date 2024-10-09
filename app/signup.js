import { StatusBar } from "expo-status-bar";
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
import { useEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function SignUp() {

  const [getImage, setImage] = useState(null);
  const [getMobile, setMobile] = useState("");
  const [getFirstName, setFirstName] = useState("");
  const [getLastName, setLastName] = useState("");
  const [getPassword, setPassword] = useState("");

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

  if (!loaded && !error) {
    return null;
  }

  //Logo
  const logoPath = require("../assets/images/logo.png");

  return (
    <LinearGradient colors={["#111", "#222"]} style={styleSheet.view1}>
      <ScrollView>
        <View style={styleSheet.view2}>
          <Image
            source={logoPath}
            style={styleSheet.image1}
            contentFit={"contain"}
          />

          <Text style={styleSheet.text1}>Create Account</Text>

          <Text style={styleSheet.text2}>
            Welcome to Discuzz. Let’s get started!
          </Text>

          <Pressable
            onPress={async () => {
              let result = await ImagePicker.launchImageLibraryAsync({});
              if (!result.canceled) {
                setImage(result.assets[0].uri);
              }
            }}
            style={styleSheet.avatar1}
          >
            <Image
              source={getImage}
              style={styleSheet.avatar1}
              contentFit={"contain"}
            />
          </Pressable>

          <Text style={styleSheet.text3}>Mobile</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode="tel"
            maxLength={10}
            placeholder="Enter mobile number"
            placeholderTextColor="#aaa"
            onChangeText={(text) => setMobile(text)}
          />

          <Text style={styleSheet.text3}>First Name</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode="text"
            placeholder="Enter first name"
            placeholderTextColor="#aaa"
            onChangeText={(text) => setFirstName(text)}
          />

          <Text style={styleSheet.text3}>Last Name</Text>
          <TextInput
            style={styleSheet.input1}
            inputMode="text"
            placeholder="Enter last name"
            placeholderTextColor="#aaa"
            onChangeText={(text) => setLastName(text)}
          />

          <Text style={styleSheet.text3}>Password</Text>
          <TextInput
            style={styleSheet.input1}
            secureTextEntry={true}
            inputMode="text"
            maxLength={20}
            placeholder="Enter password"
            placeholderTextColor="#aaa"
            onChangeText={(text) => setPassword(text)}
          />

          <Pressable
            style={styleSheet.pressable1}
            onPress={async () => {
              let formData = new FormData();
              formData.append("mobile", getMobile);
              formData.append("firstName", getFirstName);
              formData.append("lastName", getLastName);
              formData.append("password", getPassword);

              if (getImage != null) {
                formData.append("avatarImage", {
                  name: "avatar.png",
                  type: "image/png",
                  uri: getImage,
                });
              }

              let response = await fetch(
                "https://5c47-2407-c00-4007-5b6e-f152-fb40-8318-e8e0.ngrok-free.app/SmartChat/SignUp",
                {
                  method: "POST",
                  body: formData,
                }
              );

              if (response.ok) {
                let json = await response.json();
                if (json.success) {
                  router.replace("/");
                } else {
                  Alert.alert("Error", json.message);
                }
              }
            }}
          >
            <FontAwesome6 name="right-to-bracket" size={20} color="white" />
            <Text style={styleSheet.text4}>Sign Up</Text>
          </Pressable>

          <Pressable
            style={styleSheet.pressable2}
            onPress={() => {
              router.replace("/");
            }}
          >
            <Text style={styleSheet.text5}>
              Already have an account? Sign In
            </Text>
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
    height: 250,
    marginTop:-25,
    borderRadius: 30, 
    marginVertical: 10, 
    alignSelf: "center", 
    overflow:"hidden",
  },
  text1: {
    fontSize: 32,
    fontFamily: "Montserrat-Bold",
    color: "#25D366",
    textAlign: "center",
    marginTop: -50,
  },

  text2: {
    fontSize: 18,
    fontFamily: "Montserrat-Regular",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },

  text3: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#25D366",
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
    borderColor: "#25D366",
    color: "#fff",
    marginBottom: 15,
  },
  text4: {
    fontSize: 16,
    fontFamily: "Montserrat-Bold",
    color: "#fff",
  },
  pressable1: {
    height: 50,
    backgroundColor: "#25D366",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    columnGap: 10,
  },
  pressable2: {
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text5: {
    fontSize: 18,
    fontFamily: "Montserrat-Light",
    color: "#fff",
  },
  avatar1: {
    width: 100,
    height: 100,
    backgroundColor: "#2b2b2b",
    borderRadius: 50,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  view2: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 40,
  },
});
