import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Categories = ({ onSelectCategory }) => {
  const [categoriesData, setCategoriesData] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No token found. Please log in again.");
          return;
        }

        const response = await axios.get(
          "http://192.168.43.60:5050/api/v1/category/get-all",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCategoriesData(response.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        Alert.alert("Error", "Failed to fetch categories.");
      }
    };

    loadCategories();
  }, []);

  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {categoriesData.map((item) => (
          <View key={item._id}>
            <TouchableOpacity
              style={styles.catContainer}
              onPress={() => {
                console.log("Selected category:", item.name);
                onSelectCategory(item.name);
              }}
            >
              <Text style={styles.catTitle}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#B6E6FC",
    padding: 5,
    flexDirection: "row",
    height: 65,
  },
  catContainer: {
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  catIcon: {
    fontSize: 30,
    verticalAlign: "top",
  },
  catTitle: {
    fontSize: 20,
    textTransform: "uppercase",
  },
});
