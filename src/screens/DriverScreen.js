import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Dimensions, Platform, Alert, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import {
  API_BASE_URL,
  GOOGLE_MAPS_APIKEY,
  // USE_STATIC_DEMO_MODE,
  // STATIC_DEMO_DESTINATION,
} from '../constant/Constant';
import {useSelector} from 'react-redux';
import {
  ensureAndroidLocationPermission,
  ensureIosLocationAuthorization,
  getCurrentPositionWithFallback,
  defaultWatchOptions,
} from '../utils/locationHelpers';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 2.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DESTINATION = {
  // latitude: STATIC_DEMO_DESTINATION.latitude,
  // longitude: STATIC_DEMO_DESTINATION.longitude,
  latitude: 30.678212,
  longitude: 76.667856,
};

export default function DriverScreen() {
  const mapRef = useRef();
  const email = useSelector(state => state?.email?.driver?.email);
  const [CalDistance, setCalDistance] = useState();
  const [CalDuration, setCalDuration] = useState();

  const [pickup, setPickup] = useState({
    latitude: 30.7046,
    longitude: 76.7179,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const nearbyAlertSent = useRef(false);
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const sendDriverLocation = async (currentLat, currentLng) => {
    try {
      const response = await fetch(`${API_BASE_URL}/driverInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          departure_latlang: "24.2353432 , 86.1375645",
          current_latlang: `${currentLat}, ${currentLng}`,
          destination_latlang: "24.2353432 , 88.1375645",
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send location');
      }

      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error sending location:', error);
    }
  };
  useEffect(() => {
    let watchId;

    const requestLocationPermission = async () => {
      try {
        const androidOk = await ensureAndroidLocationPermission();
        if (Platform.OS === 'android' && !androidOk) {
          if (__DEV__) {
            console.warn('Location permission not granted');
          }
          return;
        }
        const iosOk = await ensureIosLocationAuthorization();
        if (Platform.OS === 'ios' && !iosOk) {
          if (__DEV__) {
            console.warn('Location when-in-use not granted');
          }
          return;
        }
      } catch (e) {
        if (__DEV__) {
          console.warn('Location permission:', e);
        }
        return;
      }

      const applyPosition = position => {
        const {latitude, longitude} = position.coords;
        setPickup({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        const distance = calculateDistance(
          latitude,
          longitude,
          DESTINATION.latitude,
          DESTINATION.longitude,
        );

        // if (!USE_STATIC_DEMO_MODE) {
        //   sendDriverLocation(latitude, longitude);
        // }
        sendDriverLocation(latitude, longitude);
        if (distance < 0.1 && !nearbyAlertSent.current) {
          nearbyAlertSent.current = true;
          Alert.alert('You are near the destination');
        }
      };

      if (Platform.OS === 'ios') {
        getCurrentPositionWithFallback(applyPosition);
      }
      watchId = Geolocation.watchPosition(
        applyPosition,
        err => {
          if (__DEV__) {
            console.warn('Geolocation watch:', err?.code, err?.message);
          }
        },
        defaultWatchOptions,
      );
    };
    requestLocationPermission();
    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
      }
      Geolocation.stopObserving();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} initialRegion={pickup}>
        <Marker coordinate={pickup} title="You are here" />
        <Marker coordinate={DESTINATION} title="Destination" />
        <MapViewDirections
          origin={pickup}
          destination={DESTINATION}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={3}
          strokeColor="black"
          optimizeWaypoints={true}
          onReady={result => {
            console.log('Directions distance', result.distance);
            console.log('Directions duration', result.duration.toFixed(1));
            setCalDistance(result.distance.toFixed(1));
            setCalDuration(result.duration.toFixed(1));
            if (mapRef.current) {
              mapRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: 40,
                  bottom: 300,
                  left: 30,
                  top: 150,
                },
              });
            } else {
              console.warn('Map reference is not set');
            }
          }}
          onError={errorMessage => {
            console.error('Directions error: ', errorMessage);
          }}
        />
      </MapView>
      <View style={styles.distanceContainer}>
        <Text style={{color: 'black', fontWeight: 800}}>
          Distance to destination: {CalDistance} km
        </Text>
        <Text style={{color: 'black', fontWeight: 800}}>
          Time: {CalDuration} min
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  distanceContainer: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});
