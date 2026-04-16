import { AppRegistry } from 'react-native';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { name as appName } from './app.json';

let badgeCount = 0;

// 📩 Background + Killed state handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background/Killed message:', remoteMessage);

  badgeCount++;

  await notifee.setBadgeCount(badgeCount);
});

AppRegistry.registerComponent(appName, () => App);
