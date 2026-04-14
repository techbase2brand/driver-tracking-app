import React, {useMemo, useRef} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {GOOGLE_MAPS_APIKEY} from '../constant/Constant';

const FALLBACK_PICKUP = {
  latitude: 30.7046,
  longitude: 76.7179,
};

const MapScreen = ({route}) => {
  const mapRef = useRef();
  const pickup = route?.params?.pickup || FALLBACK_PICKUP;
  const routeOrders = route?.params?.routeOrders || [];
  const currentOrderIndex = route?.params?.currentOrderIndex || 0;

  const remainingRouteOrders = useMemo(
    () => routeOrders.slice(currentOrderIndex),
    [routeOrders, currentOrderIndex],
  );

  /** Single active leg: driver → current stop only (next leg after delivery) */
  const activeLegDestination = remainingRouteOrders[0]?.destination || null;
  const activeOrder = remainingRouteOrders[0];
  const hasValidLegDestination = Boolean(
    activeLegDestination?.latitude && activeLegDestination?.longitude,
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={{
          latitude: pickup.latitude,
          longitude: pickup.longitude,
          latitudeDelta: 0.0822,
          longitudeDelta: 0.0421,
        }}>
        <Marker coordinate={pickup} title="You are here" />
        {remainingRouteOrders.map((order, index) => (
          <Marker
            key={`map-stop-${order?.id || index}`}
            coordinate={order.destination}
            title={
              index === 0
                ? `Current — #${order?.orderCreateData_id || ''}`
                : `Upcoming ${index + 1}`
            }
            description={order?.resolvedAddress || 'Address not available'}
            pinColor={index === 0 ? '#FBBC05' : '#9CA3AF'}
          />
        ))}
        {hasValidLegDestination ? (
          <MapViewDirections
            key={`map-leg-${activeOrder?.id}-${currentOrderIndex}`}
            origin={pickup}
            destination={activeLegDestination}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="#111827"
            onReady={result => {
              if (mapRef.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 90,
                    right: 50,
                    bottom: 180,
                    left: 40,
                  },
                });
              }
            }}
            onError={error => {
              console.warn('MapScreen directions error:', error);
            }}
          />
        ) : null}
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Active Stop: {remainingRouteOrders.length ? 1 : 0}/
          {remainingRouteOrders.length}
        </Text>
        <Text style={styles.infoOrder}>
          Order: #{activeOrder?.orderCreateData_id || 'NA'}
        </Text>
        <Text style={styles.infoAddress}>
          {activeOrder?.resolvedAddress || 'No active route selected'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  infoCard: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  infoTitle: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '700',
  },
  infoOrder: {
    color: '#1F2937',
    fontSize: 13,
    marginTop: 4,
    fontWeight: '600',
  },
  infoAddress: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },
});

export default MapScreen;
