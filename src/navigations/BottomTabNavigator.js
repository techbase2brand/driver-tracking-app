import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
// import SettingsScreen from './screens/SettingsScreen';
// import LocationScreen from './screens/LocationScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {createStackNavigator} from '@react-navigation/stack';
import DriverScreen from '../screens/DriverScreen';
import MapScreen from '../screens/MapScreen';
import {Platform, Text} from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import RoutePlannerScreen from '../screens/RoutePlannerScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const CustomHeader = () => {
  return (
    // Your custom header JSX goes here
    <header style={{backgroundColor: 'lightblue', padding: 15}}>
      {/* Example: Title in the center */}
      <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
        Your Custom Header
      </Text>
    </header>
  );
};
function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DriverScreen"
        component={DriverScreen}
        options={
          {
            // headerShown: false,
          }
        }
      />
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={
          {
            // headerShown: false,
          }
        }
      />
      <Stack.Screen
        name="RoutePlannerScreen"
        component={RoutePlannerScreen}
        options={{title: 'Route Planner'}}
      />
    </Stack.Navigator>
  );
}
function ProfileStack() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Orderhistory') {
            iconName = focused ? 'basket' : 'basket-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FBBC05',
        tabBarInactiveTintColor: '#4B5563',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 0 : 6,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 86 : 68,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 22 : 10,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        },
      })}
      detachInactiveScreens={false}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Orderhistory"
        options={{headerShown: false}}
        component={OrderHistoryScreen}
      />
      <Tab.Screen
        name="Profile"
        options={{headerShown: false}}
        component={ProfileStack}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
