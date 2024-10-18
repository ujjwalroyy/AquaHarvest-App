import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Pond({ navigation }) {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [pondId, setPondId] = useState(null); 
  const [name, setName] = useState('');
  const [pondArea, setPondArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('Square');
  const [pondDepth, setPondDepth] = useState('');
  const [depthUnit, setDepthUnit] = useState('Feet');
  const [cultureSystem, setCultureSystem] = useState('');
  const [species, setSpecies] = useState('');
  const [newSpecies, setNewSpecies] = useState('');
  const [stockingDensity, setStockingDensity] = useState('');
  const [feedType, setFeedType] = useState('');
  const [lastTestDate, setLastTestDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [timers, setTimers] = useState({});
    const [isRunning, setIsRunning] = useState(false);


  useEffect(() => {
    fetchPonds();
  }, []);

  useEffect(() => {
    setSpeciesRangeMessage(getSpeciesRangeMessage(species));
  }, [species]);

  useEffect(() => {
    setSpeciesRangeMessage(getSpeciesRangeMessage(species));
  }, []);



  const fetchPonds = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await axios.get(
        "http://192.168.43.60:5050/api/v1/pond/getPonds",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPonds(response.data);
      checkTimers();
    } catch (error) {
      console.error('Error fetching ponds:', error);
      Alert.alert('Error', 'Failed to fetch pond data.');
    }
  };

  const checkTimers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }

      const response = await axios.get(
        "http://192.168.43.60:5050/api/v1/pond/checkTimers",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Assuming the response data is an object where pond IDs map to timer values
      setTimers(response.data);
    } catch (error) {
      console.error('Error checking timers:', error);
      Alert.alert('Error', 'Failed to check timers.');
    }
  };

  
  

  useEffect(() => {
    ponds.forEach((pond) => {
      if (pond.lastTestDate) {
        const lastTestTime = new Date(pond.lastTestDate).getTime();
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastTestTime;

        // Calculate remaining time
        const remainingTime = 864000000 - elapsedTime; // 10 days in milliseconds
        if (remainingTime > 0) {
          setTimers((prevTimers) => ({
            ...prevTimers,
            [pond._id]: remainingTime,
          }));
          setIsRunning(true);
        }
      }
    });
  }, [ponds]);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTimers((prevTimers) => {
          const updatedTimers = { ...prevTimers };
          Object.keys(updatedTimers).forEach((pondId) => {
            updatedTimers[pondId] = updatedTimers[pondId] - 1000; // Decrease timer every second
          });
          return updatedTimers;
        });
      }, 1000);
    } else if (Object.values(timers).every((t) => t <= 0)) {
      clearInterval(interval);
      setIsRunning(false);
    }

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [isRunning, timers]);

  const handleNewTest = async (pondId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
  
      await axios.put(
        `http://192.168.43.60:5050/api/v1/pond/updateTestDate/${pondId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Reset timer for the pond after updating the test date
      setTimers((prevTimers) => ({
        ...prevTimers,
        [pondId]: 864000000, // Resetting to 10 days
      }));
    } catch (error) {
      console.error('Error updating test date:', error);
      Alert.alert('Error', 'Failed to reset the pond test date.');
    }
  };

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAddOrUpdatePond = async () => {
    if (!name || !pondArea || !pondDepth || !stockingDensity || !feedType || (species === 'Other' && !newSpecies)) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return;
    }

    const newPond = {
      name,
      pondArea: `${pondArea} ${areaUnit}`,
      pondDepth: `${pondDepth} ${depthUnit}`,
      cultureSystem,
      speciesCulture: species === 'Other' ? newSpecies : species,
      stockingDensity,
      feedType,
      lastTestDate: lastTestDate.toISOString(),
    };

    console.log('Submitting pond data:', newPond);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      
      if (isEditing) {
        await axios.put(
          `http://192.168.43.60:5050/api/v1/pond/update/${pondId}`,
          newPond,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPonds();
        setIsEditing(false);
      } else {
        const response = await axios.post(
          'http://192.168.43.60:5050/api/v1/pond/create',
          newPond,
          { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        setPonds([...ponds, response.data]);
      }
    } catch (error) {
      console.error('Error adding/updating pond:', error);
      Alert.alert('Error', 'Failed to add or update pond.');
    }

    clearForm();
    setModalVisible(false);
  };

  const handleEditPond = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    const pond = ponds[index];
    setName(pond.name);
    console.log("PondName : --------------------------------------------> ", pond.name);
    setPondId(pond._id);
    console.log("PondId : --------------------------------------------> ", pond._id);
    
    const [pondAreaValue = '', pondAreaUnit = ''] = pond.pondArea ? pond.pondArea.split(' ') : [];
    console.log('Setting Pond Area:', pondAreaValue, pondAreaUnit);
    setPondArea(pondAreaValue);
    setAreaUnit(pondAreaUnit);
    const [pondDepthValue = '', pondDepthUnit = ''] = pond.pondDepth ? pond.pondDepth.split(' ') : [];
    setPondDepth(pondDepthValue);
    setDepthUnit(pondDepthUnit);
    setCultureSystem(pond.cultureSystem);
    if (!['IMC', 'Magur', 'Singhi', 'Panga', 'Amur Carp', 'Calbasu', 'Pacu', 'Silver Grass', 'Vannamei', 'Rosen Bergi', 'Monoder'].includes(pond.speciesCulture)) {
      setSpecies('Other');
      setNewSpecies(pond.speciesCulture);
    } else {
      setSpecies(pond.speciesCulture);
    }
    setStockingDensity(pond.stockingDensity);
    setFeedType(pond.feedType);
    setLastTestDate(new Date(pond.lastTestDate));
    setModalVisible(true);
  };

  const handleDeletePond = async (index) => {
    const pondToDelete = ponds[index];
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this pond?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert('Error', 'No token found. Please log in again.');
                return;
              }
              await axios.delete(
                `http://192.168.43.60:5050/api/v1/pond/delete/${pondToDelete._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              fetchPonds();
            } catch (error) {
              console.error('Error deleting pond:', error);
              Alert.alert('Error', 'Failed to delete pond.');
            }
          }
        }
      ]
    );
  };

  const getSpeciesRangeMessage = (species) => {
    const ranges = {
      IMC: 'In range 200 to 500',
      Magur: 'In range 150 to 400',
      Singhi: 'In range 100 to 350',
      Panga: 'In range 200 to 450',
      'Amur Carp': 'In range 150 to 400',
      Calbasu: 'In range 200 to 500',
      Pacu: 'In range 100 to 300',
      'Silver Grass': 'In range 150 to 350',
      Vannamei: 'In range 200 to 500',
      'Rosen Bergi': 'In range 150 to 400',
      Monoder: 'In range 100 to 300',
      Other: 'Specify range for this species',
    };
    return ranges[species] || '';
  };
  const [speciesRangeMessage, setSpeciesRangeMessage] = useState(getSpeciesRangeMessage(species));



  const clearForm = () => {
    setName('');
    setPondArea('');
    setPondDepth('');
    setStockingDensity('');
    setFeedType('');
    setSpecies('Species 1');
    setNewSpecies('');
    setLastTestDate(new Date());
    setPondId(null);
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setLastTestDate(selectedDate);
  };

  const TimerWithIcon = ({ pondId }) => {
    return (
      <View style={styles.timerContainer}>
        <FontAwesome name="clock-o" size={20} color="#FF5722" style={styles.timerIcon} />
        <Text style={styles.timerText}>{formatTime(timers[pondId] || 0)}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={() => handleNewTest(pondId)}>
          <Ionicons name="refresh" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>POND MANAGEMENT</Text>

      <ScrollView style={styles.pondList}>
        {ponds.map((pond, index) => (
          <View key={index} style={styles.pondBox}>
            <View style={styles.pondHeader}>
              <Text style={styles.pondBoxTitle}>
                <FontAwesome name="tint" size={24} color="#1E88E5" /> {pond.name}
              </Text>
              <TouchableOpacity onPress={() => {
                Alert.alert(
                  "Options",
                  "Choose an action",
                  [
                    { text: "Edit", onPress: () => handleEditPond(index) },
                    { text: "Delete", onPress: () => handleDeletePond(index) },
                    { text: "Cancel", style: "cancel" }
                  ]
                );
              }}>
                <Ionicons name="ellipsis-vertical" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <Text>Area: {pond.pondArea}</Text>
            <Text>Depth: {pond.pondDepth}</Text>
            <Text>Culture System: {pond.cultureSystem}</Text>
            <Text>Species: {pond.speciesCulture}</Text>
            <Text>Stocking Density: {pond.stockingDensity} fish/m²</Text>
            <Text>Feed Type: {pond.feedType}</Text>
            <Text>Last Test Date: {new Date(pond.lastTestDate).toLocaleDateString()}</Text>
            {timers[pond._id] !== undefined && timers[pond._id] > 0 ? (
              <Text>Time Remaining: {formatTime(timers[pond._id])}</Text>
            ) : (
              <Text style={{ color: 'red' }}>Test Required!</Text>
            )}
            <TouchableOpacity onPress={() => handleNewTest(pond._id)}>
              <Text>Set New Test</Text>
            </TouchableOpacity>

            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('PondReport', { pondId: pond._id})}>
                <Text style={styles.buttonText}>Report</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('PondInventory', { pondId: pond._id})}>
                <Text style={styles.buttonText}>Inventory</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardButton} onPress={() => navigation.navigate('PondTest', { pondId: pond._id})}>
                <Text style={styles.buttonText}>Test</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Pond" : "Add New Pond"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Pond Name"
              value={name}
              onChangeText={setName}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 3 }]}
                placeholder="Area"
                value={pondArea}
                onChangeText={setPondArea}
                keyboardType="numeric"
              />
              <Picker
                selectedValue={areaUnit}
                style={[styles.picker, { flex: 2 }]}
                onValueChange={itemValue =>{
                    console.log('Selected unit:', itemValue);
                     setAreaUnit(itemValue)}}
              >
                <Picker.Item label="Square" value="Square" />
                <Picker.Item label="Acre" value="Acre" />
              </Picker>
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, { flex: 3 }]}
                placeholder="Depth"
                value={pondDepth}
                onChangeText={setPondDepth}
                keyboardType="numeric"
              />
              <Picker
                selectedValue={depthUnit}
                style={[styles.picker, { flex: 2 }]}
                onValueChange={itemValue => setDepthUnit(itemValue)}
              >
                <Picker.Item label="Feet" value="Feet" />
                <Picker.Item label="Meter" value="Meter" />
              </Picker>
            </View>
            <Picker
              selectedValue={cultureSystem}
              style={styles.picker}
              onValueChange={itemValue => setCultureSystem(itemValue)}
            >
              <Picker.Item label="Extensive" value="Extensive" />
              <Picker.Item label="Semi-intensive" value="Semi-intensive" />
              <Picker.Item label="Intensive" value="Intensive" />
            </Picker>
            <Picker
              selectedValue={species}
              style={styles.picker}
              onValueChange={(itemValue) => setSpecies(itemValue)}
            >
              <Picker.Item label="IMC" value="IMC" />
              <Picker.Item label="Magur" value="Magur" />
              <Picker.Item label="Singhi" value="Singhi" />
              <Picker.Item label="Panga" value="Panga" />
              <Picker.Item label="Amur Carp" value="Amur Carp" />
              <Picker.Item label="Calbasu" value="Calbasu" />
              <Picker.Item label="Pacu" value="Pacu" />
              <Picker.Item label="Silver Grass" value="Silver Grass" />
              <Picker.Item label="Vannamei" value="Vannamei" />
              <Picker.Item label="Rosen Bergi" value="Rosen Bergi" />
              <Picker.Item label="Monoder" value="Monoder" />
              <Picker.Item label="Other" value="Other" />
            </Picker>

            <Text style={{ color: 'red' }}>{speciesRangeMessage}</Text>

            {species === 'Other' && (
              <TextInput
                style={styles.input}
                placeholder="Specify Other Species"
                value={newSpecies}
                onChangeText={setNewSpecies}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Stocking Density (fish/m²)"
              value={stockingDensity}
              onChangeText={setStockingDensity}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Feed Type"
              value={feedType}
              onChangeText={setFeedType}
            />
            <View>
              <Text style={styles.label}>Last Test Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                <Text style={styles.datePickerText}>
                  {lastTestDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={lastTestDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>
            <TouchableOpacity
              style={[styles.cardButton, { marginTop: 20 }]}
              onPress={handleAddOrUpdatePond}
            >
              <Text style={styles.buttonText}>
                {isEditing ? "Update Pond" : "Add Pond"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cardButton, { backgroundColor: '#ccc', marginTop: 10 }]}
              onPress={() => {
                clearForm();
                setModalVisible(false);
              }}
            >
              <Text style={[styles.buttonText, { color: '#000' }]}>Cancel</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pondList: {
    flex: 1,
  },
  pondBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  pondHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pondBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cardButton: {
    flex: 1,
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    backgroundColor: '#1E88E5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  datePickerText: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 10,
  },
  pondBoxTitleTimer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E88E5',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  timerIcon: {
    marginRight: 8,
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF5722',
    backgroundColor: '#F0F0F0',
    borderRadius: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    flex: 1,
  },
  resetButtonTimer: {
    backgroundColor: '#FF5722', // Color for the reset button
    borderRadius: 20, // Make it a circle
    padding: 6, // Adjust padding for size
    marginLeft: 10, // Space between timer text and button
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardButtonTimer: {
    backgroundColor: '#1E88E5',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
});
