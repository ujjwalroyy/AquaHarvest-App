import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

const themeColors = {
  bg: "#B6E6FC",
};

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: themeColors.bg }]}>
      {/* <View style={styles.bubbleContainer}>
        <View style={[styles.bubble, styles.smallBubble, styles.droplet1]} />
        <View style={[styles.bubble, styles.smallBubble, styles.droplet2]} />
        <View style={[styles.bubble, styles.smallBubble, styles.droplet3]} />
        <View style={[styles.bubble, styles.smallBubble, styles.droplet4]} />
        <View style={[styles.bubble, styles.smallBubble, styles.droplet5]} />
      </View> */}

      <View style={tw`flex-1 justify-around my-4`}>
        <Text style={tw`text-gray font-bold text-4xl text-center`}>
          WELCOME
        </Text>
        <View style={tw`flex-row justify-center`}>
          <Image
            source={require("../assets/images/welcome3.png")}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <View style={tw`space-y-4`}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={tw`py-3 bg-[#37AFE1] mx-7 rounded-xl`}
          >
            <Text style={tw`text-xl font-bold text-center text-white`}>
              Login
            </Text>
          </TouchableOpacity>
          <View style={tw`flex-row justify-center`}>
            <Text style={tw`text-gray font-semibold`}>Create an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={tw`font-semibold text-red-400`}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   bubbleContainer: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//   },
//   bubble: {
//     position: "absolute",
//     backgroundColor: "rgba(48, 214, 249, 0.8)",
//     borderRadius: 50,
//     opacity: 0.7,
//   },
//   smallBubble: {
//     opacity: 0.5,
//   },
//   bubble1: {
//     width: 100,
//     height: 100,
//     top: "15%",
//     left: "5%",
//     // animation: "bubbleMove 10s infinite",
//   },
//   bubble2: {
//     width: 120,
//     height: 120,
//     top: "40%",
//     right: "15%",
//     // animation: "bubbleMove 12s infinite",
//   },
//   droplet1: {
//     width: 20,
//     height: 20,
//     bottom: "10%",
//     left: "5%",
//     animation: "dropletMove 3s infinite",
//   },
//   droplet2: {
//     width: 15,
//     height: 15,
//     bottom: "20%",
//     right: "10%",
//     animation: "dropletMove 4s infinite",
//   },
//   droplet3: {
//     width: 25,
//     height: 25,
//     top: "45%",
//     right: "30%",
//     animation: "dropletMove 5s infinite",
//   },
//   droplet4: {
//     width: 10,
//     height: 10,
//     top: "60%",
//     left: "15%",
//     animation: "dropletMove 6s infinite",
//   },
//   droplet5: {
//     width: 30,
//     height: 30,
//     bottom: "5%",
//     left: "30%",
//     animation: "dropletMove 5s infinite",
//   },
//   "@keyframes bubbleMove": {
//     "0%": {
//       transform: [{ translateY: 0 }, { scale: 1 }],
//     },
//     "100%": {
//       transform: [{ translateY: -400 }, { scale: 1.2 }],
//     },
//   },
//   "@keyframes dropletMove": {
//     "0%": {
//       transform: [{ translateY: 0 }, { scale: 0.9 }],
//     },
//     "100%": {
//       transform: [{ translateY: -150 }, { scale: 1.1 }],
//     },
//   },
// });

export default WelcomeScreen;
