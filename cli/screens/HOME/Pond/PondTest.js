import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PondTest({ navigation }) {
  const [waterQuality, setWaterQuality] = useState('Fresh');
  const [date, setDate] = useState(new Date());
  const [pH, setPH] = useState('');
  const [temperature, setTemperature] = useState('');
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [DO, setDO] = useState('');
  const [TDS, setTDS] = useState('');
  const [turbidity, setTurbidity] = useState('');
  const [plankton, setPlankton] = useState(''); 
  const [avgLength, setAvgLength] = useState('');
  const [avgWeight, setAvgWeight] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!pH || !temperature || !DO || !TDS || !turbidity || !plankton || !avgLength || !avgWeight) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }
  
    setLoading(true);
  
    setTimeout(() => {
      setLoading(false);
  
      navigation.navigate('PondReport', {
        waterQuality,
        date: date.toLocaleDateString(),
        pH,
        temperature: `${temperature} ${temperatureUnit}`,  
        DO,
        TDS,
        turbidity,
        plankton,
        avgLength,
        avgWeight,
      });
    }, 4000); 
  };
  

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>Conduct a Test</Text>

        <Text style={styles.label}>Water Quality</Text>
        <TextInput
          style={styles.textInput}
          value={waterQuality}
          onChangeText={setWaterQuality}
        />

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
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

        <Text style={styles.label}>Temperature</Text>
        <TextInput
          style={styles.textInput}
          value={temperature}
          onChangeText={setTemperature}
          keyboardType="numeric"
        />
        <View style={styles.tempUnitContainer}>
          <TouchableOpacity
            style={temperatureUnit === 'Celsius' ? styles.activeUnit : styles.unit}
            onPress={() => setTemperatureUnit('Celsius')}
          >
            <Text>Celsius</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={temperatureUnit === 'Fahrenheit' ? styles.activeUnit : styles.unit}
            onPress={() => setTemperatureUnit('Fahrenheit')}
          >
            <Text>Fahrenheit</Text>
          </TouchableOpacity>
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

        <Text style={styles.label}>Fish Growth</Text>
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

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Generate Report</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
    marginVertical: 5,
  },
  tempUnitContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  unit: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  activeUnit: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E88E5',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    color: '#fff',
  },
  dateButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 5,
  },
  dateText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#1E88E5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
});