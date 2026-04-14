import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
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
import {API_BASE_URL, statuses, GOOGLE_MAPS_APIKEY} from '../constant/Constant';
import {useSelector} from 'react-redux';
import {
  ensureAndroidLocationPermission,
  ensureIosLocationAuthorization,
  getCurrentPositionWithFallback,
  defaultWatchOptions,
} from '../utils/locationHelpers';
import {useFocusEffect} from '@react-navigation/native';



const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 2.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const toNumber = value => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

const hasLatLng = point =>
  Boolean(
    point &&
      Number.isFinite(Number(point.latitude)) &&
      Number.isFinite(Number(point.longitude)),
  );

const toMapRegion = point => ({
  latitude: Number(point.latitude),
  longitude: Number(point.longitude),
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
});

const resolveOrderAddress = billingAddress => {
  if (!billingAddress || typeof billingAddress !== 'object') {
    return '';
  }
  const primaryKeys = [
    'address1',
    'address_1',
    'address',
    'full_address',
    'line1',
    'street',
  ];
  for (const key of primaryKeys) {
    const value = billingAddress[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }

  const combined = [
    billingAddress.line2,
    billingAddress.address2,
    billingAddress.city,
    billingAddress.state,
    billingAddress.postcode,
    billingAddress.zip,
    billingAddress.country,
  ]
    .filter(part => typeof part === 'string' && part.trim())
    .map(part => part.trim())
    .join(', ');

  return combined;
};

const resolveOrderPhone = billingAddress => {
  if (!billingAddress || typeof billingAddress !== 'object') {
    return '';
  }
  const phoneKeys = ['phone', 'mobile', 'contact', 'contact_no', 'telephone'];
  for (const key of phoneKeys) {
    const value = billingAddress[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const HomeScreen = ({navigation, route}) => {
  const mapRef = useRef();
  const email = useSelector(state => state?.email?.driver?.email);
  const [pickup, setPickup] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orders, setOrders] = useState();
  const [mapReady, setMapReady] = useState(false);
  const [statusSubmitError, setStatusSubmitError] = useState('');
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [geocodedByAddress, setGeocodedByAddress] = useState({});
  const [statusTargetOrderId, setStatusTargetOrderId] = useState(null);
  const [deliveryEtaText, setDeliveryEtaText] = useState('Calculating...');
  const [deliveryProofModalVisible, setDeliveryProofModalVisible] =
    useState(false);
  const [deliveryProofUri, setDeliveryProofUri] = useState(null);
  const [deliveryProofBase64, setDeliveryProofBase64] = useState(null);
  const [deliveryProofMimeType, setDeliveryProofMimeType] = useState(null);

  const handleDeliveryProofChange = payload => {
    if (payload == null) {
      setDeliveryProofUri(null);
      setDeliveryProofBase64(null);
      setDeliveryProofMimeType(null);
      return;
    }
    setDeliveryProofUri(payload.uri);
    setDeliveryProofBase64(payload.base64);
    setDeliveryProofMimeType(payload.mimeType || 'image/jpeg');
  };

  useEffect(() => {
    if (selectedStatus !== 'DELIVERED') {
      setDeliveryProofUri(null);
      setDeliveryProofBase64(null);
      setDeliveryProofMimeType(null);
      setDeliveryProofModalVisible(false);
    }
  }, [selectedStatus]);

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

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/driverOrders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });
      const data = await response.json();
      console.log('Home orders API status:', response.status);
      console.log('Home orders API response:', data);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  useEffect(() => {
    setCurrentOrderIndex(0);
  }, [selectedOrderIds]);

  useEffect(() => {
    if (Array.isArray(route?.params?.plannedOrderIds)) {
      setSelectedOrderIds(route.params.plannedOrderIds);
      setCurrentOrderIndex(0);
      setSelectedStatus('');
      setStatusSubmitError('');
      setStatusTargetOrderId(null);
    }
  }, [route?.params?.plannedOrderIds]);

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

        const activeTarget = currentOrder?.destination;
        if (hasLatLng(activeTarget)) {
          const distance = calculateDistance(
            latitude,
            longitude,
            activeTarget.latitude,
            activeTarget.longitude,
          );
          if (distance < 0.1 && !nearbyAlertSent.current) {
            nearbyAlertSent.current = true;
            Alert.alert('You are near the destination');
          }
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
  }, [currentOrder]);

  const openDialPad = value => {
    console.log('value', value);

    const telUrl = `tel:${value}`;
    console.log('openDialPad', telUrl);
    Linking.openURL(telUrl);
  };

  const parsedOrders = (orders?.getorderCreateData || []).map(order => {
    let parsedBillingAddress = {};
    try {
      parsedBillingAddress = JSON.parse(order?.billing_address || '{}');
    } catch (error) {
      parsedBillingAddress = {};
    }
    const normalizedAddress = resolveOrderAddress(parsedBillingAddress);
    const geocodedCoordinate = geocodedByAddress[normalizedAddress];
    return {
      ...order,
      billingAddress: parsedBillingAddress,
      resolvedAddress: normalizedAddress,
      destination: {
        latitude:
          geocodedCoordinate?.latitude ||
          toNumber(order?.latitude) ||
          toNumber(order?.lat) ||
          toNumber(parsedBillingAddress?.latitude) ||
          toNumber(parsedBillingAddress?.lat),
        longitude:
          geocodedCoordinate?.longitude ||
          toNumber(order?.longitude) ||
          toNumber(order?.lng) ||
          toNumber(parsedBillingAddress?.longitude) ||
          toNumber(parsedBillingAddress?.lng),
      },
    };
  });

  useEffect(() => {
    const ordersList = orders?.getorderCreateData || [];
    const uniqueAddresses = [
      ...new Set(
        ordersList
          .map(order => {
            try {
              const billing = JSON.parse(order?.billing_address || '{}');
              return resolveOrderAddress(billing);
            } catch (error) {
              return '';
            }
          })
          .filter(Boolean),
      ),
    ];

    const pendingAddresses = uniqueAddresses.filter(
      address => !geocodedByAddress[address],
    );
    if (!pendingAddresses.length) {
      return;
    }

    let cancelled = false;

    const geocodeAddresses = async () => {
      for (const address of pendingAddresses) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address,
            )}&key=${GOOGLE_MAPS_APIKEY}`,
          );
          const data = await response.json();
          const location = data?.results?.[0]?.geometry?.location;
          if (!cancelled && location?.lat && location?.lng) {
            setGeocodedByAddress(prev => ({
              ...prev,
              [address]: {
                latitude: Number(location.lat),
                longitude: Number(location.lng),
              },
            }));
          }
        } catch (error) {
          if (__DEV__) {
            console.warn('Address geocoding failed:', address, error?.message);
          }
        }
      }
    };

    geocodeAddresses();

    return () => {
      cancelled = true;
    };
  }, [orders, geocodedByAddress]);

  const selectedOrders = parsedOrders.filter(
    order => selectedOrderIds.includes(order?.id) && hasLatLng(order?.destination),
  );

  const sortNearestFirst = ordersList => {
    if (ordersList.length <= 1) {
      return ordersList;
    }
    if (!hasLatLng(pickup)) {
      return ordersList;
    }
    const remaining = [...ordersList];
    const sorted = [];
    let fromPoint = {
      latitude: pickup.latitude,
      longitude: pickup.longitude,
    };

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Number.MAX_VALUE;
      remaining.forEach((order, index) => {
        const distance = calculateDistance(
          fromPoint.latitude,
          fromPoint.longitude,
          order.destination.latitude,
          order.destination.longitude,
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });
      const nearest = remaining.splice(nearestIndex, 1)[0];
      sorted.push(nearest);
      fromPoint = nearest.destination;
    }

    return sorted;
  };

  const routeOrders = sortNearestFirst(selectedOrders);
  const boundedCurrentOrderIndex =
    routeOrders.length > 0
      ? Math.min(currentOrderIndex, routeOrders.length - 1)
      : 0;
  const currentOrder = routeOrders[boundedCurrentOrderIndex];
  const statusTargetOrder =
    routeOrders.find(order => order?.id === statusTargetOrderId) || null;
  const remainingRouteOrders = routeOrders.slice(boundedCurrentOrderIndex);
  /** One leg at a time: path only to the active (first remaining) stop — not full multi-waypoint route */
  const activeLegDestination = currentOrder?.destination || null;

  useEffect(() => {
    if (!activeLegDestination) {
      setDeliveryEtaText('No active route');
    }
  }, [activeLegDestination]);

  const zoomToPickupMarker = useCallback(() => {
    if (!pickupLatLng || !mapRef.current) {
      return;
    }
    mapRef.current.animateToRegion(
      {
        latitude: pickupLatLng.latitude,
        longitude: pickupLatLng.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      450,
    );
  }, [pickupLatLng]);

  const openRoutePlanner = () => {
    if (!hasLatLng(pickup)) {
      Alert.alert('Location unavailable', 'Wait for GPS location and try again.');
      return;
    }
    navigation.navigate('RoutePlannerScreen', {
      orders: parsedOrders,
      pickup: pickupLatLng,
      selectedOrderIds,
    });
  };

  useEffect(() => {
    if (
      statusTargetOrderId &&
      !routeOrders.some(order => order?.id === statusTargetOrderId)
    ) {
      setStatusTargetOrderId(null);
      setSelectedStatus('');
    }
  }, [routeOrders, statusTargetOrderId, selectedStatus]);

  const moveToNextStop = completedOrderId => {
    const completedIndex = routeOrders.findIndex(order => order?.id === completedOrderId);
    const remainingCount = Math.max(routeOrders.length - 1, 0);

    setSelectedOrderIds(prev => prev.filter(id => id !== completedOrderId));
    setStatusTargetOrderId(null);
    setSelectedStatus('');

    if (remainingCount === 0) {
      Alert.alert('Success', 'All selected orders are updated.');
      setCurrentOrderIndex(0);
      return;
    }

    setCurrentOrderIndex(prev => {
      if (completedIndex === -1) {
        return prev;
      }
      if (completedIndex < prev) {
        return Math.max(prev - 1, 0);
      }
      if (completedIndex === prev) {
        return prev;
      }
      return prev;
    });
    Alert.alert('Success', 'Order updated. Moving to next selected order.');
  };

  const openPlannedMap = () => {
    if (!hasLatLng(pickup)) {
      Alert.alert('Location unavailable', 'Wait for GPS location and try again.');
      return;
    }
    navigation.navigate('MapScreen', {
      pickup: pickupLatLng,
      routeOrders,
      currentOrderIndex: boundedCurrentOrderIndex,
    });
  };

  const handleSubmit = statusOverride => {
    const statusToSubmit = statusOverride || selectedStatus;
    if (!statusTargetOrder) {
      setStatusSubmitError('Select order for status update first.');
      return;
    }
    if (!currentOrder) {
      setStatusSubmitError('Please select at least one order first.');
      return;
    }
    if (statusToSubmit) {
      setStatusSubmitError('');
      if (statusToSubmit === 'DELIVERED' && !deliveryProofBase64) {
        setStatusSubmitError(
          'Take a delivery proof photo with the camera before submitting.',
        );
        return;
      }
      const requestBody = {
        status: statusToSubmit,
        trackingUrl: 'https://google.com',
        trackingNumber: 123312423433,
        orderId: statusTargetOrder?.orderCreateData_id,
      };
      if (statusToSubmit === 'DELIVERED' && deliveryProofBase64) {
        const mime = deliveryProofMimeType || 'image/jpeg';
        requestBody.proofOfDelivery = deliveryProofBase64;
        requestBody.proofOfDeliveryMimeType = mime;
        requestBody.proofOfDeliveryImageUrl = `data:${mime};base64,${deliveryProofBase64}`;
        requestBody.deliveryProofBase64 = deliveryProofBase64;
        requestBody.deliveryProofMimeType = mime;
        requestBody.deliveryProofImageUrl = `data:${mime};base64,${deliveryProofBase64}`;
      }
      console.log('deliveryStatus requestBody:', requestBody);
      fetch(`${API_BASE_URL}/deliveryStatus`, {
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
          setDeliveryProofModalVisible(false);
          setDeliveryProofUri(null);
          setDeliveryProofBase64(null);
          setDeliveryProofMimeType(null);
          if (statusToSubmit === 'DELIVERED') {
            moveToNextStop(statusTargetOrder?.id);
          } else {
            Alert.alert('Success', 'Order status updated successfully.');
          }
        })
        .catch(error => {
          console.error('Error updating status:', error);
        });
    } else {
      setStatusSubmitError('Please select a status first.');
    }
  };

  const pickupLatLng = hasLatLng(pickup)
    ? {
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      }
    : null;
  const initialMapPoint =
    pickupLatLng || activeLegDestination || remainingRouteOrders[0]?.destination;
  const mapInitialRegion = hasLatLng(initialMapPoint)
    ? toMapRegion(initialMapPoint)
    : {
        latitude: 20.5937,
        longitude: 78.9629,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
  const pickupFocusedRegion = pickupLatLng
    ? {
        latitude: pickupLatLng.latitude,
        longitude: pickupLatLng.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : mapInitialRegion;

  return (
    <View style={styles.screenRoot}>
      <Text style={styles.screenTitle}>Today's Delivery</Text>
      <View style={styles.mapSection}>
        <MapView
          provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
          region={pickupFocusedRegion}
          ref={mapRef}
          style={styles.map}
          scrollEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          onMapReady={() => setMapReady(true)}>
          {pickupLatLng ? (
            <Marker
              coordinate={pickupLatLng}
              title="You are here"
              pinColor="#FF0000"
              onPress={zoomToPickupMarker}
            />
          ) : null}
          {remainingRouteOrders.map((routeOrder, index) => (
            <Marker
              key={`${routeOrder?.id}-${index}`}
              coordinate={routeOrder.destination}
              title={
                index === 0
                  ? `Current — #${routeOrder?.orderCreateData_id || ''}`
                  : `Upcoming ${index + 1}`
              }
              description={routeOrder?.resolvedAddress || 'Address not available'}
              pinColor={index === 0 ? '#FBBC05' : '#9CA3AF'}
            />
          ))}
          {mapReady && activeLegDestination && pickupLatLng ? (
            <MapViewDirections
              key={`leg-${currentOrder?.id}-${boundedCurrentOrderIndex}`}
              origin={pickupLatLng}
              destination={activeLegDestination}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor="#111827"
              onReady={result => {
                console.log('Directions distance', result.distance);
                console.log('Directions duration', result.duration.toFixed(1));
                setDeliveryEtaText(
                  `Estimated ${Math.max(
                    1,
                    Math.round(Number(result?.duration || 0)),
                  )} min`,
                );
                if (mapRef.current) {
                  zoomToPickupMarker();
                } else {
                  console.warn('Map reference is not set');
                }
              }}
              onError={errorMessage => {
                console.error('Directions error: ', errorMessage);
                setDeliveryEtaText('Unable to estimate');
              }}
            />
          ) : null}
        </MapView>
        <TouchableOpacity
          style={styles.directionsButton}
          onPress={openPlannedMap}>
          <MaterialIcons name={'directions'} size={26} color={'#111827'} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.ordersScroll}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.ordersScrollContent}>
      <View style={styles.ordersSection}>
        <View style={styles.orderContainer}>
          <View style={styles.routePlannerHeader}>
            <View>
              <Text style={styles.orderListTitle}>Planned Route</Text>
              <Text style={styles.routePlannerSubTitle}>
                Select and optimize stops before trip
              </Text>
            </View>
            <TouchableOpacity
              style={styles.planButton}
              activeOpacity={0.85}
              onPress={openRoutePlanner}>
              <Text style={styles.planButtonText}>
                {routeOrders.length > 0 ? 'Edit Plan' : 'Plan Route'}
              </Text>
            </TouchableOpacity>
          </View>
          {routeOrders.length === 0 ? (
            <Text style={styles.emptyPlanText}>
              No route planned yet. Tap Plan Route to start.
            </Text>
          ) : null}
        </View>
        {routeOrders.length > 0 ? (
          <View style={styles.detailsContainer}>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Icon name="time-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Your Delivery Time</Text>
                <Text style={styles.infoValue}>{deliveryEtaText}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Icon name="location-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Current Delivery Address</Text>
                <Text style={styles.infoValue}>
                  {currentOrder?.resolvedAddress || 'Address not available'}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Icon name="cube-outline" size={18} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Updating status for</Text>
                <Text style={styles.infoValue}>
                  #{currentOrder?.orderCreateData_id || 'NA'}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Update delivery status</Text>
          <Text style={styles.statusOrderText}>
            {statusTargetOrder
              ? `Selected: #${statusTargetOrder?.orderCreateData_id}`
              : 'Tap dropdown to choose order first'}
          </Text>
          <OrderStatus
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            statuses={statuses}
            ordersForStatus={routeOrders}
            statusSubmitError={statusSubmitError}
            selectedOrderId={statusTargetOrderId}
            currentOrderId={currentOrder?.id}
            selectedOrderLabel={
              statusTargetOrder
                ? `#${statusTargetOrder?.orderCreateData_id}`
                : null
            }
            onOrderChosen={order => {
              setStatusTargetOrderId(order?.id);
              setSelectedStatus('');
              setStatusSubmitError('');
              handleDeliveryProofChange(null);
              setDeliveryProofModalVisible(false);
            }}
            deliveryProofModalVisible={deliveryProofModalVisible}
            setDeliveryProofModalVisible={setDeliveryProofModalVisible}
            deliveryProofUri={deliveryProofUri}
            onDeliveryProofChange={handleDeliveryProofChange}
            onSubmitDelivery={handleSubmit}
          />
          {routeOrders.length > 0 ? (
            <View style={styles.activeOrdersBelowSubmit}>
              <Text style={styles.activeOrdersBelowTitle}>Active Orders</Text>
              {routeOrders.map((routeOrder, index) => {
                const customerPhone = resolveOrderPhone(routeOrder?.billingAddress);
                return (
                  <View
                    key={`route-${routeOrder?.id}`}
                    style={[
                      styles.activeOrderCard,
                      index === boundedCurrentOrderIndex && styles.routeListItemActive,
                    ]}>
                    <View style={styles.activeOrderCardHeader}>
                      <Text style={styles.routeListText}>
                        Stop {index + 1}: #{routeOrder?.orderCreateData_id}
                      </Text>
                      {index === boundedCurrentOrderIndex ? (
                        <Text style={styles.currentStopPill}>Current</Text>
                      ) : null}
                    </View>
                    <Text style={styles.activeOrderAddressText}>
                      Address: {routeOrder?.resolvedAddress || 'Address not available'}
                    </Text>
                    <View style={styles.activeOrderContactRow}>
                      <Text style={styles.activeOrderAddressText}>
                        Customer: {customerPhone || 'Phone not available'}
                      </Text>
                      {customerPhone ? (
                        <TouchableOpacity
                          style={styles.callButton}
                          onPress={() => openDialPad(customerPhone)}>
                          <AntDesign
                            name={'phone'}
                            size={18}
                            color={'white'}
                            style={{transform: [{rotate: '100deg'}]}}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenRoot: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  mapSection: {
    height: 240,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 2,
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
    bottom: 12,
    right: 12,
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersSection: {
    marginTop: 16,
  },
  statusSubmitError: {
    color: '#c62828',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 2,
  },
  orderContainer: {
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  orderListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  routePlannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeOrderMeta: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  activeOrderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  routeList: {
    marginTop: 10,
  },
  routeListItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  routeListItemActive: {
    borderColor: '#FBBC05',
    backgroundColor: '#FFFBEB',
  },
  routeListText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  routePlannerSubTitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  planButton: {
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  planButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyPlanText: {
    marginTop: 10,
    fontSize: 13,
    color: '#6B7280',
  },
  orderName: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '700',
  },
  orderId: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 3,
  },
  callButton: {
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBBC05',
  },
  detailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    marginTop: 2,
  },
  statusSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 3},
    elevation: 1,
  },
  statusLabel: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
    marginBottom: 8,
  },
  statusOrderText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  activeOrdersBelowSubmit: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  activeOrdersBelowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  activeOrderCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 8,
  },
  activeOrderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  currentStopPill: {
    fontSize: 10,
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 999,
    fontWeight: '700',
  },
  activeOrderAddressText: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  activeOrderContactRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
});

export default HomeScreen;
