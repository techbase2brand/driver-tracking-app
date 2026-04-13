import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  Linking,
  Alert,
  Platform,
  InteractionManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation from 'react-native-geolocation-service';
import Button from '../shared/Button';
import OrderStatus from '../screensComponents/OrderStatus';
import {
  BACKEND_URL,
  statuses,
  GOOGLE_MAPS_APIKEY,
  USE_STATIC_DEMO_MODE,
  STATIC_DEMO_DESTINATION,
  STATIC_DEMO_ORDERS_RESPONSE,
} from '../constant/Constant';
import {useSelector} from 'react-redux';
import {
  ensureAndroidLocationPermission,
  ensureIosLocationAuthorization,
  getCurrentPositionWithFallback,
  defaultWatchOptions,
} from '../utils/locationHelpers';

const CUSTOMER_DETAILS = {
  name: 'John Doe',
  address: '263 Main St, Springfield',
  phone: '1234567890',
  orderName: 'Demo order',
  orderId: '#123456',
  image:
    'https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGZvb2QlMjBpbWdlc3xlbnwwfHwwfHx8MA%3D%3D',
  orderStatus: 'Ready',
};

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 2.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const DESTINATION = {
  latitude: STATIC_DEMO_DESTINATION.latitude,
  longitude: STATIC_DEMO_DESTINATION.longitude,
};

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
  const [mapReady, setMapReady] = useState(false);
  const [statusSubmitError, setStatusSubmitError] = useState('');

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
    if (USE_STATIC_DEMO_MODE) {
      const data = STATIC_DEMO_ORDERS_RESPONSE;
      setOrders(data);
      try {
        const billing = JSON.parse(
          data?.getorderCreateData?.[0]?.billing_address,
        );
        setBillingAddress(billing);
      } catch (e) {
        console.error('Static billing parse:', e);
      }
      return;
    }

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
  }, [email]);

  useEffect(() => {
    if (selectedStatus) {
      setStatusSubmitError('');
    }
  }, [selectedStatus]);

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

      const nearbyAlertSent = {current: false};

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
        if (distance < 0.1 && !nearbyAlertSent.current) {
          nearbyAlertSent.current = true;
          Alert.alert('You are near the destination');
        }
      };

      const startWatching = () => {
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

      const runWatch = () => {
        if (Platform.OS === 'android') {
          setTimeout(startWatching, 400);
        } else {
          startWatching();
        }
      };
      InteractionManager.runAfterInteractions(runWatch);
    };

    requestLocationPermission();

    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
      }
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
      setStatusSubmitError('');
      if (USE_STATIC_DEMO_MODE) {
        if (__DEV__) {
          console.log('deliveryStatus (local)', {
            status: selectedStatus,
            orderId: orders?.getorderCreateData?.[0]?.orderCreateData_id,
          });
        }
        Alert.alert('Success', 'Status updated successfully.');
        setSelectedStatus('');
        return;
      }

      const requestBody = {
        status: selectedStatus,
        trackingUrl: 'https://google.com',
        trackingNumber: 123312423433,
        orderId: orders?.getorderCreateData?.[0]?.orderCreateData_id,
      };
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
      setStatusSubmitError('Please select a status first.');
    }
  };

  const pickupLatLng = {
    latitude: pickup.latitude,
    longitude: pickup.longitude,
  };

  return (
    <View style={styles.screenRoot}>
      <View style={styles.mapSection}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          initialRegion={pickup}
          ref={mapRef}
          style={styles.map}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          onMapReady={() => setMapReady(true)}>
          <Marker coordinate={pickupLatLng} title="You are here" />
          <Marker
            coordinate={DESTINATION}
            title="Destination"
            description={STATIC_DEMO_DESTINATION.addressLabel}
          />
          {mapReady ? (
            <MapViewDirections
              origin={pickupLatLng}
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
          ) : null}
        </MapView>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={() => navigation.navigate('DriverScreen')}>
          <MaterialIcons name={'directions'} size={50} color={'black'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.ordersScroll}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.ordersScrollContent}>
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
        {statusSubmitError ? (
          <Text style={styles.statusSubmitError}>{statusSubmitError}</Text>
        ) : null}
        <Button onloginClick={handleSubmit} title="Submit" />
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    padding: 10,
  },
  mapSection: {
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
  },
  ordersScroll: {
    flex: 1,
  },
  ordersScrollContent: {
    paddingBottom: 32,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
  statusSubmitError: {
    color: '#c62828',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    marginHorizontal: 4,
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
