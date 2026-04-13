/**
 * Shared location permission + first fix for react-native-geolocation-service.
 */
import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

/**
 * Android: use OS LocationManager instead of Google Play Fused API — avoids
 * "Could not invoke RNFusedLocation.getCurrentPosition" / null map bugs on
 * emulators and devices where Fused fails.
 */
const androidLocationManager = Platform.OS === 'android' && {
  forceLocationManager: true,
};

const highAccuracyOnce = {
  ...(androidLocationManager || {}),
  enableHighAccuracy: true,
  timeout: 20000,
  maximumAge: 0,
  showLocationDialog: true,
  forceRequestLocation: true,
};

const balancedOnce = {
  ...(androidLocationManager || {}),
  enableHighAccuracy: false,
  timeout: 25000,
  maximumAge: 60000,
  showLocationDialog: true,
  forceRequestLocation: true,
};

export const defaultWatchOptions = {
  ...(androidLocationManager || {}),
  enableHighAccuracy: false,
  distanceFilter: 5,
  interval: 5000,
  fastestInterval: 2000,
  showLocationDialog: true,
};

export async function ensureAndroidLocationPermission() {
  if (Platform.OS !== 'android') {
    return true;
  }
  const results = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  ]);
  const fine = results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];
  const coarse = results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION];
  return (
    fine === PermissionsAndroid.RESULTS.GRANTED ||
    coarse === PermissionsAndroid.RESULTS.GRANTED
  );
}

export async function ensureIosLocationAuthorization() {
  if (Platform.OS !== 'ios') {
    return true;
  }
  try {
    const result = await Geolocation.requestAuthorization('whenInUse');
    return result === 'granted';
  } catch {
    return false;
  }
}

/**
 * One-shot position (GPS then network-style fallback). No UI alerts.
 * On Android skips getCurrentPosition if you only need updates — callers use watch too.
 */
export function getCurrentPositionWithFallback(success, options) {
  const extra =
    options != null && typeof options === 'object' ? options : {};

  const onFailHigh = () => {
    Geolocation.getCurrentPosition(
      success,
      err => {
        if (__DEV__) {
          console.warn('Geolocation:', err?.code, err?.message);
        }
      },
      {...balancedOnce, ...extra},
    );
  };

  Geolocation.getCurrentPosition(success, onFailHigh, {
    ...highAccuracyOnce,
    ...extra,
  });
}
