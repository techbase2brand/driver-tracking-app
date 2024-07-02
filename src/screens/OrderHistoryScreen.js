// OrderHistory.js
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet, Text,ActivityIndicator} from 'react-native';
import OrderItem from '../screensComponents/OrderItem';
import {useSelector} from 'react-redux';
import {BACKEND_URL} from '../constant/Constant';

const OrderHistoryScreen = () => {
  const email = useSelector(state => state?.email?.driver?.email);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState();
  console.log('orders>>>>', orders?.getorderCreateData);

  const fetchOrders = async () => {
    try {
      setLoading(true);  // Start loading
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
      setLoading(false);  // End loading
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    // <View style={styles.container}>
    //   <Text style={styles.title}>Order History</Text>
    //   {orders?.getorderCreateData ? (
    //     <FlatList
    //       data={orders?.getorderCreateData}
    //       keyExtractor={item => item.id}
    //       renderItem={({item}) => <OrderItem order={item} />}
    //     />
    //   ) : (
    //     <Text style={{textAlign: 'center'}}>No Orders Available</Text>
    //   )}
    // </View>
    <View style={styles.container}>
    <Text style={styles.title}>Order History</Text>
    {loading ? ( 
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ) : orders?.getorderCreateData?.length > 0 ? (
      <FlatList
        data={orders?.getorderCreateData}
        keyExtractor={item => item?.id}
        renderItem={({ item }) => <OrderItem order={item} />}
      />
    ) : (
      <Text style={{ textAlign: 'center' }}>No Orders Available</Text>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginVertical: 20,
    textAlign: 'center',
  },
  loader: {
    marginTop: 200,
  },
});

export default OrderHistoryScreen;
