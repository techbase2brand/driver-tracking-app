
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../shared/Button';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/action';
import { API_BASE_URL } from '../constant/Constant';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';





const ProfileScreen = () => {
  const dispatch = useDispatch();
  const DriverDetail = useSelector(state => state?.email);
  const sessionEmail = DriverDetail?.driver?.email || '';
  console.log('DriverDetail>>>', DriverDetail);
  const [name, setName] = useState(DriverDetail?.driver?.name || 'John Doe');
  const [email, setEmail] = useState(
    DriverDetail?.driver?.email || 'john.doe@example.com',
  );
  const [phoneNumber, setPhoneNumber] = useState(
    DriverDetail?.driver?.phone || '+1 234 567 890',
  );
  const [vehicleNumber, setVehicleNumber] = useState(
    DriverDetail?.driver?.vehicleNo ||
      DriverDetail?.driver?.vehicleNumber ||
      DriverDetail?.driver?.vehicle_number ||
      DriverDetail?.driver?.shop ||
      'N/A',
  );
  const [documentNumber, setDocumentNumber] = useState(
    DriverDetail?.driver?.licenseNo ||
      DriverDetail?.driver?.licenseNumber ||
      DriverDetail?.driver?.license_no ||
      DriverDetail?.driver?.id ||
      'N/A',
  );
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleChooseProfilePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const performLogout = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/driverLogout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sessionEmail,
        }),
      });
      const data = await response.json();
      console.log('Logout API status:', response.status);
      console.log('Logout API response:', data);
    } catch (error) {
      console.log('Logout API failed:', error);
    } finally {
      await AsyncStorage.clear();
      dispatch(logout());
    }
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    setIsEditing(false);
  };

  useEffect(() => {
    setIsEditing(false);
  }, []);

  const fetchDriverInfo = useCallback(async () => {
    if (!sessionEmail) {
      return;
    }

    try {
      setIsProfileLoading(true);
      setProfileError('');
      const response = await fetch(`${API_BASE_URL}/driverInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: sessionEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const driverData =
        data?.driver || data?.data?.driver || data?.data || data;

      setName(driverData?.name || DriverDetail?.driver?.name || 'John Doe');
      setEmail(
        driverData?.email || DriverDetail?.driver?.email || sessionEmail,
      );
      setPhoneNumber(
        driverData?.phone || DriverDetail?.driver?.phone || '+1 234 567 890',
      );
      setVehicleNumber(
        driverData?.vehicleNo ||
          driverData?.vehicleNumber ||
          driverData?.vehicle_number ||
          DriverDetail?.driver?.vehicleNo ||
          DriverDetail?.driver?.vehicleNumber ||
          DriverDetail?.driver?.vehicle_number ||
          driverData?.shop ||
          DriverDetail?.driver?.shop ||
          'N/A',
      );
      setDocumentNumber(
        driverData?.licenseNo ||
          driverData?.licenseNumber ||
          driverData?.license_no ||
          DriverDetail?.driver?.licenseNo ||
          DriverDetail?.driver?.licenseNumber ||
          DriverDetail?.driver?.license_no ||
          driverData?.id ||
          DriverDetail?.driver?.id ||
          'N/A',
      );
      if (driverData?.licenseImage || driverData?.profileImage) {
        setProfileImage(driverData?.licenseImage || driverData?.profileImage);
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Profile fetch failed:', error);
      }
      setProfileError('Unable to load profile details. Please try again.');
    } finally {
      setIsProfileLoading(false);
    }
  }, [sessionEmail, DriverDetail?.driver?.email, DriverDetail?.driver?.id, DriverDetail?.driver?.name, DriverDetail?.driver?.phone, DriverDetail?.driver?.shop, DriverDetail?.driver?.vehicleNo, DriverDetail?.driver?.vehicleNumber, DriverDetail?.driver?.vehicle_number, DriverDetail?.driver?.licenseNo, DriverDetail?.driver?.licenseNumber, DriverDetail?.driver?.license_no]);

  useFocusEffect(
    useCallback(() => {
      fetchDriverInfo();
    }, [fetchDriverInfo]),
  );

  const getInitials = name => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const FallbackAvatar = ({ name }) => (
    <View style={styles.fallbackAvatar}>
      <Text style={styles.fallbackAvatarText}>{getInitials(name)}</Text>
    </View>
  );

  if (isProfileLoading && !isEditing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#111827" />
        <Text style={styles.loaderText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <>
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}>
      {isEditing ? (
        // Content when isEditing is true
        <>
          <TouchableOpacity
            style={styles.backIcon}
            activeOpacity={0.8}
            onPress={() => {
              setIsEditing(false);
            }}>
            <Icon name={'arrow-back'} size={30} color={'#000'} />
          </TouchableOpacity>
          <Text style={styles.screenTitle}>Edit Profile</Text>
          <TouchableOpacity
            onPress={handleChooseProfilePhoto}
            disabled={!isEditing}
            style={styles.avatarWrapper}>
            {/* <Image
              source={{
                uri: profileImage
                  ? profileImage
                  : 'https://media.istockphoto.com/id/1483487034/photo/portrait-of-a-cute-female-video-game-avatar.webp?b=1&s=170667a&w=0&k=20&c=tMwM3rBZ6eOhv9LQi2lTUgfbC96X2BDKAmpUpK2r-BA=',
              }}
              style={styles.avatar}
            /> */}
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.avatar}
              />
            ) : (
              <FallbackAvatar name={name} />
            )}
            <View style={styles.cameraIcon}>
              <AntDesign name={'camerao'} size={22} color={'#000'} />
            </View>
          </TouchableOpacity>
          <View style={styles.fieldContainerEdit}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.fieldContainerEdit}>
            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              editable={false}
            />
          </View>
          <View style={styles.fieldContainerEdit}>
            <Text style={styles.label}>Phone Number:</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          <View style={styles.fieldContainerEdit}>
            <Text style={styles.label}>Vehicle Number:</Text>
            <TextInput
              style={styles.input}
              value={vehicleNumber}
              onChangeText={setVehicleNumber}
            />
          </View>
          <View style={styles.fieldContainerEdit}>
            <Text style={styles.label}>Document Number:</Text>
            <TextInput
              style={styles.input}
              value={documentNumber}
              onChangeText={setDocumentNumber}
            />
          </View>

          <Button onloginClick={handleUpdateProfile} title="Update Profile" />
        </>
      ) : (
        // Content when isEditing is false
        <>
          <Text style={styles.screenTitle}>Profile</Text>
          {/* <Image
            source={{
              uri: profileImage
                ? profileImage
                : 'https://media.istockphoto.com/id/1483487034/photo/portrait-of-a-cute-female-video-game-avatar.webp?b=1&s=170667a&w=0&k=20&c=tMwM3rBZ6eOhv9LQi2lTUgfbC96X2BDKAmpUpK2r-BA=',
            }}
            style={styles.avatar}
          /> */}
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={styles.avatar}
            />
          ) : (
            <FallbackAvatar name={name} />
          )}
          <View style={styles.profileHeroCard}>
            <Text style={styles.profileName}>{name ? name.charAt(0).toUpperCase() + name.slice(1) : ''}</Text>
            {/* <Text style={styles.memberText}>Member Since February 2024</Text> */}
          </View>

          <View style={styles.detailsGroup}>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                {name ? name.charAt(0).toUpperCase() + name.slice(1) : ''}
              </Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{email}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{phoneNumber}</Text>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Vehicle Number</Text>
              <Text style={styles.value}>{vehicleNumber}</Text>
            </View>
            <View style={styles.fieldContainerEnd}>
              <Text style={styles.label}>Licence Number</Text>
              <Text style={styles.value}>{documentNumber}</Text>
            </View>
          </View>
          {profileError ? (
            <Text style={styles.profileErrorText}>{profileError}</Text>
          ) : null}
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleLogout}
          >
            <Text style={styles.editButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
    <Modal
      visible={logoutModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setLogoutModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setLogoutModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.logoutModalCard}>
              <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
              <Text style={styles.logoutModalSubtitle}>
                Are you sure you want to logout?
              </Text>
              <View style={styles.logoutModalActions}>
                <TouchableOpacity
                  style={[styles.logoutActionBtn, styles.logoutCancelBtn]}
                  onPress={() => setLogoutModalVisible(false)}>
                  <Text style={styles.logoutCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.logoutActionBtn, styles.logoutContinueBtn]}
                  onPress={() => {
                    setLogoutModalVisible(false);
                    performLogout();
                  }}>
                  <Text style={styles.logoutContinueText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 28,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loaderText: {
    marginTop: 10,
    color: '#374151',
    fontWeight: '600',
  },
  profileErrorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },
  backIcon: {
    marginBottom: 14,
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 12,
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#FBBC05',
  },
  fallbackAvatar: {
    width: 108,
    height: 108,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
  },
  fallbackAvatarText: {
    fontSize: 40,
    color: '#fff',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: 34,
    width: 34,
    backgroundColor: '#fff',
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fieldContainerEdit: {
    width: '100%',
    marginBottom: 12,
    paddingVertical: 2,
  },
  detailsGroup: {
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  fieldContainerEnd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 0,
    color: '#111827',
  },
  value: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
  memberText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 2,
  },
  profileHeroCard: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  editButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 4,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoutModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  logoutModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  logoutModalSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 14,
  },
  logoutModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  logoutActionBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutCancelBtn: {
    backgroundColor: '#F3F4F6',
  },
  logoutContinueBtn: {
    backgroundColor: '#111827',
  },
  logoutCancelText: {
    color: '#111827',
    fontWeight: '600',
  },
  logoutContinueText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 15,
    width: '100%',
    alignItems: 'center',
    borderRadius: 5,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
