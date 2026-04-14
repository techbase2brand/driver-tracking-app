import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';


const OrderStatus = ({
  selectedStatus,
  setSelectedStatus,
  statuses,
  ordersForStatus = [],
  onOrderChosen,
  selectedOrderLabel,
  selectedOrderId,
  currentOrderId,
}) => {
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [tempSelectedOrderId, setTempSelectedOrderId] = useState(null);

  const renderStatusItem = ({item}) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        setSelectedStatus(item.value);
        setStatusModalVisible(false);
      }}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const selectedOrderInModal = ordersForStatus.find(
    order => `${order?.id}` === `${tempSelectedOrderId}`,
  );

  const renderOrderItem = ({item, index}) => {
    const isSelected = `${item?.id}` === `${tempSelectedOrderId}`;
    return (
      <TouchableOpacity
        style={[styles.orderItem, isSelected && styles.orderItemSelected]}
        activeOpacity={0.85}
        onPress={() => setTempSelectedOrderId(item?.id)}>
        <View style={styles.orderItemBody}>
          <Text style={styles.stopLabel}>Stop {index + 1}</Text>
          <Text style={styles.orderIdText}>#{item?.orderCreateData_id || 'NA'}</Text>
          <Text style={styles.orderAddressText} numberOfLines={2}>
            {item?.resolvedAddress || 'Address not available'}
          </Text>
        </View>
        <View style={styles.checkboxWrap}>
          <Icon
            name={isSelected ? 'checkcircle' : 'checkcircleo'}
            size={22}
            color={isSelected ? '#111827' : '#9CA3AF'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => {
          setTempSelectedOrderId(
            selectedOrderId || currentOrderId || ordersForStatus?.[0]?.id || null,
          );
          setOrderModalVisible(true);
        }}>
        <Text style={styles.pickerButtonText}>
          {selectedOrderLabel
            ? `${selectedOrderLabel}${
                selectedStatus
                  ? ` • ${
                      statuses.find(status => status.value === selectedStatus)?.label
                    }`
                  : ' • Select status'
              }`
            : 'Select order and status'}
        </Text>
        <Icon name="caretdown" size={18} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={orderModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setOrderModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setOrderModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Route stops</Text>
              <Text style={styles.modalSubtitle}>
                Same order as your planned route. Tap Continue, then pick status.
              </Text>
              <FlatList
                data={ordersForStatus}
                renderItem={renderOrderItem}
                keyExtractor={item => `${item?.id}`}
                contentContainerStyle={styles.orderListContent}
                ListEmptyComponent={
                  <Text style={styles.emptyOrderText}>
                    No planned orders found. Please plan your route first.
                  </Text>
                }
              />
              <TouchableOpacity
                style={[
                  styles.modalContinueButton,
                  !selectedOrderInModal && styles.modalContinueButtonDisabled,
                ]}
                disabled={!selectedOrderInModal}
                activeOpacity={0.85}
                onPress={() => {
                  if (!selectedOrderInModal) {
                    return;
                  }
                  onOrderChosen?.(selectedOrderInModal);
                  setOrderModalVisible(false);
                  setStatusModalVisible(true);
                }}>
                <Text style={styles.modalContinueButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <Modal
        visible={statusModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setStatusModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Status</Text>
              <FlatList
                data={statuses}
                renderItem={renderStatusItem}
                keyExtractor={item => item.value}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  pickerButtonText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    paddingRight: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '84%',
    maxHeight: '72%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  orderListContent: {
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  orderItemSelected: {
    backgroundColor: '#F9FAFB',
  },
  orderItemBody: {
    flex: 1,
    minWidth: 0,
  },
  stopLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  checkboxWrap: {
    width: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  modalContinueButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContinueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  modalContinueButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  orderIdText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  orderAddressText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  itemText: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600',
  },
  emptyOrderText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginVertical: 16,
  },
});

export default OrderStatus;