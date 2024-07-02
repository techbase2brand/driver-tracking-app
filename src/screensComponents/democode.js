// import React, {useState} from 'react';
// import { StyleSheet, View, Dimensions } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE = 37.78825;
// const LONGITUDE = -122.4324;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const ORIGIN = { latitude: 37.78825, longitude: -122.4324 };
// const DESTINATION = { latitude: 37.75825, longitude: -122.4624 };

// const GOOGLE_MAPS_APIKEY = 'AIzaSyBowQXvvl-ibJ1f6eoFHSeYA6NV3xFlrmI';

// export default function HomeScreen() {
//     const [state, setState] = useState({
//         pickup:{
//             latitude: 30.7046, longitude: 76.7179,
//             latitudeDelta :0.0922, longitudeDelta:0.0421
//         },
//         dropcord:{
//             latitude: 30.7333, longitude: 76.7794,
//             latitudeDelta :0.0922, longitudeDelta:0.0421
//         }
//     })
//     const {pickup, dropcord} = state
//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         // initialRegion={{
//         //   latitude: LATITUDE,
//         //   longitude: LONGITUDE,
//         //   latitudeDelta: LATITUDE_DELTA,
//         //   longitudeDelta: LONGITUDE_DELTA,
//         // }}
//         initialRegion={pickup}
//       >
//         <Marker coordinate={pickup} title="Origin" />
//         <Marker coordinate={dropcord} title="Destination" />
//         <MapViewDirections
//         //   origin={ORIGIN}
//         //   destination={DESTINATION}
//         origin={pickup}
//           destination={dropcord}
//           apikey={GOOGLE_MAPS_APIKEY}
//           strokeWidth={3}
//           strokeColor="hotpink"
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: width,
//     height: height,
//   },
// });

// import React, { useState, useEffect } from 'react';
// import { StyleSheet, View, Dimensions, PermissionsAndroid, Platform, Alert } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from 'react-native-geolocation-service';

// const { width, height } = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const DESTINATION = { latitude: 30.7333, longitude: 76.7794 };
// const GOOGLE_MAPS_APIKEY = 'AIzaSyBowQXvvl-ibJ1f6eoFHSeYA6NV3xFlrmI';

// export default function HomeScreen() {
//   const [pickup, setPickup] = useState({
//     latitude: 30.7046,
//     longitude: 76.7179,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });

//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Permission',
//               message: 'We need access to your location to show your position on the map.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//           );
//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             Alert.alert('Location permission denied');
//             return;
//           }
//         } catch (err) {
//           console.warn(err);
//           return;
//         }
//       }

//       Geolocation.watchPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setPickup({
//             latitude,
//             longitude,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA,
//           });
//         },
//         (error) => {
//           console.error(error);
//           Alert.alert('Error', 'Could not get your location');
//         },
//         {
//           enableHighAccuracy: true,
//           distanceFilter: 0,
//           interval: 5000,
//           fastestInterval: 2000,
//         },
//       );
//     };

//     requestLocationPermission();

//     return () => {
//       Geolocation.stopObserving();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={pickup}
//       >
//         <Marker coordinate={pickup} title="You are here" />
//         <Marker coordinate={DESTINATION} title="Destination" />
//         <MapViewDirections
//           origin={pickup}
//           destination={DESTINATION}
//           apikey={GOOGLE_MAPS_APIKEY}
//           strokeWidth={3}
//           strokeColor="hotpink"
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: width,
//     height: height,
//   },
// });

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   Alert,
// } from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from 'react-native-geolocation-service';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const DESTINATION = {latitude: 30.7333, longitude: 76.7794};
// const GOOGLE_MAPS_APIKEY = 'AIzaSyBowQXvvl-ibJ1f6eoFHSeYA6NV3xFlrmI';

// // Function to calculate distance between two coordinates
// const calculateDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Radius of the Earth in km
//   const dLat = (lat2 - lat1) * (Math.PI / 180);
//   const dLon = (lon2 - lon1) * (Math.PI / 180);
//   const a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * (Math.PI / 180)) *
//       Math.cos(lat2 * (Math.PI / 180)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   const distance = R * c; // Distance in km
//   return distance;
// };

// export default function HomeScreen() {
//   const mapRef = useRef();
//   const [pickup, setPickup] = useState({
//     latitude: 30.7046,
//     longitude: 76.7179,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });
//   console.log('pickup>>>>>', pickup);
//   useEffect(() => {
//     const requestLocationPermission = async () => {
//       if (Platform.OS === 'android') {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//             {
//               title: 'Location Access Permission',
//               message:
//                 'We need access to your location to show your position on the map.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//           );
//           if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             Alert.alert('Location permission denied');
//             return;
//           }
//         } catch (err) {
//           console.warn(err);
//           return;
//         }
//       }

//       Geolocation.watchPosition(
//         position => {
//           const {latitude, longitude} = position.coords;
//           setPickup({
//             latitude,
//             longitude,
//             latitudeDelta: LATITUDE_DELTA,
//             longitudeDelta: LONGITUDE_DELTA,
//           });

//           // Calculate distance between current location and destination
//           const distance = calculateDistance(
//             latitude,
//             longitude,
//             DESTINATION.latitude,
//             DESTINATION.longitude,
//           );

//           // Check if user is in current location (e.g., within 0.1 km)
//           if (distance < 0.1) {
//             Alert.alert('You are in the current location');
//           }
//         },
//         error => {
//           console.error(error);
//           Alert.alert('Error', 'Could not get your location');
//         },
//         {
//           enableHighAccuracy: true,
//           distanceFilter: 0,
//           interval: 5000,
//           fastestInterval: 2000,
//         },
//       );
//     };

//     requestLocationPermission();

//     return () => {
//       Geolocation.stopObserving();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       <MapView ref={mapRef} style={styles.map} initialRegion={pickup}>
//         <Marker coordinate={pickup} title="You are here" />
//         <Marker coordinate={DESTINATION} title="Destination" />
//         <MapViewDirections
//           origin={pickup}
//           destination={DESTINATION}
//           apikey={GOOGLE_MAPS_APIKEY}
//           strokeWidth={3}
//           strokeColor="hotpink"
//           optimizeWaypoints={true}
//           onReady={result => {
//             mapRef.current.fitToCoordinates(result.coordinates, {
//               edgePadding: {
//                 right: 40,
//                 bottom: 300,
//                 left: 30,
//                 top: 150,
//               },
//             });
//           }}
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   map: {
//     width: width,
//     height: height,
//   },
// });


import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DESTINATION = {latitude: 30.7333, longitude: 76.7794};
const GOOGLE_MAPS_APIKEY = 'AIzaSyBowQXvvl-ibJ1f6eoFHSeYA6NV3xFlrmI';

// Function to calculate distance between two coordinates
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
  const distance = R * c; // Distance in km
  return distance;
};

export default function HomeScreen() {
  const mapRef = useRef();
  const [pickup, setPickup] = useState({
    latitude: 30.7046,
    longitude: 76.7179,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  console.log('pickup>>>>>', pickup);
  
  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Permission',
              message:
                'We need access to your location to show your position on the map.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Location permission denied');
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      Geolocation.watchPosition(
        position => {
          console.log("position >>", position);
          const {latitude, longitude} = position.coords;
          setPickup({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });

          // Calculate distance between current location and destination
          const distance = calculateDistance(
            latitude,
            longitude,
            DESTINATION.latitude,
            DESTINATION.longitude,
          );

          // Check if user is in current location (e.g., within 0.1 km)
          if (distance < 0.1) {
            Alert.alert('You are in the current location');
          }
        },
        error => {
          console.error(error);
          Alert.alert('Error', 'Could not get your location');
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
        },
      );
    };

    requestLocationPermission();

    return () => {
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
          strokeColor="hotpink"
          optimizeWaypoints={true}
          onReady={result => {
            console.log('Directions ready', result);
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
});
