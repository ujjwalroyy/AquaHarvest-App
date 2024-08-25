import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions, Modal, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

const SignupScreen = () => {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useIdTokenAuthRequest({
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
    scopes: ['profile', 'email'],
  });

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [formValid, setFormValid] = useState(false);

  useEffect(() => {
    validateForm();
  }, [selectedCountry, selectedState, selectedCity, contact, otp]);

  const countryStateCityData = {
    USA: {
      states: {
        California: ['Los Angeles', 'San Francisco'],
        Texas: ['Houston', 'Austin'],
      },
    },
    India: {
      states: {
        Bihar: ['Patna', 'Gaya'],
        Maharashtra: ['Mumbai', 'Pune'],
      },
    },
    Canada: {
      states: {
        Ontario: ['Toronto', 'Ottawa'],
        Quebec: ['Montreal', 'Quebec City'],
      },
    },
  };

  const validateForm = () => {
    const isContactValid = contact.trim().length === 10;
    const isOtpValid = otp.trim().length === 6;
    const isCountrySelected = selectedCountry !== '';
    const isStateSelected = selectedState !== '';
    const isCitySelected = selectedCity !== '';

    setFormValid(
      isContactValid &&
      isOtpValid &&
      isCountrySelected &&
      isStateSelected &&
      isCitySelected &&
      isOtpVerified
    );
  };

  const handleSignup = () => {
    if (!formValid) {
      Alert.alert('Error', 'Please fill in all fields correctly.');
      return;
    }

    // Perform signup logic here, e.g., API call

    Alert.alert('Success', 'Successfully signed up!');
  };

  const handleVerify = () => {
    if (contact.trim() === '' || contact.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit contact number.');
      return;
    }
    setIsModalVisible(true);
  };

  const handleOtpChange = (text) => {
    // Limit OTP input to 6 digits
    if (/^\d{0,6}$/.test(text)) {
      setOtp(text);
    }
  };

  const handleOtpVerification = () => {
    if (otp.trim() === '' || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP.');
      return;
    }
    setIsOtpVerified(true);
    setIsModalVisible(false);
    validateForm(); // Revalidate the form after OTP verification
  };

  return (
    <LinearGradient
      colors={['#B3E5FC', '#E3F2FD']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <SafeAreaView style={{ paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={{ backgroundColor: 'yellow', padding: 8, borderTopRightRadius: 16, borderBottomLeftRadius: 16, marginLeft: 16 }}
                >
                  <FontAwesome name="arrow-left" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                <Image 
                  source={require('../assets/images/welcome.png')} 
                  style={styles.image}
                  resizeMode="contain" 
                />
              </View>
            </SafeAreaView>

            <View style={[styles.formContainer]}>
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <FontAwesome name="user" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome name="envelope" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Email"
                    keyboardType="email-address"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome name="phone" size={20} color="gray" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Contact"
                    keyboardType="phone-pad"
                    value={contact}
                    onChangeText={setContact}
                  />
                  <TouchableOpacity onPress={handleVerify} style={[styles.verifyButton, { opacity: contact.trim().length === 10 ? 1 : 0.5 }]} disabled={contact.trim().length !== 10}>
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  <FontAwesome name="globe" size={20} color="gray" style={styles.icon} />
                  <Picker
                    selectedValue={selectedCountry}
                    onValueChange={(itemValue) => {
                      setSelectedCountry(itemValue);
                      setSelectedState('');
                      setSelectedCity('');
                    }}
                    style={styles.picker}
                  >
                    <Picker.Item label="Select Country" value="" />
                    {Object.keys(countryStateCityData).map((country) => (
                      <Picker.Item key={country} label={country} value={country} />
                    ))}
                  </Picker>
                </View>

                {selectedCountry ? (
                  <View style={styles.inputContainer}>
                    <FontAwesome name="map-marker" size={20} color="gray" style={styles.icon} />
                    <Picker
                      selectedValue={selectedState}
                      onValueChange={(itemValue) => {
                        setSelectedState(itemValue);
                        setSelectedCity('');
                      }}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select State" value="" />
                      {Object.keys(countryStateCityData[selectedCountry].states).map((state) => (
                        <Picker.Item key={state} label={state} value={state} />
                      ))}
                    </Picker>
                  </View>
                ) : null}

                {selectedState ? (
                  <View style={styles.inputContainer}>
                    <FontAwesome name="building" size={20} color="gray" style={styles.icon} />
                    <Picker
                      selectedValue={selectedCity}
                      onValueChange={(itemValue) => setSelectedCity(itemValue)}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select City" value="" />
                      {countryStateCityData[selectedCountry].states[selectedState].map((city) => (
                        <Picker.Item key={city} label={city} value={city} />
                      ))}
                    </Picker>
                  </View>
                ) : null}

                <TouchableOpacity
                  onPress={handleSignup}
                  style={[styles.signupButton, { opacity: formValid ? 1 : 0.5 }]}
                  disabled={!formValid}
                >
                  <Text style={styles.signupButtonText}>Signup</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => promptAsync()}
                  style={styles.googleButton}
                  disabled={!request}
                >
                  <Image source={require('../assets/icons/google.png')} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
              </View>

              {/* OTP Verification Status */}
              {isOtpVerified && (
                <View style={styles.otpStatusContainer}>
                  <FontAwesome name="check-circle" size={24} color="green" />
                  <Text style={styles.otpStatusText}>OTP Verified</Text>
                </View>
              )}
            </View>

            {/* OTP Verification Modal */}
            <Modal
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => setIsModalVisible(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Enter OTP</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={handleOtpChange}
                  />
                  <TouchableOpacity
                    onPress={handleOtpVerification}
                    style={styles.verifyButton}
                  >
                    {isOtpVerified ? (
                      <FontAwesome name="check" size={20} color="white" />
                    ) : (
                      <Text style={styles.verifyButtonText}>Verify OTP</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    borderRadius: 16,
    padding: 8,
    marginBottom: 8,
  },
  icon: {
    marginLeft: 8,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: 'gray',
  },
  picker: {
    flex: 1,
    color: 'gray',
  },
  signupButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
  },
  googleButton: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButton: {
    padding: 8,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  otpInput: {
    width: '100%',
    padding: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  otpStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  otpStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'green',
  },
});

export default SignupScreen;

