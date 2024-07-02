// OrderItem.js
import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const OrderItem = ({order}) => {
  return (
    <View style={styles.container}>
      {/* <Image source={{uri: 'https://plus.unsplash.com/premium_photo-1663858367001-89e5c92d1e0e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D'}} style={styles.image} /> */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>#{order?.orderCreateData_id}</Text>
        <View style={styles.itemCnt}>
          <Text style={styles.details}>4 Items</Text>
          <Text style={styles.date}>10 June, 2024</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderColor: '#ddd',
    marginVertical: 20,
  },
  image: {
    width: 65,
    height: 60,
    marginRight: 10,
    borderRadius: 10,
  },
  textContainer: {
    width:"100%",
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemCnt: {
    width:"99%",
    flexDirection:"row",
    justifyContent:"space-between"
  },
  details: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontWeight:"bold"
  },
});

export default OrderItem;
