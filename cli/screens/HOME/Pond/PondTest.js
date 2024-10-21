import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from 'axios';
import { Ionicons } from "@expo/vector-icons";

export default function PondTest({ navigation, route }) {
  const { pondId } = route.params;
  const [waterQuality, setWaterQuality] = useState("Fresh");
  const [date, setDate] = useState(new Date());
  const [pH, setPH] = useState("");
  const [temperature, setTemperature] = useState("");
  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [DO, setDO] = useState("");
  const [TDS, setTDS] = useState("");
  const [turbidity, setTurbidity] = useState("");
  const [plankton, setPlankton] = useState("");
  const [avgLength, setAvgLength] = useState("");
  const [avgWeight, setAvgWeight] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperatureInCelsius, setTemperatureInCelsius] = useState('');

  const handleSubmitTesting = async () => {
    if (!pH || !temperature || !DO || !TDS || !turbidity || !plankton) {
      Alert.alert("Validation Error", "Please fill in all required fields in the Sampling section.");
      return;
    }

    setLoading(true);

    const testData = {
      pondId,
      waterQuality,
      date: date.toISOString(),
      pH,
      temperature: `${temperature} ${temperatureUnit}`,
      DO,
      TDS,
      turbidity,
      plankton,
      avgLength,
      avgWeight,
    };

    try {
      const response = await axios.post('http://192.168.43.60:5050/api/v1/pond-test', testData);
      setLoading(false);
      Alert.alert('Success', 'Sampling data saved successfully');
      navigation.navigate("PondReport", response.data.newPondTest);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to save sampling data');
    }
  };

  const handleTemperatureChange = (value) => {
    setTemperature(value);
    let temp = parseFloat(value);
    if (isNaN(temp)) return;

    if (temperatureUnit === 'Fahrenheit') {
      const celsiusValue = ((temp - 32) * 5) / 9;
      setTemperatureInCelsius(celsiusValue.toFixed(2));
    } else {
      setTemperatureInCelsius(temp.toFixed(2));
    }
  };

  const handleUnitChange = (unit) => {
    setTemperatureUnit(unit);

    let temp = parseFloat(temperature);
    if (isNaN(temp)) return;

    if (unit === 'Celsius') {
      const celsiusValue = ((temp - 32) * 5) / 9;
      setTemperatureInCelsius(celsiusValue.toFixed(2));
    } else if (unit === 'Fahrenheit') {
      const fahrenheitValue = (temp * 9) / 5 + 32;
      setTemperatureInCelsius(temp.toFixed(2));
      setTemperature(fahrenheitValue.toFixed(2));
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    
    <View style={styles.container}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backArrow}>
      <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Conduct a Test</Text>

        <Text style={styles.sectionTitle}>Sampling</Text>

        <Text style={styles.label}>Water Quality</Text>
        <TextInput
          style={styles.textInput}
          value={waterQuality}
          onChangeText={setWaterQuality}
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>Date: {date.toLocaleDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>pH (up to 2 decimals)</Text>
        <TextInput
          style={styles.textInput}
          value={pH}
          onChangeText={setPH}
          keyboardType="numeric"
        />

        <View style={styles.container}>
          <Text style={styles.label}>Temperature</Text>
          <TextInput
            style={styles.textInput}
            value={temperature}
            onChangeText={handleTemperatureChange}
            keyboardType="numeric"
          />

          <View style={styles.tempUnitContainer}>
            <TouchableOpacity
              style={
                temperatureUnit === "Celsius" ? styles.activeUnit : styles.unit
              }
              onPress={() => handleUnitChange("Celsius")}
            >
              <Text>Celsius</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                temperatureUnit === "Fahrenheit"
                  ? styles.activeUnit
                  : styles.unit
              }
              onPress={() => handleUnitChange("Fahrenheit")}
            >
              <Text>Fahrenheit</Text>
            </TouchableOpacity>
          </View>

          {temperatureUnit === "Fahrenheit" && (
            <Text style={styles.convertedText}>
              Converted to Celsius: {temperatureInCelsius} °C
            </Text>
          )}
        </View>

        <Text style={styles.label}>DO</Text>
        <TextInput
          style={styles.textInput}
          value={DO}
          onChangeText={setDO}
          keyboardType="numeric"
        />

        <Text style={styles.label}>TDS</Text>
        <TextInput
          style={styles.textInput}
          value={TDS}
          onChangeText={setTDS}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Turbidity</Text>
        <TextInput
          style={styles.textInput}
          value={turbidity}
          onChangeText={setTurbidity}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Plankton</Text>
        <TextInput
          style={styles.textInput}
          value={plankton}
          onChangeText={setPlankton}
          keyboardType="numeric"
        />

        {/* Testing Section */}
        <Text style={styles.sectionTitle}>Sampling</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Avg Length (cm)"
          value={avgLength}
          onChangeText={setAvgLength}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.textInput}
          placeholder="Avg Weight"
          value={avgWeight}
          onChangeText={setAvgWeight}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTesting}>
          <Text style={styles.submitButtonText}>Generate Testing Report</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#37AFE1',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
    paddingVertical: 12,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  backArrow:{
    height:32,
    width:48,
    backgroundColor: '#FFFECB',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    marginTop: 14,
    paddingBottom: 1,
    paddingHorizontal: 2,
    borderRadius: 3,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 3,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  dateButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 4,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
  },
  tempUnitContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  unit: {
    flex: 1,
    padding: 10,
    backgroundColor: "#37AFE1",
    borderRadius: 4,
    marginHorizontal: 5,
    alignItems: "center",
  },
  activeUnit: {
    flex: 1,
    padding: 10,
    backgroundColor: "#37AFE1",
    borderRadius: 4,
    marginHorizontal: 5,
    alignItems: "center",
  },
  convertedText: {
    fontSize: 16,
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: "#37AFE1",
    padding: 15,
    borderRadius: 4,
    marginVertical: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});
