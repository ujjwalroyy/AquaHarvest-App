import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const Header = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
    setSearchText(""); 
  };

  return (
    <View style={{ height: 90, backgroundColor: "#B6E6FC" }}>
      <View style={styles.container}>
        <TextInput
          style={styles.inputBox}
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
          placeholder="Search..."
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <FontAwesome name="search" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
  
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 15,
      marginTop: 40,
      backgroundColor: '#B6E6FC'
    },
    inputBox: {
      borderWidth: 0.3,
      width: "100%",
      position: "absolute",
      left: 15,
      height: 40,
      color: "#000000",
      backgroundColor: "#ffffff",
      paddingLeft: 10,
      fontSize: 16,
      borderRadius: 5,
    },
    searchBtn: {
      position: "absolute",
      left: "95%",
    },
    icon: {
      color: "#B6E6FC",
      fontSize: 18,
    },
  });
  
  export default Header;