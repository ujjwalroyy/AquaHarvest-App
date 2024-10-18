import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Footer = () => {
  const route = useRoute();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => navigation.navigate("Market")}
      >
        <AntDesign
          style={[styles.icon, route.name === "Market" && styles.active]}
          name="home"
        />
        <Text style={[styles.iconText, route.name === "Market" && styles.active]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuContainer}
        onPress={() => navigation.navigate("Notifications")}
      >
        <AntDesign
          style={[styles.icon, route.name === "Notifications" && styles.active]}
          name="bells"
        />
        <Text
          style={[styles.iconText, route.name === "Notifications" && styles.active]}
        >
          Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuContainer}>
        <AntDesign style={[styles.icon, styles.active]} name="shoppingcart" />
        <Text style={[styles.iconText, styles.active]}>Cart</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#B6E6FC",
    borderTopWidth: 1, 
    borderColor: "#e0e0e0",
    position: "absolute", 
    bottom: 0,
    left: 0,
    right: 0,
  },
  menuContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 25,
    color: "#000000",
  },
  iconText: {
    color: "#000000",
    fontSize: 10,
  },
  active: {
    color: "blue",
  },
});

export default Footer;
