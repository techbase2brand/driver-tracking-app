import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './BottomTabNavigator';
import AuthNavigator from './AuthNavigator';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const AppNavigator = () => {
  /** Login payload is stored as root `email`: `{ driver: { email }, ... }` or API may add `token`. */
  const session = useSelector(state => state?.email);
  const isLoggedIn = Boolean(session?.driver?.email || session?.token);
  const navigationKey = isLoggedIn
    ? `app-${String(session?.loginSessionAt || 'active-session')}`
    : 'auth';

  if (__DEV__) {
    console.log('Auth session email:', session?.driver?.email ?? '(none)');
  }
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Hide the splash screen after 3 seconds
    }, 3000);
  }, []);
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('hasLaunched', 'true');
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking first launch', error);
      }
    };

    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return <SplashScreen />; // Render the splash screen while loading
  }

  if (isFirstLaunch === null) {
    return null; // Render nothing while determining first launch status
  }

  if (isFirstLaunch) {
    return <OnboardingScreen onFinish={() => setIsFirstLaunch(false)} />;
  }

  return (
    <NavigationContainer key={navigationKey}>
      {isLoggedIn ? (
        <BottomTabNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
