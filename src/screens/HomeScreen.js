import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  FlatList,
  Linking,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import Button from '../shared/Button';
import OrderStatus from '../screensComponents/OrderStatus';
import {BACKEND_URL, statuses, GOOGLE_MAPS_APIKEY} from '../constant/Constant';
import {useSelector} from 'react-redux';

const CUSTOMER_DETAILS = {
  name: 'John Doe',
  address: '263 Main St, Springfield',
  phone: '1234567890',
  orderName: 'Order Name',
  orderId: '#123456',
  image:
    'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvb2QlMjBpbWdlc3xlbnwwfHwwfHx8MA%3D%3D',
  orderStatus: 'Ready',
};

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 2.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DESTINATION = {latitude: 30.678212, longitude: 76.667856};
// const GOOGLE_MAPS_APIKEY = 'AIzaSyAZCbN0MqbENktC0BQbGEJjI5E9wWoHCBE';

const HomeScreen = ({navigation}) => {
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
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orders, setOrders] = useState();
  const [billingAddress, setBillingAddress] = useState();

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

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/driverOrders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      console.log('data', data);
      setOrders(data);
      const billingAddress = JSON.parse(
        data?.getorderCreateData?.[0]?.billing_address,
      );
      setBillingAddress(billingAddress);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
          const {latitude, longitude} = position.coords;
          setPickup({
            latitude,
            longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });

          // sendLocationToBackend({latitude, longitude});

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
          interval: 40000,
          fastestInterval: 2000,
        },
      );
    };

    requestLocationPermission();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);

  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${DESTINATION.latitude},${DESTINATION.longitude}&travelmode=driving`;
    Linking.openURL(url);
  };

  const openDialPad = value => {
    console.log('value', value);

    const telUrl = `tel:${value}`;
    console.log('openDialPad', telUrl);
    Linking.openURL(telUrl);
  };
  const handleSubmit = () => {
    if (selectedStatus) {
      // Prepare the request body
      const requestBody = {
        status: selectedStatus,
        trackingUrl: 'https://google.com',
        trackingNumber: 123312423433,
        orderId: orders?.getorderCreateData?.[0]?.orderCreateData_id,
      };
      // Make the API call
      fetch(`${BACKEND_URL}/api/deliveryStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', data);
          Alert.alert('Success', 'Status updated successfully.');
        })
        .catch(error => {
          console.error('Error updating status:', error);
        });

      setSelectedStatus('');
    } else {
      Alert.alert('Error', 'Please select a status.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Map Section */}
      <View style={{height: 300, borderRadius: 20}}>
        <MapView initialRegion={pickup} ref={mapRef} style={styles.map}>
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
                    top: 250,
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
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => navigation.navigate('DriverScreen')}>
          <MaterialIcons name={'directions'} size={50} color={'black'} />
        </TouchableOpacity>
      </View>

      {/* Order Sections */}
      <View style={styles.ordersSection}>
        <View style={styles.orderContainer}>
          <Image
            source={{uri: CUSTOMER_DETAILS.image}}
            style={styles.foodImage}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '76%',
            }}>
            <View>
              <Text style={styles.orderName}>
                {CUSTOMER_DETAILS?.orderName}
              </Text>
              <Text style={{}}>
                {orders?.getorderCreateData?.[0]?.orderCreateData_id}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  borderRadius: 100,
                  height: 50,
                  width: 50,
                  padding: 10,
                  backgroundColor: '#FBBC05',
                },
              ]}
              onPress={() => openDialPad(billingAddress?.phone)}>
              <AntDesign
                name={'phone'}
                size={30}
                color={'white'}
                style={{transform: [{rotate: '100deg'}]}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.infoRow}>
            <Icon name="time-outline" size={30} color="#FFBF00" />
            <View>
              <Text style={styles.infoText}>Your Delivery Time</Text>
              <Text
                style={[styles.infoText, {fontWeight: '500', fontSize: 16}]}>
                Estimated 8:30 - 9:15 PM
              </Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <Icon name="location-outline" size={35} color="#FFBF00" />
            <View>
              <Text style={styles.infoText}>Your Delivery Address</Text>
              <Text
                style={[styles.infoText, {fontWeight: '500', fontSize: 16}]}>
                {billingAddress?.address1}
              </Text>
            </View>
          </View>
        </View>
        <Image
          source={require('../assests/dotImg.png')}
          style={styles.dotImg}
          resizeMode="contain"
        />

        <OrderStatus
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          statuses={statuses}
        />
        <Button onloginClick={handleSubmit} title="Submit" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    height: 300,
    width: '100%',
  },
  directionsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 5,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 4,
    color: 'black',
    marginTop: 10,
  },
  orderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  foodImage: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  orderName: {
    // flex: 1,
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  driverItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  detailsContainer: {
    flex: 2,
  },
  orderName: {
    fontSize: 22,
    fontWeight: '600',
  },
  orderId: {
    fontSize: 18,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 14,
  },
  dotImg: {
    width: 50,
    height: 50,
    position: 'absolute',
    left: -9,
    top: 137,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: '800',
  },
});

export default HomeScreen;
