import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import HomeScreen from "./screens/HomeScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./screens/Login&Register/Login.jsx";
import RegisterPage from "./screens/Login&Register/Register.jsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen'; 
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import ProfileScreen from "./screens/ProfileSection/ProfileScreen.js";
import FarmInventory from './screens/HOME/FarmInventory.js'
import Pond from './screens/HOME/Pond.js'

const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: 'green',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'green',
        borderRightWidth: 7
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '700'
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text2NumberOfLines={3}
      style={{
        borderLeftColor: 'red',
        borderLeftWidth: 7,
        width: '90%',
        height: 70,
        borderRightColor: 'red',
        borderRightWidth: 7,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 17,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 14,
      }}
    />
  ),
};

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

const Continue = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Farm" component={FarmInventory} />
    <Stack.Screen name="Pond" component={Pond} />
    <Stack.Screen name="LoginNav" component={LoginNav} />
  </Stack.Navigator>
);

const LoginNav = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Welcome">
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginPage} />
    <Stack.Screen name="Register" component={RegisterPage} />
    <Stack.Screen name="Continue" component={Continue} />
  </Stack.Navigator>
);


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  async function getData() {
    try {
      const data = await AsyncStorage.getItem('isLoggedIn');
      console.log(data, 'at App.js');
      setIsLoggedIn(data === 'true'); // Ensure data is a boolean
    } catch (error) {
      console.error('Failed to fetch data from AsyncStorage:', error);
    }
  }

  useEffect(() => {
    async function prepare() {
      await getData();
      setTimeout(() => {
        SplashScreen.hideAsync(); 
      }, 900);
    }
    prepare();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <Continue /> : <LoginNav />}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}
