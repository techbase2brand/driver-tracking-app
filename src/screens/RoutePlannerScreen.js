import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const sortNearestFirst = (orders, pickup) => {
  if (!orders?.length) {
    return [];
  }
  const remaining = [...orders];
  const sorted = [];
  let fromPoint = {...pickup};

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

const RoutePlannerScreen = ({route, navigation}) => {
  const orders = route?.params?.orders || [];
  const pickup = route?.params?.pickup || {latitude: 0, longitude: 0};
  const initialIds = route?.params?.selectedOrderIds || [];
  const [selectedOrderIds, setSelectedOrderIds] = useState(initialIds);

  const selectedOrders = useMemo(
    () => orders.filter(order => selectedOrderIds.includes(order.id)),
    [orders, selectedOrderIds],
  );
  const optimizedStops = useMemo(
    () => sortNearestFirst(selectedOrders, pickup),
    [selectedOrders, pickup],
  );

  const toggleSelect = orderId => {
    setSelectedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(existingId => existingId !== orderId)
        : [...prev, orderId],
    );
  };

  const applyPlan = () => {
    if (!optimizedStops.length) {
      Alert.alert('Select order', 'Please select at least one order.');
      return;
    }
    navigation.navigate('HomeMain', {
      plannedOrderIds: optimizedStops.map(order => order.id),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Route Planner</Text>
      <Text style={styles.subtitle}>Select orders and optimize nearest route</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({item}) => {
          const selected = selectedOrderIds.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.orderRow, selected && styles.orderRowSelected]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.85}>
              <View style={styles.orderTextWrap}>
                <Text style={styles.orderTitle}>#{item.orderCreateData_id}</Text>
                <Text style={styles.orderAddress}>
                  {item?.resolvedAddress || 'Address not available'}
                </Text>
              </View>
              <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                {selected ? <Icon name="checkmark" size={14} color="#FFF" /> : null}
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Text style={styles.previewTitle}>Optimized Stops</Text>
      {optimizedStops.length ? (
        optimizedStops.map((stop, index) => (
          <View key={`preview-${stop.id}`} style={styles.previewItem}>
            <Text style={styles.previewText}>
              Stop {index + 1}: #{stop.orderCreateData_id}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No stops selected.</Text>
      )}

      <TouchableOpacity style={styles.cta} onPress={applyPlan} activeOpacity={0.9}>
        <Text style={styles.ctaText}>Use This Plan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: '#6B7280',
  },
  listContent: {
    paddingBottom: 8,
  },
  orderRow: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderRowSelected: {
    borderColor: '#FBBC05',
    backgroundColor: '#FFFBEB',
  },
  orderTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  orderAddress: {
    marginTop: 3,
    fontSize: 12,
    color: '#6B7280',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    borderColor: '#FBBC05',
    backgroundColor: '#FBBC05',
  },
  previewTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  previewItem: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  previewText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  cta: {
    backgroundColor: '#111827',
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});

export default RoutePlannerScreen;
