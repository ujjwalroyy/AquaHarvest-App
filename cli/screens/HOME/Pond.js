import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Pond() {
  const [ponds, setPonds] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [pondType, setPondType] = useState('');
  const [depth, setDepth] = useState('');
  const [area, setArea] = useState('');
  const [quantity, setQuantity] = useState('');
  const [feedType, setFeedType] = useState('');
  const [lastTestDate, setLastTestDate] = useState(new Date());
  const [test, setTest] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [error, setError] = useState(null);


  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
      // Clean up animation if component unmounts
      animatedValue.stopAnimation();
    };
  }, [animatedValue]);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.get(
          "http://192.168.43.60:5050/api/v1/pond/getPonds",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (Array.isArray(response.data)) {
          setPonds(response.data);
        } else {
          console.warn("Unexpected data structure:", response.data);
        }
      } else {
        console.warn("Token not found");
      }
    } catch (error) {
      console.error("Error fetching pond data:", error);
      setError("Failed to fetch pond data");
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleAddPond = async () => {
    const newPond = {
      name,
      pondType,
      depth,
      area,
      quantity,
      feedType,
      lastTestDate: lastTestDate.toLocaleDateString(),
      test,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await axios.post('http://192.168.43.60:5050/api/v1/pond/create', newPond, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      setPonds([...ponds, response.data]);
      clearForm();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding pond:', error);
      Alert.alert('Error', 'Failed to add pond.');
    }
  };

  const handleUpdatePond = async () => {
    const updatedPond = {
      name,
      pondType,
      depth,
      area,
      quantity,
      feedType,
      lastTestDate: lastTestDate.toLocaleDateString(),
      test,
    };

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      const response = await axios.put(
        `http://192.168.43.60:5050/api/v1/pond/update/${selectedPond._id}`,
        updatedPond,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setPonds(ponds.map(p => (p._id === selectedPond._id ? response.data : p)));
      clearForm();
      setUpdateModalVisible(false);
    } catch (error) {
      console.error('Error updating pond:', error.response ? error.response.data.message : error.message);
      Alert.alert('Error', error.response ? error.response.data.message : 'Failed to update pond.');
    }
  };

  const handleDeletePond = async (pondId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert('Error', 'No token found. Please log in again.');
        return;
      }
      await axios.delete(`http://192.168.43.60:5050/api/v1/pond/delete/${pondId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setPonds(ponds.filter(p => p._id !== pondId));
    } catch (error) {
      console.error('Error deleting pond:', error);
      Alert.alert('Error', 'Failed to delete pond.');
    }
  };

  const clearForm = () => {
    setName('');
    setPondType('');
    setDepth('');
    setArea('');
    setQuantity('');
    setFeedType('');
    setLastTestDate(new Date());
    setTest('');
    setSelectedPond(null);
  };

  const openUpdateModal = (pond) => {
    setSelectedPond(pond);
    setName(pond.name);
    setPondType(pond.pondType);
    setDepth(pond.depth);
    setArea(pond.area);
    setQuantity(pond.quantity);
    setFeedType(pond.feedType);
    setLastTestDate(new Date(pond.lastTestDate));
    setTest(pond.test);
    setUpdateModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.pondList}>
        {ponds.map((pond) => (
          <View key={pond._id} style={styles.pondBox}>
            <Text style={styles.pondBoxTitle}>
              <FontAwesome name="tint" size={24} color="#1E88E5" /> {pond.name}
            </Text>
            <Text>Type: {pond.pondType}</Text>
            <Text>Depth: {pond.depth}</Text>
            <Text>Area: {pond.area}</Text>
            <Text>Quantity: {pond.quantity}</Text>
            <Text>Feed Type: {pond.feedType}</Text>
            <Text>Last Test Date: {pond.lastTestDate}</Text>
            <Text>Which Test: {pond.test}</Text>
            <TouchableOpacity onPress={() => openUpdateModal(pond)}>
              <Text style={styles.updateButton}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeletePond(pond._id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <FontAwesome name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Add Pond Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.formContainer}>
            <Text style={styles.modalTitle}>Add Pond</Text>

            <TextInput
              style={styles.input}
              placeholder="Name of Pond"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Pond Type (e.g., Freshwater, Saltwater)"
              value={pondType}
              onChangeText={setPondType}
            />

            <TextInput
              style={styles.input}
              placeholder="Depth (e.g., 10m)"
              value={depth}
              onChangeText={setDepth}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Area (e.g., 500 sq.m)"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Quantity of Fish (e.g., 1000)"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Feed Type (e.g., Pellets, Live Food)"
              value={feedType}
              onChangeText={setFeedType}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Last Test Date"
                value={lastTestDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={lastTestDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  setLastTestDate(date || lastTestDate);
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Which Test (e.g., pH, DO)"
              value={test}
              onChangeText={setTest}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleAddPond}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Update Pond Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.formContainer}>
            <Text style={styles.modalTitle}>Update Pond</Text>

            <TextInput
              style={styles.input}
              placeholder="Name of Pond"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Pond Type (e.g., Freshwater, Saltwater)"
              value={pondType}
              onChangeText={setPondType}
            />

            <TextInput
              style={styles.input}
              placeholder="Depth (e.g., 10m)"
              value={depth}
              onChangeText={setDepth}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Area (e.g., 500 sq.m)"
              value={area}
              onChangeText={setArea}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Quantity of Fish (e.g., 1000)"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Feed Type (e.g., Pellets, Live Food)"
              value={feedType}
              onChangeText={setFeedType}
            />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.input}
                placeholder="Last Test Date"
                value={lastTestDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={lastTestDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  setLastTestDate(date || lastTestDate);
                }}
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Which Test (e.g., pH, DO)"
              value={test}
              onChangeText={setTest}
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleUpdatePond}>
              <Text style={styles.submitButtonText}>Update</Text>
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
    backgroundColor: '#f5f5f5',
  },
  pondList: {
    marginBottom: 60, // To avoid overlap with the Add button
  },
  pondBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#f59128',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2.8,
    shadowRadius: 2,
    elevation: 2,
    
  },
  pondBoxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1E88E5',
  },
  updateButton: {
    color: '#1E88E5',
    marginTop: 10,
  },
  deleteButton: {
    color: '#E53935',
    marginTop: 5,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1E88E5',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f59128',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#2986cc',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1E88E5',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f59128',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: '#2986cc',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
