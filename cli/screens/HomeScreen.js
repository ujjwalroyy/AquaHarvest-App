import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function HomeScreen(props) {
  const navigation = useNavigation();
  // console.log('props ',props);
  // useEffect(async () =>{
  //   const token = await AsyncStorage.getItem('token')
  //   console.log('Token... ',token);

  // })
  const [userData, setUserData] = useState("");

  async function getData() {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("token home", token);

      if (token) {
        const response = await axios.post(
          "http://192.168.43.60:5050/api/v1/user/profile",
          { token }
        );
        setUserData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handleBackPress = () => {
    Alert.alert("Exit App", "Are you sure you want to exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Exit",
        onPress: () => BackHandler.exitApp(),
      },
    ]);
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", handleBackPress);
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    }, [])
  );

  useEffect(() => {
    getData();

    const timer = setTimeout(() => {
      Toast.show({
        type: "success",
        text1: "Welcome",
        text2: "Hii Buddy",
        visibilityTime: 5000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  });

  // function handleLogout() {
  //   AsyncStorage.setItem('isLoggedIn', '')
  //   AsyncStorage.setItem('token', '')
  //   navigation.navigate('LoginNav', { screen: 'Welcome' });

  // try {

  //   const token = await AsyncStorage.getItem('token')
  //   console.log('Logout clicked', token);
  //   if(token){
  //     console.log('Logout clicked with token:', token);
  //     await AsyncStorage.removeItem('token')
  //     console.log('Token removed from AsyncStorage');

  //     await axios.post('http://192.168.43.60:5050/api/v1/user/logout', {token});
  //     console.log('Logout request sent');
  //     navigation.navigate('Login');
  //   }

  // } catch (error) {
  //   console.log('Error logging out:', error);
  //   Alert.alert('Logout Failed', 'There was a problem logging out. Please try again.');
  // }
  // };

  const handleLogout = async (navigation) => {
    try {
      // Make a request to the logout endpoint
      const response = await axios.post(
        "http://192.168.43.60:5050/api/v1/user/logout"
      );

      if (response.data.success) {
        AsyncStorage.setItem("isLoggedIn", "false");
        AsyncStorage.setItem("token", "");

        navigation.reset({
          index: 0,
          routes: [{ name: "LoginNav" }],
        });
      } else {
        console.error("Logout failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <LinearGradient colors={["#B3E5FC", "#E3F2FD"]} style={styles.container}>
      <StatusBar style="auto" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          {/* Menu icon */}
          <View style={styles.menuLine}></View>
          <View style={styles.menuLine}></View>
          <View style={styles.menuLine}></View>
        </TouchableOpacity>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>User Name</Text>
          <Image
            source={{ uri: "https://example.com/user-profile.jpg" }}
            style={styles.userImage}
          />
        </View>
      </View>

      {/* Fish Image Carousel */}
      <Image
        source={require("../assets/images/welcome.png")} // Replace with your fish image URL or require local asset
        style={styles.fishImage}
      />

      {/* Navigation Dots */}
      <View style={styles.dotsContainer}>
        <View style={styles.dot}></View>
        <View style={styles.dot}></View>
        <View style={styles.dot}></View>
      </View>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => handleLogout(navigation)}
      >
        <Text style={styles.navButtonText}>LOGOUT</Text>
      </TouchableOpacity>

      {/* Navigation Buttons */}
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>POND</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>MARKET</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>INVENTORY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton}>
        <Text style={styles.navButtonText}>GALLERY</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  menuLine: {
    width: 30,
    height: 3,
    backgroundColor: "#1E88E5",
    marginVertical: 2,
    borderRadius: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#bbdefb",
    padding: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  userName: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#42A5F5",
  },
  fishImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 15,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 5,
    backgroundColor: "#42A5F5",
    borderRadius: 4,
    marginHorizontal: 3,
  },
  navButton: {
    width: "100%",
    backgroundColor: "#E3F2FD",
    paddingVertical: 40, // Increased from 20 to 40
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  navButtonText: {
    color: "#1E88E5",
    fontSize: 20,
    fontWeight: "bold",
  },
});
