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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function HomeScreen(props) {
  const navigation = useNavigation();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const slideAnim = useRef(
    new Animated.Value(-Dimensions.get("window").width)
  ).current;
  const borderColorAnim = useRef(new Animated.Value(0)).current;

  // console.log('props ',props);
  // useEffect(async () =>{
  //   const token = await AsyncStorage.getItem('token')
  //   console.log('Token... ',token);

  // })

  

  async function getData() {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("Token in getData:", token);
  
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
        }else {
          console.warn("User data not found in response");
        }
      } else {
        console.warn("Token not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  useEffect(() => {
    console.log("User Data Updated:", userData);
    getData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const displayName = (userData?.name || userData?.email || 'User').split(' ')[0];
      if(userData){
      Toast.show({
        type: "success",
        text1: `Welcome ${displayName}`,
        text2: "Hii Buddy",
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
      const token = AsyncStorage.getItem('token');
      console.log("My Token ", token);
      

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
    outputRange: ["#FF0000", "#0000FF"], // Transition from red to blue
  });

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.timing(slideAnim, {
        toValue: -Dimensions.get("window").width, // Slide off-screen
        duration: 300,
        useNativeDriver: false,
      }).start(() => setSidebarVisible(false));
    } else {
      setSidebarVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0, // Slide on-screen
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleProfile = () => {
    navigation.navigate("Profile")
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={["#B3E5FC", "#E3F2FD"]} style={styles.container}>
        <StatusBar style="auto" />

        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon} onPress={toggleSidebar}>
            {/* Menu icon */}
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
            <View style={styles.menuLine}></View>
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <TouchableOpacity onPress={handleProfile} style={styles.userInfo}>
            <Text style={styles.userName} >User Name</Text>
            <Image
              source={require("../assets/images/user.png")}
              style={styles.userImage}
            />
            </TouchableOpacity>
            
          </View>
        </View>

        {/* Fish Image Carousel */}
        <Image
          source={require("../assets/images/cover.jpg")} // Replace with your fish image URL or require local asset
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

        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          {/* Farm Inventory Button with Dropdown */}
          <TouchableOpacity style={styles.navButton} onPress={toggleDropdown}>
            <Text style={styles.navButtonText}>FARM INVENTORY</Text>
          </TouchableOpacity>
          {isDropdownVisible && (
            <View style={styles.dropdownContainer}>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => navigation.navigate("FarmInventory")}
              >
                <Text style={styles.dropdownOptionText}>Farm Inventory</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownOption}
                onPress={() => navigation.navigate("Pond")}
              >
                <Text style={styles.dropdownOptionText}>Pond</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Other Navigation Buttons */}
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>MARKET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>INVENTORY</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Text style={styles.navButtonText}>GALLERY</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
      {isSidebarVisible && (
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Animated.View
            style={[
              styles.sidebarUserImageContainer,
              { borderColor: borderColorInterpolation },
            ]}
          >
            <Image
              source={require("../assets/images/user.png")} // Local user image in the sidebar
              style={styles.sidebarUserImage}
            />
          </Animated.View>
          <Text style={styles.sidebarUserName}>VANSH KUSHWAHA</Text>

          <TouchableOpacity
            style={styles.sidebarButton}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.sidebarButtonText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarButtonText}>Premium</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarButtonText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.sidebarButton}>
            <Text style={styles.sidebarButtonText}>About Us</Text>
          </TouchableOpacity>
          <View style={styles.sidebarFooter}>
            <TouchableOpacity style={styles.aboutUsButton}>
              <Text style={styles.sidebarButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
