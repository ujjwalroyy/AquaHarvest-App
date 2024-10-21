import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Modal,
  Dimensions
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import Error from "react-native-vector-icons/AntDesign";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import styles from "./style.js";
import Toast from "react-native-toast-message";

const { width, height } = Dimensions.get('window');
const themeColors = { bg: '#B6E6FC' };

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [nameVerify, setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify, setEmailVerify] = useState(false);
  const [phone, setPhone] = useState('+91');
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify, setPasswordVerify] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    if (nameVerify && emailVerify && passwordVerify && phoneVerify) {
      const userData = { name, email, phone, password };
      console.log("Submitting data:", userData);

      axios.post("http://192.168.43.60:5050/api/v1/user/register", userData)
        .then(res => {
          if (res.data.success) {
            setOtpModalVisible(true); 
            Alert.alert("Success", "OTP sent to your phone.");
          } else {
            Alert.alert("Error", res.data.message || "An error occurred.");
          }
        })
        .catch(e => {
          console.error("Error:", e.response?.data || e.message);
          Alert.alert("Registration Error", "Something went wrong. Please try again.");
        });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error!!',
        text2: 'Fill mandatory details',
        visibilityTime: 5000
      })
    }
  };

  const handleChangePhone = (setter, validator) => (text) => {
    const value = text.startsWith('+91') ? text : `+91${text}`;
    setter(value);
    validator(value);
  };

  const validatePhoneNum = (value) => {
    const phoneNumber = value.replace('+91', '');
    setPhoneVerify(/[6-9]{1}[0-9]{9}/.test(phoneNumber));
  };


  const verifyOtp = async (phone, otp) => {
    try {
      const response = await axios.post('http://192.168.43.60:5050/api/v1/user/register/verify', { phone, otp });

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
  };

  const handleOtpSubmit = () => {
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
  };

  const handleChange = (setter, validator) => (text) => {
    setter(text);
    validator(text);
  };

  const validateName = (name) => setNameVerify(name.length > 2);
  const validateEmail = (email) => setEmailVerify(/^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email));
  const validatePhone = (phone) => setPhoneVerify(/[6-9]{1}[0-9]{9}/.test(phone));
  const validatePassword = (password) => setPasswordVerify(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(password));

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="always"
    style={{ backgroundColor: themeColors.bg, paddingVertical: 10 }}
  >
    <View>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={require("../../assets/images/welcome3.png")}
        />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.text_header}>Register</Text>
        <View style={styles.action}>
          <FontAwesome name="user" color="#37AFE1" style={styles.smallIcon} />
          <TextInput
            placeholder="Name"
            style={styles.textInput}
            onChangeText={handleChange(setName, validateName)}
          />
          {nameVerify && <Feather name="check-circle" color="green" size={20} />}
          {!nameVerify && name.length > 2 && <Error name="warning" color="red" size={20} />}
        </View>
        {name.length <= 2 ? null : !nameVerify && (
          <Text style={{ marginLeft: 20, color: "red" }}>Name should be more than 2 characters</Text>
        )}

        <View style={styles.action}>
          <Fontisto name="email" color="#37AFE1" size={24} style={{ marginLeft: 0, paddingRight: 5 }} />
          <TextInput
            placeholder="Email"
            style={styles.textInput}
            onChangeText={handleChange(setEmail, validateEmail)}
          />
          {emailVerify && <Feather name="check-circle" color="green" size={20} />}
          {!emailVerify && email.length > 2 && <Error name="warning" color="red" size={20} />}
        </View>
        {email.length <= 2 ? null : !emailVerify && (
          <Text style={{ marginLeft: 20, color: "red" }}>Please enter a valid email</Text>
        )}

        <View style={styles.action}>
          <FontAwesome name="mobile" color="#37AFE1" size={35} style={{ paddingRight: 10, marginTop: -7, marginLeft: 5 }} />
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
          <FontAwesome name="lock" color="#37AFE1" style={styles.smallIcon} />
          <TextInput
            placeholder="Password"
            style={styles.textInput}
            onChangeText={handleChange(setPassword, validatePassword)}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={password.length <= 2 ? null : showPassword ? "eye" : "eye-off"}
              style={{ marginRight: -10 }}
              color={password ? "green" : "red"}
              size={23}
            />
          </TouchableOpacity>
        </View>
        {password.length > 0 && !passwordVerify && (
          <Text style={{ marginLeft: 20, color: "red" }}>Password must include uppercase, lowercase, a number, and be at least 6 characters long</Text>
        )}
      </View>
      <View style={styles.button}>
        <TouchableOpacity style={styles.inBut} onPress={handleSubmit}>
          <View>
            <Text style={styles.textSign}>Register</Text>
          </View>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpModalVisible}
        onRequestClose={() => setOtpModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleOtpSubmit}
              >
                <Text style={styles.modalButtonText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "red" }]}
                onPress={() => setOtpModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  </ScrollView>
  );
};

export default RegisterPage;
