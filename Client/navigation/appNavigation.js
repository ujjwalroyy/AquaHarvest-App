import HomeScreen from '../screens/HomeScreen'
import {view ,text } from react-native
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';


const Stack = createNativeStackNavigator()

export default function appNavigation (){
    return(
        <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
            <Stack.Screen name="Home" option={{headerShown:false}} component={HomeScreen} />
            <Stack.Screen name="Welcome" option={{headerShown:false}} component={WelcomeScreen} />
            <Stack.Screen name="Login" option={{headerShown:false}} component={LoginScreen} />
            <Stack.Screen name="Signup" option={{headerShown:false}} component={SignupScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    )
}