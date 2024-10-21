import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";
import CloseIcon from "react-native-vector-icons/FontAwesome";

export default function HomeScreen(props) {
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

 
  const navigation = useNavigation();

  async function getData() {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token in getData home:", token);

      if (token) {
        const response = await axios.get(
          "http://192.168.43.60:5050/api/v1/user/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Response data home:", response.data);

        if (response.data.user) {
          if (JSON.stringify(userData) !== JSON.stringify(response.data.user)) {
            console.log("Setting user data:", response.data.user);
            setUserData(response.data.user);
          }
        } else {
          console.warn("User data not found in response");
        }
      } else {
        console.warn("Token not found");
        navigation.navigate("LoginNav", { screen: "Login" });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);

      if (error.response && error.response.status === 401) {
        console.warn("Unauthorized, redirecting to login");
        await AsyncStorage.removeItem("token");
        navigation.navigate("LoginNav", { screen: "Login" });
      }
    }
  }

  useEffect(() => {
    console.log("User Data Updated:", userData);
    getData();
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name || "");
      setProfilePic(userData.profilePic || { uri: userData.profilePic.url } || "");
    }
  }, [userData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const displayName = (userData?.name || userData?.email || "User").split(
        " "
      )[0];
      if (userData) {
        Toast.show({
          type: "success",
          text1: `Welcome ${displayName}`,
          text2: "Your farm, always with you.",
          visibilityTime: 5000,
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [userData]);

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

 

  const handleLogout = async (navigation) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        "http://192.168.43.60:5050/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        await AsyncStorage.setItem("isLoggedIn", "false");
        await AsyncStorage.setItem("token", "");

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

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderColorAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(borderColorAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const borderColorInterpolation = borderColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#FF0000", "#0000FF"], 
  });

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width, 
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#B3E5FC", "#E3F2FD"]} style={styles.container}>
        <StatusBar style="auto" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={toggleSidebar}>
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleProfile} style={styles.userInfo}>
              <Text style={styles.userName}>{name.split(" ")[0]}</Text>

              <Image
                source={profilePic ? { uri: profilePic.url } : null}
                style={styles.userImage}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Image
          source={require("../assets/poster/poster2.jpeg")} 
          style={styles.fishImage}
        />
        

        <View style={styles.dotsContainer}>
          <View style={styles.dot}></View>
          <View style={styles.dot}></View>
          <View style={styles.dot}></View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Pond")}
          >
            <Text style={styles.navButtonText}>POND MANAGEMENT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Market")}
          >
            <Text style={styles.navButtonText}>MARKET</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("PondHelth")}
          >
            <Text style={styles.navButtonText}>DASHBOARD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("Inventory")}
          >
            <Text style={styles.navButtonText}>INVENTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} 
          onPress={() => navigation.navigate("Gallary")} >
            <Text style={styles.navButtonText}>GALLERY</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      {isSidebarVisible && (
        <>
          <TouchableWithoutFeedback onPress={toggleSidebar}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleSidebar}
            >
              <Text>
                <CloseIcon name="close" size={24} color="#000" />
              </Text>
            </TouchableOpacity>
            <Animated.View
              style={[
                styles.sidebarUserImageContainer,
                { borderColor: borderColorInterpolation },
              ]}
            >
              <Image
                source={profilePic ? { uri: profilePic.url } : null} 
                style={styles.sidebarUserImage}
              />
            </Animated.View>
            <Text style={styles.sidebarUserName}>{name}</Text>

            <TouchableOpacity
              style={styles.sidebarButton}
              onPress={() => navigation.navigate("Profile")}
            >
              <Text style={styles.sidebarButtonText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarButton}
              onPress={() =>
                Alert.alert("Coming Soon", "This feature is under development.")
              } 
            >
              <Text style={styles.sidebarButtonText}>Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton}>
              <Text style={styles.sidebarButtonText}
              onPress={() => navigation.navigate("PondHelth")}
              >Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarButton} onPress={() => navigation.navigate("AboutUs")}>
              <Text style={styles.sidebarButtonText} >About Us</Text>
            </TouchableOpacity>
            <View style={styles.sidebarFooter}>
              <TouchableOpacity
                style={styles.aboutUsButton}
                onPress={() => handleLogout(navigation)}
              >
                <Text style={styles.sidebarButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </View>
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
    paddingVertical: 40, 
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
    color: "#37AFE1",
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdownContainer: {
    backgroundColor: "#E3F2FD",
    borderRadius: 15,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dropdownOption: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  dropdownOptionText: {
    color: "#1E88E5",
    fontSize: 18,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "80%",
    height: "100%",
    backgroundColor: "#ffffff",
    padding: 20,
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#000",
  },
  sidebarUserImageContainer: {
    borderWidth: 3,
    borderRadius: 35,
    padding: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
  sidebarUserImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#42A5F5",
  },
  sidebarUserName: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 10,
    fontWeight: "bold",
  },
  sidebarButton: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
  },
  sidebarButtonText: {
    fontSize: 18,
    color: "#37AFE1",
  },
  sidebarFooter: {
    flex: 1,
    justifyContent: "flex-end",
  },
  aboutUsButton: {
    paddingVertical: 15,
    backgroundColor: "#E3F2FD",
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 5,
  },
});
