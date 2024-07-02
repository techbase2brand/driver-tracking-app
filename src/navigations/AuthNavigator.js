import React from 'react'
import { View, Text } from 'react-native'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import SignupScreen from '../screens/SignupScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import OtpVerification from '../screens/OtpVerification';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    // <NavigationContainer>
    
    <Stack.Navigator initialRouteName="LoginScreen">
    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown:false}} />
    <Stack.Screen name="OtpVerification" component={OtpVerification} options={{headerShown:false}} />
    <Stack.Screen name="regsiter" component={SignupScreen} options={{headerShown:false}} />
       <Stack.Screen name="Home" component={HomeScreen} />
     {/* <Stack.Screen name="MapScreen" component={MapScreen} />
      <Stack.Screen name="DriverScreen" component={DriverScreen} /> */}
    </Stack.Navigator>
//   </NavigationContainer>
  )
}

export default AuthNavigator