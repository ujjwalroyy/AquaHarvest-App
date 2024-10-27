import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PondHealth() {
  const [selectedPond, setSelectedPond] = useState('');
  const [pondData, setPondData] = useState([]);
  const [filteredPondData, setFilteredPondData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ponds, setPonds] = useState([]);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchPondReports = async () => {
      try {
        const response = await axios.get('https://fram-khatak.onrender.com/api/v1/pond-test/get-all');
        setPondData(response.data);
        if (response.data.length > 0) {
          setSelectedPond(response.data[0].pondId);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pond data:', error);
        setLoading(false);
      }
    };
    fetchPondReports();
  }, []);

  const fetchPonds = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await axios.get(
        "https://fram-khatak.onrender.com/api/v1/pond/getPonds",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPonds(response.data);
    } catch (error) {
      console.error('Error fetching ponds:', error);
      Alert.alert('Error', 'Failed to fetch pond data.');
    }
  };

  useEffect(() => {
    fetchPonds();
  }, []);

  useEffect(() => {
    if (selectedPond) {
      const filteredData = pondData.filter(report => report.pondId === selectedPond);
      setFilteredPondData(filteredData);
    }
  }, [selectedPond, pondData]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!filteredPondData || filteredPondData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available for the selected pond.</Text>
      </View>
    );
  }

  const ensureValidData = (dataArray) => {
    return dataArray.map(value => {
      const parsedValue = parseFloat(value);
      return isNaN(parsedValue) ? 0 : parsedValue;
    });
  };

  const timeData = filteredPondData.map(report => {
    const date = new Date(report.date);
    return isNaN(date) ? "No Test" : date.toLocaleDateString();
  });

  const phData = ensureValidData(filteredPondData.map(report => report.pH));
  const temperatureData = ensureValidData(filteredPondData.map(report => report.temperature));
  const DOData = ensureValidData(filteredPondData.map(report => report.DO));
  const TDSData = ensureValidData(filteredPondData.map(report => report.TDS));
  const avgLengthData = ensureValidData(filteredPondData.map(report => report.avgLength));
  const avgWeightData = ensureValidData(filteredPondData.map(report => report.avgWeight));

  const chartWidth = Math.max(screenWidth * 1.5, filteredPondData.length * 40);

  const getPondNameById = (pondId) => {
    const pond = ponds.find(pond => pond._id === pondId);
    return pond ? pond.name : pondId;
  };

  const uniquePondIds = [...new Set(pondData.map(pond => pond.pondId))];

  return (
    <View style={styles.container}>
      <View style={styles.selectPondContainer}>
        <Text style={styles.selectPondText}>Select Pond</Text>
        <Picker
          selectedValue={selectedPond}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedPond(itemValue)}
        >
          <Picker.Item label="Select a pond" value="" />
          {uniquePondIds.map(pondId => {
            const pondName = getPondNameById(pondId);
            return (
              <Picker.Item key={pondId} label={pondName} value={pondId} />
            );
          })}
        </Picker>
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ScrollView horizontal>
          <View>
            <Text style={styles.graphTitle}>pH Levels</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: phData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" pH"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {phData[index]}
                </Text>
              )}
            />

            <Text style={styles.graphTitle}>Temperature</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: temperatureData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" °C"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {temperatureData[index]}
                </Text>
              )}
            />

            <Text style={styles.graphTitle}>Dissolved Oxygen (DO)</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: DOData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" mg/L"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {DOData[index]}
                </Text>
              )}
            />

            <Text style={styles.graphTitle}>Total Dissolved Solids (TDS)</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: TDSData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" mg/L"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {TDSData[index]}
                </Text>
              )}
            />

            <Text style={styles.graphTitle}>Average Fish Length</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: avgLengthData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" cm"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {avgLengthData[index]}
                </Text>
              )}
            />

            <Text style={styles.graphTitle}>Average Fish Weight</Text>
            <LineChart
              data={{
                labels: timeData,
                datasets: [{ data: avgWeightData }],
              }}
              width={chartWidth}
              height={220}
              yAxisSuffix=" kg"
              chartConfig={chartConfig}
              style={styles.graph}
              renderDotContent={({ x, y, index }) => (
                <Text key={index} style={{ position: 'absolute', left: x, top: y - 20 }}>
                  {avgWeightData[index]}
                </Text>
              )}
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 128, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: '#ffa726',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  selectPondContainer: {
    marginBottom: 20,
  },
  selectPondText: {
   fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#fff', 
  },
  picker: {
    height: 50,
    width: '100%',
  },
  scrollView: {
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  graph: {
    marginVertical: 8,
    borderRadius: 16,
  },
});