import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Dimensions
} from "react-native";
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import Error from "react-native-vector-icons/AntDesign";
import axios from "axios";
import styles from "./style.js";
import { useNavigation } from "@react-navigation/native";
const themeColors = { bg: '#B6E6FC' };

function LoginPage({props}) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState(''); // 'contact' or 'email'



  function handleSubmit() {
    if (emailVerify && passwordVerify) {
      const userData = { email, password };
      console.log("Submitting data:", userData);

      axios.post("http://192.168.43.61:5050/api/v1/user/login", userData)
        .then(res => {
          console.log(res.data);
          if (res.data.status === "ok") {
            Alert.alert("Success", "Login successful!");
            navigation.navigate('Register'); 
          } else {
            Alert.alert("Error", "Login failed. Please try again.");
          }
        })
        .catch(error => {
          console.error(error);
          Alert.alert("Error", "An error occurred. Please try again.");
        });
    } else {
      Alert.alert("Invalid Input", "Please check your email and password.");
    }
  }
  const handleVerificationMethod = (method) => {
    setVerificationMethod(method);
    setModalVisible(false);
    setOtpModalVisible(true);
  };
  const handleSubmitOtp = () => {
    if (otp.length === 6) {
      // Implement OTP verification logic here
      console.log('Verifying OTP:', otp);
      setOtpModalVisible(false);
    } else {
      alert('Please enter a valid 6-digit OTP.');
    }
  };
  const handleSendResetLink = () => {
    if (email) {
      // Implement reset link sending logic here
      console.log('Sending reset link to:', email);
    } else {
      alert('Please enter a valid email address.');
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
  
        console.log('OTP sent successfully:', response.data);
      } catch (error) {
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          alert('Failed to send OTP: ' + error.response.data.message || 'Please try again later.');
        } else if (error.request) {
          console.error('Error request:', error.request);
          alert('Network error: Please check your connection.');
        } else {
          console.error('Error message:', error.message);
          alert('Error: ' + error.message);
        }
      }
    } else {
      alert('Please enter a valid 13-digit phone number.');
    }
  };
  
  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    setEmail(emailVar);
    setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(emailVar));
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    setPassword(passwordVar);
    setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar));

  }
  function handleOtpSubmit() {
    verifyOtp(phone, otp)
      .then(response => {
        if (response.success) {
          Alert.alert("Success", response.message);
          navigation.navigate('Login'); 
        } else {
          Alert.alert("Error", response.message);
        }
      })
      .catch(e => {
        console.error("OTP Error:", e.message);
        Alert.alert("OTP Verification Error", "Something went wrong. Please try again.");
      });
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
      style={{backgroundColor: themeColors.bg, paddingVertical:10}}
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
            <Fontisto
              name="email"
              color="#420475"
              size={24}
              style={{ marginLeft: 0, paddingRight: 5 }}
            />
            <TextInput
              placeholder="Email"
              style={styles.textInput}
              onChange={handleEmail}
              value={email}
            />
            {emailVerify && <Feather name="check-circle" color="green" size={20} />}
            {!emailVerify && email.length > 2 && <Error name="warning" color="red" size={20} />}
          </View>
          {email.length > 2 && !emailVerify && (
            <Text style={{ marginLeft: 20, color: "red" }}>
              Please enter a valid email
            </Text>
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
                name={showPassword ? "eye" : "eye-off"}
                style={{ marginRight: -9 }}
                color={passwordVerify ? "green" : "red"}
                size={23}
              />
            </TouchableOpacity>
          </View>
          {password.length > 0 && !passwordVerify && (
            <Text style={{ marginLeft: 20, color: "red" }}>
              Password must include uppercase, lowercase, a number, and be at least 6 characters long
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
                  onPress={handleOtpSubmit}
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
            {verificationMethod === 'email' && (
              <>
                {/* <TextInput
                  style={styles.input}
                  placeholder="Enter New Password"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                /> */}
                {/* <TouchableOpacity
                  onPress={handleResetPassword}
                  style={styles.modalButton}
                >
                  <Text style={styles.modalButtonText}>Reset Password</Text>
                </TouchableOpacity> */}
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
                onPress={() => alert("Coming Soon")}
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
