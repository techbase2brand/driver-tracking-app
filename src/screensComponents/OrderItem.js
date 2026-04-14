// OrderItem.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OrderItem = ({order}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leadingAccent} />
      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <Text style={styles.title}>#{order?.orderCreateData_id}</Text>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>Delivered</Text>
          </View>
        </View>
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
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 10,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    elevation: 1,
  },
  leadingAccent: {
    width: 4,
    height: 40,
    borderRadius: 3,
    backgroundColor: '#FBBC05',
    marginTop: 2,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  statusPill: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  itemCnt: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    fontSize: 13,
    color: '#6B7280',
  },
  date: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
});

export default OrderItem;
