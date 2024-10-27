import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native";
import axios from "axios";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function PondReport({ navigation, route }) {
  const { pondId } = route.params;

  const [pondReports, setPondReports] = useState([]);

  useEffect(() => {
    if (!pondId) {
      Alert.alert("Error", "Pond ID is missing");
      return;
    }

    const fetchPondTests = async () => {
      try {
        const response = await axios.get(
          `https://fram-khatak.onrender.com/api/v1/pond-tests/${pondId}`
        );
        if (response.data) {
          setPondReports(response.data);
        }
      } catch (error) {
        Alert.alert("Alert", "You don’t have any report till now!");
      }
    };

    fetchPondTests();
  }, [pondId]);

  const handleDelete = (reportId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              await axios.delete(
                `https://fram-khatak.onrender.com/api/v1/pond-test/${reportId}`
              );
              setPondReports(
                pondReports.filter((report) => report._id !== reportId)
              );
            } catch (error) {
              Alert.alert("Error", "Failed to delete the report");
            }
          },
        },
      ]
    );
  };

  const getStatus = (value, rangeLow, rangeHigh) => {
    if (value < rangeLow) return { text: "Low", color: "red" };
    if (value > rangeHigh) return { text: "High", color: "red" };
    return { text: "Good", color: "green" };
  };

  const getTDSStatus = (value) => {
    if (value <= 300) return { text: "Excellent", color: "green" };
    if (value > 300 && value <= 600) return { text: "Good", color: "orange" };
    return { text: "Bad", color: "red" };
  };

  const renderPondReport = ({ item }) => (
    <View style={styles.reportContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Report - {new Date(item.date).toLocaleString("en-GB")}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <FontAwesome name="trash" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
  
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sampling Section</Text>
        <Text style={styles.detail}>
          Water Quality: {item.waterQuality ?? "N/A"}
        </Text>
        <Text style={styles.detail}>Date: {new Date(item.date).toLocaleString("en-GB")}</Text>
  
        <Text style={styles.detail}>
          Temperature:{" "}
          <Text style={{ color: getStatus(item.temperature, 25, 35).color }}>
            {item.temperature ?? "N/A"} °C
          </Text>{" "}
          ({getStatus(item.temperature, 25, 35).text})
        </Text>
  
        <Text style={styles.detail}>
          pH:{" "}
          <Text style={{ color: getStatus(item.pH, 7.5, 8.5).color }}>
            {item.pH ?? "N/A"}
          </Text>{" "}
          ({getStatus(item.pH, 7.5, 8.5).text})
        </Text>
  
        <Text style={styles.detail}>
          DO:{" "}
          <Text style={{ color: getStatus(item.DO, 5, 8).color }}>
            {item.DO ?? "N/A"} mg/L
          </Text>{" "}
          ({getStatus(item.DO, 5, 8).text})
        </Text>
  
        <Text style={styles.detail}>
          Turbidity:{" "}
          <Text style={{ color: getStatus(item.turbidity, 80, 150).color }}>
            {item.turbidity ?? "N/A"} NTU
          </Text>{" "}
          ({getStatus(item.turbidity, 80, 150).text})
        </Text>
  
        <Text style={styles.detail}>
          TDS:{" "}
          <Text style={{ color: getTDSStatus(item.TDS).color }}>
            {item.TDS ?? "N/A"} ppm
          </Text>{" "}
          ({getTDSStatus(item.TDS).text})
        </Text>
      </View>
  
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing Section</Text>
        <Text style={styles.detail}>
          Avg Length: {item.avgLength ?? "N/A"} cm
        </Text>
        <Text style={styles.detail}>
          Avg Weight: {item.avgWeight ?? "N/A"} kg
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#007AFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Pond Test Reports</Text>

      <FlatList
        data={pondReports}
        keyExtractor={(item) => item._id}
        renderItem={renderPondReport}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  backButton: {
    height: 32,
    width: 48,
    backgroundColor: "#FFFECB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginTop: 14,
    paddingBottom: 1,
    paddingHorizontal: 2,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    backgroundColor: "#37AFE1",
    marginBottom: 16,
    marginTop: 16,
    textAlign: "center",
    paddingVertical: 12,
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#555",
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    color: "#666",
  },
});
