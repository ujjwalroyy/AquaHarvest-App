import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import HomeScreen from "./screens/HomeScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginPage from "./screens/Login&Register/Login.jsx";
import RegisterPage from "./screens/Login&Register/Register.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterPage}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>

    // <NavigationContainer>
    //   <Stack.Navigator>
    //   <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
    //   <Stack.Screen name="Register" component={RegisterPage} options={{ headerShown: false }}/>
    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

