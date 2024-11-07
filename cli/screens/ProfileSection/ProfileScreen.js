import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Modal, Button, ScrollView, Animated, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 


export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [dob, setDob] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [editField, setEditField] = useState(null);
  const [newValue, setNewValue] = useState('');
  const [borderColorAnimation] = useState(new Animated.Value(0));
  const [userData, setUserData] = useState(null);

  async function getData() {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Token in getData:', token);

      if (token) {
        const response = await axios.get(
          'http://192.168.43.60:5050/api/v1/user/profile',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Response data profile:', response.data);

        if (response.data.user) {
          const user = response.data.user;
          if (JSON.stringify(userData) !== JSON.stringify(user)) {
            console.log('Setting user data:', user);
            setUserData(user);
          }
        } else {
          console.warn('User data not found in response');
        }
      } else {
        console.warn('Token not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      setCountry(userData.country || '');
      setState(userData.state || '');
      setCity(userData.city || '');
      setProfilePic(userData.profilePic || '');
      setDob(userData.dob || '');
    }
  }, [userData]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhoto = result.assets[0];
      setProfilePic(selectedPhoto.uri);
      await handleUpdateProfilePic(selectedPhoto);
    }
    setPhotoModalVisible(false);
  };

  const handleSaveProfile = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
  
      const profileData = { ...updatedData };
  
      Object.keys(profileData).forEach(key => {
        if (profileData[key] == null || profileData[key] === '') {
          delete profileData[key];
        }
      });
  
      const response = await axios.put('http://192.168.43.60:5050/api/v1/user/profile-update', profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success) {
        Alert.alert('Success', 'Profile updated successfully.');

        setUserData(prevUserData => ({
          ...prevUserData,
          ...profileData,
        }));

        if (updatedData.name) setName(updatedData.name);
        if (updatedData.email) setEmail(updatedData.email);
        if (updatedData.phone) setPhone(updatedData.phone);
        if (updatedData.country) setCountry(updatedData.country);
        if (updatedData.state) setState(updatedData.state);
        if (updatedData.city) setCity(updatedData.city);
        if (updatedData.dob) setDob(updatedData.dob);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  const handleSavePassword = async () => {
    try {
      if (!oldPassword || !newPassword) {
        Alert.alert('Error', 'Both old and new passwords are required.');
        return;
      }

      const response = await updatePassword({ oldPassword, newPassword });
      Alert.alert('Success', response.message);
      setPasswordModalVisible(false);
    } catch (error) {
      console.error('Failed to update password:', error);
      Alert.alert('Error', 'Failed to update password.');
    }
  };

  const handleUpdateProfilePic = async (photo) => {
    try {
      console.log('Uploading photo with uri:', photo.uri);
      const formData = new FormData();
      formData.append('file', {
        uri: photo.uri,
        name: 'photo.jpg', 
        type: 'image/jpeg',
      });

      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.put('http://192.168.43.60:5050/api/v1/user/profile-picture', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', 
        },
      });

      console.log('Response:', response.data); 

      if (response.data.success) {
        setProfilePic(response.data.profilePic.url);
        Alert.alert('Success', 'Profile picture updated');
        getData();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error updating profile picture:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to update profile picture');
    }
  };



  const updatePassword = async (passwordData) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.put('http://192.168.43.60:5050/api/v1/user/update-password', passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  };

  useEffect(() => {
    const animateBorderColor = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(borderColorAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(borderColorAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateBorderColor();
  }, [borderColorAnimation]);

  const borderColorInterpolation = borderColorAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FF5722', '#4CAF50'],
  });

  return (
    <LinearGradient colors={['#B3E5FC', '#E3F2FD']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Animated.View style={[styles.profileImageBorder, { borderColor: borderColorInterpolation }]}>
              <Image
                source={profilePic ? { uri: profilePic.url } : null}
                style={styles.profileImage}
              />
            </Animated.View>
            <TouchableOpacity style={styles.editPhotoButton} onPress={() => setPhotoModalVisible(true)}>
              <Text style={styles.editPhotoText}>Edit Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{name}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('name'); setNewValue(name); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{email}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('email'); setNewValue(email); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone:</Text>
              <Text style={styles.infoValue}>{phone}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('phone'); setNewValue(phone); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Country:</Text>
              <Text style={styles.infoValue}>{country}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('country'); setNewValue(country); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>State:</Text>
              <Text style={styles.infoValue}>{state}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('state'); setNewValue(state); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>City:</Text>
              <Text style={styles.infoValue}>{city}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('city'); setNewValue(city); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date of Birth:</Text>
              <Text style={styles.infoValue}>{dob}</Text>
              <TouchableOpacity style={styles.editButton} onPress={() => { setEditField('dob'); setNewValue(dob); setEditModalVisible(true); }}>
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.changePasswordButton} onPress={() => setPasswordModalVisible(true)}>
            <Text style={styles.changePasswordText}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <Modal
  visible={isPhotoModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setPhotoModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <MaterialCommunityIcons name="image" size={50} color="#37AFE1" />
      <Text style={styles.modalTitle}>Select a Photo</Text>
      <Text style={styles.modalSubtitle}>Choose an image from your gallery</Text>
      
      <TouchableOpacity style={styles.imgButton} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick from Gallery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.cancelImgButton} onPress={() => setPhotoModalVisible(false)}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



        <Modal
  visible={isEditModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <TextInput
        style={styles.modalInput}
        value={newValue}
        onChangeText={setNewValue}
        placeholder={`Edit ${editField}`} 
      />
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Save" 
            onPress={() => {
              if (editField && newValue.trim() !== '') { 
                const updatedData = { [editField]: newValue };
                handleSaveProfile(updatedData);
                setEditModalVisible(false); 
              } else {
                alert('Please enter a valid value.'); 
              }
            }} 
            color="#4CAF50" 
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button 
            title="Cancel" 
            onPress={() => setEditModalVisible(false)} 
            color="#F44336" 
          />
        </View>
      </View>
    </View>
  </View>
</Modal>


<Modal
  visible={passwordModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setPasswordModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalHeader}>Change Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Old Password"
        secureTextEntry
        value={oldPassword}
        onChangeText={setOldPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSavePassword}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setPasswordModalVisible(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>
      </ScrollView>
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#42A5F5',
  },
  profileImageBorder: {
    borderWidth: 6,
    borderRadius: 50,
    padding: 3,
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E3F2FD',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  editPhotoText: {
    color: '#1E88E5',
    fontSize: 12,
  },
  userInfo: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderColor: '#4CC9FE',
    borderWidth: 1,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: '#555',
  },
  editButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  editButtonText: {
    color: '#1E88E5',
    fontSize: 14,
  },
  userDescription: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    width: '85%', 
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 15, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  imgButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#37AFE1', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  modalInput: {
    width: '100%',
    padding: 10,
    marginBottom: 20, 
    backgroundColor: '#F0F0F0', 
    borderRadius: 10,
    borderColor: '#1E88E5',
    borderWidth: 1.5,
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  cancelImgButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#dc3545', 
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  buttonWrapper: {
    flex: 1, 
    marginHorizontal: 5, 
  },
  button: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: '#007BFF',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
  },
  cancelImgButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  changePasswordButton:{
    color:'#919191',
  },
  
});
