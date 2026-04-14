
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from '../shared/Button';
import {useSelector} from 'react-redux';
import {useDispatch} from 'react-redux';
import {logout} from '../redux/action';



  

const ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const DriverDetail = useSelector(state => state?.email);
  console.log('DriverDetail>>>', DriverDetail);
  const [name, setName] = useState(DriverDetail?.driver?.name || 'John Doe');
  const [email] = useState(DriverDetail?.driver?.email || 'john.doe@example.com');
  const [phoneNumber, setPhoneNumber] = useState(
    DriverDetail?.driver?.phone || '+1 234 567 890',
  );
  const [vehicleNumber, setVehicleNumber] = useState('XYZ 1234');
  const [documentNumber, setDocumentNumber] = useState('DOC123456');
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChooseProfilePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };

  const handleLogout = () => {
    dispatch(logout());
    console.log('working>>>>');
    navigation.navigate('LoginScreen');
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    setIsEditing(false);
    Alert.alert('Profile updated successfully');
  };

  useEffect(() => {
    setIsEditing(false);
  }, []);

  const getInitials = name => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const FallbackAvatar = ({name}) => (
    <View style={styles.fallbackAvatar}>
      <Text style={styles.fallbackAvatarText}>{getInitials(name)}</Text>
    </View>
  );
  return (
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
                source={{uri: profileImage}}
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
                source={{uri: profileImage}}
                style={styles.avatar}
              />
            ) : (
              <FallbackAvatar name={name} />
            )}
          <View style={styles.profileHeroCard}>
            <Text style={styles.profileName}>{name}</Text>
            <Text style={styles.memberText}>Member Since February 2024</Text>
          </View>

          <View style={styles.detailsGroup}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{name}</Text>
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
              <Text style={styles.label}>Vehicle</Text>
              <Text style={styles.value}>{vehicleNumber}</Text>
            </View>
            <View style={styles.fieldContainerEnd}>
              <Text style={styles.label}>License No</Text>
              <Text style={styles.value}>{documentNumber}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleLogout}
          >
            <Text style={styles.editButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
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
    shadowOffset: {width: 0, height: 2},
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
