import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function PondReport({ route, navigation }) {
  // const {waterQuality, date, pH, temperature, DO, TDS, turbidity, plankton, avgLength, avgWeight } = route.params;
  const {
    waterQuality = 'N/A',
    date = 'N/A',
    pH = 'N/A',
    temperature = 'N/A',
    DO = 'N/A',
    TDS = 'N/A',
    turbidity = 'N/A',
    plankton = 'N/A',
    avgLength = 'N/A',
    avgWeight = 'N/A'
  } = route.params || {};

  const handleDelete = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this report?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Pond Test Report</Text>

      <View style={styles.reportContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Report Details</Text>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Options",
              "Choose an action",
              [
                { text: "Delete", onPress: handleDelete },
                { text: "Cancel", style: "cancel" }
              ]
            );
          }}>
            <FontAwesome name="ellipsis-v" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.detail}>Water Quality: {waterQuality}</Text>
        <Text style={styles.detail}>Date: {date}</Text>
        <Text style={styles.detail}>pH: {pH}</Text>
        <Text style={styles.detail}>Temperature: {temperature}</Text>
        <Text style={styles.detail}>DO: {DO}</Text>
        <Text style={styles.detail}>TDS: {TDS}</Text>
        <Text style={styles.detail}>Turbidity: {turbidity}</Text>
        <Text style={styles.detail}>Plankton: {plankton}</Text>
        <Text style={styles.boldDetail}>Fish Growth</Text>
        <Text style={styles.detail}>Avg Length: {avgLength} cm</Text>
        <Text style={styles.detail}>Avg Weight: {avgWeight} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  backButton: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  reportContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 16,
    marginVertical: 5,
  },
  boldDetail: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});