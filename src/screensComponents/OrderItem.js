// OrderItem.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const OrderItem = ({order}) => {
  const orderLabel = order?.orderNumber || order?.orderCreateData_id || 'NA';
  const rawStatus = (order?.deliveryStatus || '').toString().toLowerCase();
  const isDelivered = rawStatus === 'delivered';
  const statusText = rawStatus
    ? rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
    : 'Assigned';
  const statusPillStyle = isDelivered
    ? styles.statusPillDelivered
    : styles.statusPillAssigned;
  const statusTextStyle = isDelivered
    ? styles.statusPillTextDelivered
    : styles.statusPillTextAssigned;

  const createdDate = order?.createdAt ? new Date(order.createdAt) : null;
  const createdDateLabel =
    createdDate && !Number.isNaN(createdDate.getTime())
      ? createdDate.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'N/A';

  let billingAddress = {};
  try {
    billingAddress = JSON.parse(order?.billing_address || '{}');
  } catch (error) {
    billingAddress = {};
  }
  const addressLine = order?.deliveryAddress || billingAddress?.address1 || '';
  const city = order?.deliveryCity || billingAddress?.city || '';
  const zip = order?.deliveryZip || billingAddress?.zip || '';
  const country = order?.deliveryCountry || billingAddress?.country || '';
  const fullAddress = [addressLine, city, zip, country].filter(Boolean).join(', ');

  return (
    <View style={styles.container}>
      <View style={styles.leadingAccent} />
      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <Text style={styles.title}>{orderLabel}</Text>
          <View style={[styles.statusPill, statusPillStyle]}>
            <Text style={[styles.statusPillText, statusTextStyle]}>
              {statusText}
            </Text>
          </View>
        </View>
        <View style={styles.itemCnt}>
          <Text style={styles.details}>{fullAddress || 'Address not available'}</Text>
          <Text style={styles.date}>{createdDateLabel}</Text>
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
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillDelivered: {
    backgroundColor: '#ECFDF3',
    borderColor: '#A7F3D0',
  },
  statusPillAssigned: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statusPillTextDelivered: {
    color: '#047857',
  },
  statusPillTextAssigned: {
    color: '#1D4ED8',
  },
  itemCnt: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 6,
  },
  details: {
    fontSize: 13,
    color: '#6B7280',
    width: '100%',
  },
  date: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
  },
});

export default OrderItem;
