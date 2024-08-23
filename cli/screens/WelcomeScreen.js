import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, SafeAreaView,  Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc'; // Importing twrnc for Tailwind-like styling

const themeColors = {
  bg: '#B6E6FC', // Background color
};

const WelcomeScreen = () => {
    const navigation =useNavigation();

  return (
    <SafeAreaView style={[tw`flex-1`, { backgroundColor: themeColors.bg }]}>
      <View style={tw`flex-1 justify-around my-4`}>
        <Text style={tw`text-white font-bold text-4xl text-center`}>
          WELCOME
        </Text>
        <View style={tw`flex-row justify-center`}>
          <Image
            source={require('../assets/images/welcome.png')}
            style={{ width: 350, height: 350 }}
          />
        </View>
        <View style={tw`space-y-4`}>
          <TouchableOpacity onPress={()=> navigation.navigate('Login')}
          style={tw`py-3 bg-yellow-400 mx-7 rounded-xl`}>
            <Text style={tw`text-xl font-bold text-center text-gray-700`}>
            Login
            </Text>
          </TouchableOpacity>
          <View style={tw`flex-row justify-center`}>
            <Text style={tw`text-white font-semibold`}>
              Create an account?
            </Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Signup')}>
              <Text style={tw`font-semibold text-red-400`}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
