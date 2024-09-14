import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function PondReport({ navigation, route }) {
  const { pondId } = route.params; 

  const [pondReports, setPondReports] = useState([]);

  useEffect(() => {
    if (!pondId) {
      Alert.alert('Error', 'Pond ID is missing');
      return;
    }
  
    const fetchPondTests = async () => {
      try {
        const response = await axios.get(`http://192.168.43.60:5050/api/v1/pond-tests/${pondId}`);
        if (response.data) {
          setPondReports(response.data); // Set all pond reports
        }
      } catch (error) {
        Alert.alert('Alter', 'You dont have any report till now!');
      }
    };
  
    fetchPondTests();
  }, [pondId]);

  const handleDelete = (reportId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.43.60:5050/api/v1/pond-test/${reportId}`);
              setPondReports(pondReports.filter(report => report._id !== reportId));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete the report');
            }
          },
        },
      ]
    );
  };

  const getStatus = (value, rangeLow, rangeHigh) => {
    if (value < rangeLow) return { text: 'Low', color: 'red' };
    if (value > rangeHigh) return { text: 'High', color: 'red' };
    return { text: 'Good', color: 'green' };
  };

  const getTDSStatus = (value) => {
    if (value <= 300) return { text: 'Excellent', color: 'green' };
    if (value > 300 && value <= 600) return { text: 'Good', color: 'orange' };
    return { text: 'Bad', color: 'red' };
  };

  const renderPondReport = ({ item }) => (
    <View style={styles.reportContainer}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Report for {item.date}</Text>
        <TouchableOpacity onPress={() => handleDelete(item._id)}>
          <FontAwesome name="trash" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Sampling Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sampling Section</Text>
        <Text style={styles.detail}>Water Quality: {item.waterQuality ?? 'N/A'}</Text>
        <Text style={styles.detail}>Date: {item.date ?? 'N/A'}</Text>
        <Text style={[styles.detail, { color: getStatus(item.temperature, 25, 35).color }]}>
          Temperature: {item.temperature ?? 'N/A'} °C ({getStatus(item.temperature, 25, 35).text})
        </Text>
        <Text style={[styles.detail, { color: getStatus(item.pH, 7.5, 8.5).color }]}>
          pH: {item.pH ?? 'N/A'} ({getStatus(item.pH, 7.5, 8.5).text})
        </Text>
        <Text style={[styles.detail, { color: getStatus(item.DO, 5, 8).color }]}>
          DO: {item.DO ?? 'N/A'} mg/L ({getStatus(item.DO, 5, 8).text})
        </Text>
        <Text style={[styles.detail, { color: getStatus(item.turbidity, 80, 150).color }]}>
          Turbidity: {item.turbidity ?? 'N/A'} NTU ({getStatus(item.turbidity, 80, 150).text})
        </Text>
        <Text style={[styles.detail, { color: getTDSStatus(item.TDS).color }]}>
          TDS: {item.TDS ?? 'N/A'} ppm ({getTDSStatus(item.TDS).text})
        </Text>
      </View>

      {/* Testing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing Section</Text>
        <Text style={styles.detail}>Avg Length: {item.avgLength ?? 'N/A'} cm</Text>
        <Text style={styles.detail}>Avg Weight: {item.avgWeight ?? 'N/A'} kg</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Pond Test Reports</Text>

      <FlatList
        data={pondReports}
        keyExtractor={(item) => item._id}
        renderItem={renderPondReport}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reportContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
  },
});
