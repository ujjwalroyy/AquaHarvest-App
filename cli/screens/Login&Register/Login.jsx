import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions,
  Linking,
  
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import Error from "react-native-vector-icons/AntDesign";
import axios from "axios";
import styles from "./style.js";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const themeColors = { bg: '#B6E6FC' };

function LoginPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('+91');
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(''); // 'contact' or 'email'

  const handleSubmit = () => {
    if (phoneVerify && passwordVerify) {
      const userData = { phone, password };
      console.log("Submitting data:", userData);

      axios.post("http://192.168.43.60:5050/api/v1/user/signin", userData)
        .then(res => {
          console.log('data ' ,res.data);
          if (res.data.success) {
            Alert.alert("Success", "Login successful!");
            AsyncStorage.setItem('token', res.data.token)
            
            AsyncStorage.setItem('isLoggedIn', JSON.stringify(true))
             
            navigation.navigate('Continue', { screen: 'Home' }); 
          } else {
            Alert.alert("Error", res.data.message || "Login failed. Please try again.");
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Error", "An error occurred. Please try again.");
        });
    } else {
      Alert.alert("Invalid Input", "Please check your Phone no. and password.");
    }
  };

  const handleVerificationMethod = (method) => {
    setVerificationMethod(method);
    setModalVisible(false);
    setOtpModalVisible(true);
  };

  const handleSubmitOtp = () => {
    if (otp.length === 6) {
      verifyOtp(phone, otp)
      Alert.alert('Otp Verified');
      console.log('Otp Verified:', otp);
      setOtpModalVisible(false);
    } else {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
    }
  };

  const handleSendResetLink = () => {
    if (email) {
      // Implement reset link sending logic here
      console.log('Sending reset link to:', email);
    } else {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setVerificationMethod(''); 
  };

  const handleForgotPassword = () => {
    setModalVisible(true);
  };

  const handleSendOtp = async () => {
    if (phone.length === 13) {
      try {
        const response = await axios.post('http://192.168.43.60:5050/api/v1/user/send-otp', {
          phone: phone,
        });
        Alert.alert('OTP sent successfully');
        console.log('OTP sent successfully:', response.data);
      } catch (error) {
        console.error('Error sending OTP:', error);
        Alert.alert('Failed to send OTP', error.response?.data?.message || 'Please try again later.');
      }
    } else {
      Alert.alert('Invalid Phone Number', 'Please enter a valid 13-digit phone number.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const backendUrl = 'http://192.168.43.60:5050/auth/google'; 
      await Linking.openURL(backendUrl);
    } catch (error) {
      console.error('Google login failed:', error);
      Alert.alert('Login Error', 'Unable to login with Google. Please try again later.');
    }
  };

  const handleRedirect = async (event) => {
    if (event.url) {
      const { queryParams } = Linking.parse(event.url);
      const code = queryParams['code'];

      if (code) {
        try {
          const response = await axios.get(`http://192.168.43.60:5050/auth/google/callback`, {
            params: { code }
          });
          
          const { token } = response.data;

          await AsyncStorage.setItem('token', token);

          navigation.navigate('HomeScreen');
        } catch (error) {
          console.error('Error handling callback:', error);
          Alert.alert('Error', 'Unable to handle Google login callback. Please try again.');
        }
      }
    }
  };
  useEffect(() => {
    // Set up URL listener
    const subscription = Linking.addEventListener('url', handleRedirect);

    return () => {
      subscription.remove();
    };
  }, []);


  // const checkToken = async () => {
  //   try {
  //     const token = await AsyncStorage.getItem('token');
  //     if (token) {
  //       // Token exists, proceed to authenticated area
  //       console.log('Token:', token);
  //     } else {
  //       // No token, redirect to login
  //       console.log('No token found');
  //     }
  //   } catch (error) {
  //     console.error('Error checking token:', error);
  //   }
  // };

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
  }
  const handleChangePhone = (setter, validator) => (text) => {
    const value = text.startsWith('+91') ? text : `+91${text}`;
    setter(value);
    validator(value);
  };

  const validatePhoneNum = (value) => {
    const phoneNumber = value.replace('+91', '');
    setPhoneVerify(/[6-9]{1}[0-9]{9}/.test(phoneNumber));
  };


  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar));
  }

  async function verifyOtp(phone, otp) {
    try {
      const response = await axios.post('http://192.168.43.60:5050/api/v1/user/verify-forgot-otp', {
        phone,
        otp
      });

      if (response.data.success) {
        setOtpModalVisible(false); 
        return { success: true, message: response.data.message || 'OTP verified successfully!' };
      } else {
        return { success: false, message: response.data.message || 'Verification failed' };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: 'An error occurred. Please try again.' };
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      style={{ backgroundColor: themeColors.bg, paddingVertical: 10 }}
    >
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
          <Image
            style={styles.image}
            source={require("../../assets/images/welcome.png")}
            resizeMode="contain"
          />
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.text_header}>Fishy...</Text>

          <View style={styles.action}>
            <FontAwesome name="mobile" color="#420475" size={35} style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }} />
            <TextInput
              placeholder="Phone"
              style={styles.textInput}
              onChangeText={handleChangePhone(setPhone, validatePhoneNum)}
              maxLength={13}
            />
            {phoneVerify && <Feather name="check-circle" color="green" size={20} />}
            {!phoneVerify && validatePhoneNum.length > 2 && <Error name="warning" color="red" size={20} />}
          </View>
          {validatePhoneNum.length <= 2 ? null : !phoneVerify && (
            <Text style={{ marginLeft: 20, color: "red" }}>Phone number should start with 6-9 and be followed by 9 digits</Text>
          )}

<View style={styles.action}>
            <FontAwesome name="lock" color="#420475" style={styles.smallIcon} />
            <TextInput
              placeholder="Password"
              style={styles.textInput}
              onChange={handlePassword}
              secureTextEntry={!showPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={password.length <= 2 ? null : showPassword ? "eye" : "eye-off"}
                style={{ marginRight: -9 }}
                color={passwordVerify ? "green" : "red"}
                size={23}
              />
            </TouchableOpacity>
          </View>
          {password.length > 0 && !passwordVerify && (
            <Text style={{ marginLeft: 20, color: "red" }}>
              Password must include uppercase, lowercase, a number, and be at least 6 characters long.
            </Text>
          )}

          <View
            style={{
              justifyContent: "flex-end",
              alignItems: "flex-end",
              marginTop: 8,
              marginRight: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleForgotPassword}
              style={styles.forgotPasswordButton}
            >
              <Text style={{ color: "#4F4F4F", fontWeight: "700" }}>
                Forgot Password
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.button}>
          <TouchableOpacity style={styles.inBut} onPress={handleSubmit}>
            <View>
              <Text style={styles.textSign}>Log in</Text>
            </View>
          </TouchableOpacity>

          <View style={{ padding: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: "bold", color: "#919191" }}>
              ------Or Continue as------
            </Text>
          </View>

          <Modal
            transparent={true}
            visible={isModalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalBackground}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Reset Password</Text>
                <TouchableOpacity
                  onPress={() => handleVerificationMethod('contact')}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Verify via Phone</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleVerificationMethod('email')}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Verify via Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            visible={isOtpModalVisible}
            onRequestClose={() => setOtpModalVisible(false)}
          >
            <View style={styles.modalBackground}>
              <ScrollView contentContainerStyle={styles.modalContainer}>
                {verificationMethod === 'contact' ? (
                  <>
                    <Text style={styles.modalTitle}>Verify via Phone</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Phone Number"
                      keyboardType="phone-pad"
                      maxLength={13}
                      value={phone}
                      onChangeText={setPhone}
                    />
                    <TouchableOpacity
                      onPress={handleSendOtp}
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>Send OTP</Text>
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter OTP"
                      keyboardType="numeric"
                      maxLength={6}
                      value={otp}
                      onChangeText={setOtp}
                    />
                    <TouchableOpacity
                      onPress={handleSubmitOtp}
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>Submit OTP</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>Verify via Email</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Email"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                    />
                    <TouchableOpacity
                      onPress={handleSendResetLink}
                      style={styles.modalButton}
                    >
                      <Text style={styles.modalButtonText}>Send Reset Link</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  onPress={() => setOtpModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>

          <View style={styles.bottomButton}>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={() => navigation.navigate("Register")}
              >
                <FontAwesome
                  name="user-plus"
                  color="white"
                  style={[styles.smallIcon2, { fontSize: 30 }]}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Sign Up</Text>
            </View>

            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <TouchableOpacity
                style={styles.inBut2}
                onPress={handleGoogleLogin}
              >
                <FontAwesome
                  name="google"
                  color="white"
                  style={[styles.smallIcon2, { fontSize: 30 }]}
                />
              </TouchableOpacity>
              <Text style={styles.bottomText}>Google</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const { width, height } = Dimensions.get('window');

export default LoginPage;
