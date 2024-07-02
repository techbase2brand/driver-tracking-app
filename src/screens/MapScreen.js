


// import React, { useEffect, useState, useRef } from 'react';
// import { View, StyleSheet, Alert } from 'react-native';
// import MapView, { Marker, Polyline, AnimatedRegion } from 'react-native-maps';

// const driversInitialState = {
//   driver1: {
//     id: 'driver1',
//     latitude: 37.78825,
//     longitude: -122.4324,
//     pickupLatitude: 37.78825,
//     pickupLongitude: -122.4324,
//     destinationLatitude: 37.79825,
//     destinationLongitude: -122.4424,
//   },
//   driver2: {
//     id: 'driver2',
//     latitude: 37.78845,
//     longitude: -122.4344,
//     pickupLatitude: 37.78845,
//     pickupLongitude: -122.4344,
//     destinationLatitude: 37.79845,
//     destinationLongitude: -122.4444,
//   },
// };

// const MapScreen = ({ route }) => {
//   const { driverId } = route.params;
//   const [driver, setDriver] = useState(driversInitialState[driverId]);
//   const [routeCoordinates, setRouteCoordinates] = useState([]);
//   const [routeFetched, setRouteFetched] = useState(false);
  
//   const markerRef = useRef(null);
//   const initialRegion = {
//     latitude: driver.latitude,
//     longitude: driver.longitude,
//     latitudeDelta: 0.0922,
//     longitudeDelta: 0.0421,
//   };

//   const [coordinate] = useState(
//     new AnimatedRegion({
//       latitude: driver.latitude,
//       longitude: driver.longitude,
//       latitudeDelta: 0,
//       longitudeDelta: 0,
//     })
//   );

//   useEffect(() => {
//     const fetchRouteAndMoveDriver = async () => {
//       try {
//         const response = await fetch(
//           `https://maps.googleapis.com/maps/api/directions/json?origin=${driver.latitude},${driver.longitude}&destination=${driver.destinationLatitude},${driver.destinationLongitude}&key=AIzaSyAZCbN0MqbENktC0BQbGEJjI5E9wWoHCBE`,
//         );
//         const data = await response.json();
//         console.log('datata', data);
//         if (data.routes && data.routes.length > 0) {
//           const route = data.routes[0];
//           const steps = route.legs[0].steps;
//           const coordinates = steps.flatMap(step => [
//             {
//               latitude: step.start_location.lat,
//               longitude: step.start_location.lng,
//             },
//             {latitude: step.end_location.lat, longitude: step.end_location.lng},
//           ]);
//           setRouteCoordinates(coordinates);
//           console.log('Route fetched:', coordinates); // Debug log for route fetching
//         } else {
//           console.log('No routes found, using sample route.');
//         }

//         setRouteFetched(true);
//       } catch (error) {
//         console.error('Error fetching route:', error);
//         console.log('Using sample route.');
//         setRouteFetched(true);
//       }
//     };

//     fetchRouteAndMoveDriver();
//   }, []);

//   useEffect(() => {
//     let intervalId;
//     if (routeFetched && routeCoordinates.length > 0) {
//       let index = 0;
//       intervalId = setInterval(() => {
//         if (index < routeCoordinates.length) {
//           const { latitude, longitude } = routeCoordinates[index];
//           index++;
//           const newCoordinate = { latitude, longitude };
//           if (markerRef.current) {
//             coordinate.timing(newCoordinate, { 
//               duration: 2000,
//               useNativeDriver: false
//             }).start();
//           }
//         } else {
//           clearInterval(intervalId);
//           Alert.alert('Driver has reached the destination');
//         }
//       }, 800);
//     }

//     return () => clearInterval(intervalId);
//   }, [routeFetched, routeCoordinates]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={{ flex: 1 }}
//         initialRegion={initialRegion}
//       >
//         <Marker.Animated
//           ref={markerRef}
//           coordinate={coordinate}
//           title="Current Location"
//           pinColor="blue"
//         />
//         <Marker
//           coordinate={{ latitude: driver.pickupLatitude, longitude: driver.pickupLongitude }}
//           title="Pickup Location"
//           pinColor="green"
//         />
//         <Marker
//           coordinate={{
//             latitude: driver.destinationLatitude,
//             longitude: driver.destinationLongitude,
//           }}
//           title="Destination"
//           pinColor="red"
//         />
//         {routeCoordinates.length > 0 && (
//           <Polyline
//             coordinates={routeCoordinates}
//             strokeWidth={3}
//             strokeColor="hotpink"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default MapScreen;


// import React, {useState, useEffect, useRef} from 'react';
// import {
//   StyleSheet,
//   View,
//   Dimensions,
//   PermissionsAndroid,
//   Platform,
//   Alert,
//   Text,
// } from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import MapViewDirections from 'react-native-maps-directions';
// import Geolocation from 'react-native-geolocation-service';

// const {width, height} = Dimensions.get('window');
// const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const DESTINATION = {latitude: 30.7333, longitude: 76.7794};
// const GOOGLE_MAPS_APIKEY = 'AIzaSyAZCbN0MqbENktC0BQbGEJjI5E9wWoHCBE';


// export default function MapScreen() {
//   const mapRef = useRef();
//   const [CalDistance, setCalDistance] = useState()
//   const [pickup, setPickup] = useState({
//     latitude: 30.7046,
//     longitude: 76.7179,
//     latitudeDelta: LATITUDE_DELTA,
//     longitudeDelta: LONGITUDE_DELTA,
//   });
//   console.log('pickup>>>>>', pickup);
  
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
//   console.log("distance",distance);
//   setCalDistance(distance.toFixed(1))
//   return distance;
// };
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
//           // console.log("position >>", position);
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
//           interval: 20000,
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
//           strokeColor="black"
//           optimizeWaypoints={true}
//           onReady={result => {
//             // console.log('Directions ready', result);
//             if (mapRef.current) {
//               mapRef.current.fitToCoordinates(result.coordinates, {
//                 edgePadding: {
//                   right: 40,
//                   bottom: 300,
//                   left: 30,
//                   top: 150,
//                 },
//               });
//             } else {
//               console.warn('Map reference is not set');
//             }
//           }}
//           onError={errorMessage => {
//             console.error('Directions error: ', errorMessage);
//           }}
//         />
//       </MapView>
//       <View style={styles.distanceContainer}>
//         <Text style={{color:"black"}}>Distance to destination: {CalDistance} km</Text>
//       </View>
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
//   distanceContainer: {
//     position: 'absolute',
//     bottom: 50,
//     backgroundColor: 'white',
//     padding: 10,
//     borderRadius: 5,
//   },
// });

import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

const driversInitialState = {
  driver1: {
    id: 'driver1',
    latitude: 37.78825,
    longitude: -122.4324,
    pickupLatitude: 37.78825,
    pickupLongitude: -122.4324,
    destinationLatitude: 37.79825,
    destinationLongitude: -122.4424,
  },
  driver2: {
    id: 'driver2',
    latitude: 37.78845,
    longitude: -122.4344,
    pickupLatitude: 37.78845,
    pickupLongitude: -122.4344,
    destinationLatitude: 37.79845,
    destinationLongitude: -122.4444,
  },
};

const MapScreen = ({ route }) => {
  const { driverId } = route.params;
  const [driver, setDriver] = useState(driversInitialState[driverId]);
  const [routeFetched, setRouteFetched] = useState(false);
  
  const markerRef = useRef(null);
  const initialRegion = {
    latitude: driver.latitude,
    longitude: driver.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const [coordinate] = useState(
    new AnimatedRegion({
      latitude: driver.latitude,
      longitude: driver.longitude,
      latitudeDelta: 0,
      longitudeDelta: 0,
    })
  );

  useEffect(() => {
    setRouteFetched(true);
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={initialRegion}
      >
        <MapViewDirections
          origin={{ latitude: driver.latitude, longitude: driver.longitude }}
          destination={{
            latitude: driver.destinationLatitude,
            longitude: driver.destinationLongitude,
          }}
          apikey={"AIzaSyAZCbN0MqbENktC0BQbGEJjI5E9wWoHCBE"}
          strokeWidth={3}
          strokeColor="black"
          onReady={(result) => {
            const { coordinates } = result;
            let index = 0;
            const interval = setInterval(() => {
              if (index < coordinates.length) {
                const { latitude, longitude } = coordinates[index];
                index++;
                const newCoordinate = { latitude, longitude };
                if (markerRef.current) {
                  coordinate.timing(newCoordinate, {
                    duration: 2000,
                    useNativeDriver: false,
                  }).start();
                }
              } else {
                clearInterval(interval);
                Alert.alert('Driver has reached the destination');
              }
            }, 1000);
          }}
        />
        <Marker.Animated
          ref={markerRef}
          coordinate={coordinate}
          title="Current Location"
          pinColor="blue"
        />
        <Marker
          coordinate={{
            latitude: driver.pickupLatitude,
            longitude: driver.pickupLongitude,
          }}
          title="Pickup Location"
          pinColor="green"
        />
        <Marker
          coordinate={{
            latitude: driver.destinationLatitude,
            longitude: driver.destinationLongitude,
          }}
          title="Destination"
          pinColor="red"
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MapScreen;


