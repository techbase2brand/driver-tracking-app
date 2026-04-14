// OrderHistory.js
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text, ActivityIndicator} from 'react-native';
import OrderItem from '../screensComponents/OrderItem';
import {useSelector} from 'react-redux';
import {
  BACKEND_URL,
  USE_STATIC_DEMO_MODE,
  STATIC_DEMO_ORDERS_RESPONSE,
} from '../constant/Constant';

const OrderHistoryScreen = () => {
  const email = useSelector(state => state?.email?.driver?.email);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  console.log('orders>>>>', orders?.getorderCreateData);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (USE_STATIC_DEMO_MODE) {
        setOrders(STATIC_DEMO_ORDERS_RESPONSE);
        return;
      }
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
      console.log('data', data?.getorderCreateData);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [email]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      <Text style={styles.subtitle}>Track all delivered and active orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#1F2937" style={styles.loader} />
      ) : orders?.getorderCreateData?.length > 0 ? (
        <FlatList
          data={orders?.getorderCreateData}
          keyExtractor={item => `${item?.id || item?.orderCreateData_id}`}
          renderItem={({item}) => <OrderItem order={item} />}
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
