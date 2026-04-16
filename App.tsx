import React, { useEffect } from 'react';
import { SafeAreaView, Platform, PermissionsAndroid } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';
import AppNavigator from './src/navigations/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

let badgeCount = 0;

async function createChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });
}

async function requestPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }

  const authStatus = await messaging().requestPermission();

  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('🔔 Permission granted');
    getFcmToken();
  }
}

async function getFcmToken() {
  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    console.log('🔥 FCM Token:', token);
  } catch (e) {
    console.log('Token error:', e);
  }
}

async function showNotification(title, body) {
  badgeCount++;

  await notifee.displayNotification({
    title,
    body,
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
    },
  });

  await notifee.setBadgeCount(badgeCount);
}

async function resetBadge() {
  badgeCount = 0;
  await notifee.setBadgeCount(0);
}

function App() {

  useEffect(() => {
    createChannel();
    requestPermission();

    // 📩 Foreground notification
    const unsub = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground:', remoteMessage);

      const title = remoteMessage?.notification?.title || 'New Notification';
      const body = remoteMessage?.notification?.body || '';

      await showNotification(title, body);
    });

    // 🔔 Background open
    messaging().onNotificationOpenedApp(async () => {
      console.log('🔔 Opened from background');
      await resetBadge();
    });

    // 🚀 Quit state open
    messaging().getInitialNotification().then(async remoteMessage => {
      if (remoteMessage) {
        console.log('🚀 Opened from quit state');
        await resetBadge();
      }
    });

    return () => unsub();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
// import React, {useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './src/redux/store';
// import AppNavigator from './src/navigations/AppNavigator';
// import messaging from '@react-native-firebase/messaging';

// function App(): React.JSX.Element {

//   // 🔐 Permission + Token
//   const requestPermission = async () => {
//     let granted = true;

//     // 👉 Android Permission
//     if (Platform.OS === 'android') {
//       if (Platform.Version >= 33) {
//         const res = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//         );
//         granted = res === PermissionsAndroid.RESULTS.GRANTED;
//       }
//     }

//     // 👉 iOS Permission
//     if (Platform.OS === 'ios') {
//       const authStatus = await messaging().requestPermission();
//       granted =
//         authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//         authStatus === messaging.AuthorizationStatus.PROVISIONAL;
//     }

//     if (granted) {
//       getFcmToken();
//     } else {
//       console.log('❌ Notification permission denied');
//     }
//   };

//   // 🔥 Get FCM Token
//   const getFcmToken = async () => {
//     try {
//       await messaging().registerDeviceForRemoteMessages();
//       const token = await messaging().getToken();
//       console.log('🔥 FCM TOKEN:', token);

//       // 👉 TODO: backend pe bhejna hai
//     } catch (error) {
//       console.log('Token Error:', error);
//     }
//   };

//   // 🔄 Token Refresh
//   const setupTokenRefresh = () => {
//     return messaging().onTokenRefresh(token => {
//       console.log('🔄 New Token:', token);
//     });
//   };

//   // 📩 Foreground Notification
//   const setupForegroundListener = () => {
//     return messaging().onMessage(async remoteMessage => {
//       console.log('📩 Foreground Notification:', remoteMessage);
//     });
//   };

//   // 🚀 Initial setup
//   useEffect(() => {
//     requestPermission();

//     const unsubscribeToken = setupTokenRefresh();
//     const unsubscribeForeground = setupForegroundListener();

//     // 👉 App opened from background
//     messaging().onNotificationOpenedApp(remoteMessage => {
//       console.log('🔔 Opened from background:', remoteMessage);
//     });

//     // 👉 App opened from quit state
//     messaging()
//       .getInitialNotification()
//       .then(remoteMessage => {
//         if (remoteMessage) {
//           console.log('🚀 Opened from quit state:', remoteMessage);
//         }
//       });

//     return () => {
//       unsubscribeToken();
//       unsubscribeForeground();
//     };
//   }, []);

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <AppNavigator/>
//         </PersistGate>
//       </Provider>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({});

// export default App;