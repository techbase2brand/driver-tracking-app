// OrderHistory.js
import React, {useCallback, useState} from 'react';
import {View, FlatList, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import OrderItem from '../screensComponents/OrderItem';
import {useSelector} from 'react-redux';
import {API_BASE_URL} from '../constant/Constant';

const OrderHistoryScreen = () => {
  const email = useSelector(state => state?.email?.driver?.email);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState();
  const [ordersError, setOrdersError] = useState('');

  const fetchOrders = useCallback(async ({isRefresh = false} = {}) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setOrdersError('');
      const response = await fetch(
        `${API_BASE_URL}/driverAllOrders?email=${encodeURIComponent(email || '')}`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();
      console.log('OrderHistory API status:', response.status);
      console.log('OrderHistory API response:', data);
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrdersError('Unable to load orders. Please try again.');
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, [email]);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders]),
  );

  const handleRefresh = () => {
    fetchOrders({isRefresh: true});
  };

  const historyOrders = [
    ...(orders?.pendingOrders || []),
    ...(orders?.deliveredOrders || []),
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <Text style={styles.subtitle}>Track all delivered and active orders</Text>
      {/* {ordersError ? <Text style={styles.errorText}>{ordersError}</Text> : null} */}
      {loading ? (
        <ActivityIndicator size="large" color="#1F2937" style={styles.loader} />
      ) : historyOrders.length > 0 ? (
        <FlatList
          data={historyOrders}
          keyExtractor={item =>
            `${item?.id || item?.orderNumber || item?.orderCreateData_id}`
          }
          renderItem={({item}) => <OrderItem order={item} />}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Orders Available</Text>
          <Text style={styles.emptySubtitle}>
            Delivered and upcoming orders will appear here.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    marginBottom: 8,
  },
  loader: {
    marginTop: 120,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 2,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280',
  },
});

export default OrderHistoryScreen;
