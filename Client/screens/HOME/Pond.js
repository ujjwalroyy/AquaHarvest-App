import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from '@react-native-community/datetimepicker';
// import MenuNav from '../MenuNav';

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
  const [testDate, setTestDate] = useState(new Date());
  const [test, setTest] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);
  const [error, setError] = useState(null);
  const [isModalVisibleMenu, setIsModalVisibleMenu] = useState(false);
  const [selectedPondMenu, setSelectedPondMenu] = useState(null);


  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    return () => {
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
      testDate: testDate.toLocaleDateString(),
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
      testDate: testDate.toLocaleDateString(),
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
      setIsModalVisibleMenu(false)
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
      setIsModalVisibleMenu(false)
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
    setTestDate(new Date());
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
    setTestDate(new Date(pond.testDate));
    setTest(pond.test);
    setUpdateModalVisible(true);
  };

  const handleMenuPress = (pond) => {
    setSelectedPondMenu(pond);
    setIsModalVisibleMenu(true);
  };

  const handleCloseModal = () => {
    setIsModalVisibleMenu(false);
    setSelectedPondMenu(null);
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.headText}>List Ponds</Text>
      {/* <MenuNav/> */}
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
            <Text>Last Test Date: {pond.testDate}</Text>
            <Text>Which Test: {pond.test}</Text>
            <TouchableOpacity onPress={() => handleMenuPress(pond)} style={styles.menuButton}>
            <FontAwesome name="ellipsis-v" size={24} color="#1E88E5" />
          </TouchableOpacity>
          <TouchableOpacity
                style={styles.dropdownOption}
                // onPress={() => navigation.navigate("Pond")}
              >
                <Text style={styles.dropdownOptionText}>Test</Text>
              </TouchableOpacity>
          </View>
        ))}
        {selectedPondMenu && (
        <Modal
          transparent={true}
          visible={isModalVisibleMenu}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={() => openUpdateModal(selectedPondMenu)} style={styles.modalButton}>
                <Text style={styles.updateButton}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeletePond(selectedPondMenu._id)} style={styles.modalButton}>
                <Text style={styles.deleteButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
                value={testDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={testDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  setTestDate(date || testDate);
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
            <TouchableOpacity style={{marginTop:10}}>
              <Text style={styles.submitButtonText}></Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Update Pond Modal */}
      <ScrollView>
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
                value={testDate.toLocaleDateString()}
                editable={false}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={testDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  setTestDate(date || testDate);
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
            <TouchableOpacity style={{marginTop:10}}>
              <Text style={styles.submitButtonText}></Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  headText:{
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#1E88E5',
    textAlign:'center'
  },
  pondList: {
    marginTop:30,
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
  dropdownOption: {
    borderColor:'black',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dropdownOptionText: {
   
    color: '#1E88E5',
    fontSize: 18,
    textAlign:'center'
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalButton: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
  },
  menuButton: {
    position: 'absolute', 
    top: 10, 
    right: 10, 
    padding: 10, 
    zIndex: 1, 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  menuLine: {
    width: 30,
    height: 3,
    backgroundColor: "#1E88E5",
    marginVertical: 2,
    borderRadius: 2,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#bbdefb",
    padding: 5,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  userName: {
    fontSize: 18,
    color: "#000",
    marginRight: 10,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#42A5F5",
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
    zIndex: 1,
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   backgroundColor: '#2986cc',

  // },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
