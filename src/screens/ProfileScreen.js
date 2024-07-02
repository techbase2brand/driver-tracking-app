
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
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { persistor } from '../redux/store';
import {logout, setEmail} from '../redux/action';



  

const ProfileScreen = ({navigation}) => {
  const dispatch =useDispatch();
  const DriverDetail = useSelector(state => state?.email);
  console.log("DriverDetail>>>", DriverDetail);
  const [name, setName] = useState (DriverDetail?.driver?.name || 'John Doe');
  const [email, setEmail] = useState(DriverDetail?.driver?.email ||'john.doe@example.com');
  const [phoneNumber, setPhoneNumber] = useState( DriverDetail?.driver?.phone|| '+1 234 567 890');
  const [vehicleNumber, setVehicleNumber] = useState('XYZ 1234');
  const [documentNumber, setDocumentNumber] = useState('DOC123456');
  const [profileImage, setProfileImage] = useState(null);
  const [documentImages, setDocumentImages] = useState([]);
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
    console.log("working>>>>");
    navigation.navigate("LoginScreen")
  };

  const handleChooseDocumentPhoto = () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 0}, // selectionLimit: 0 allows multiple selection
      response => {
        if (response.assets && response.assets.length > 0) {
          const uris = response.assets.map(asset => asset.uri);
          setDocumentImages([...documentImages, ...uris]);
        }
      },
    );
  };

  const handleUpdateProfile = () => {
    // Handle profile update logic here
    setIsEditing(false);
    Alert.alert('Profile updated successfully');
  };

  useEffect(() => {
    setIsEditing(false);
  }, []);

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  const FallbackAvatar = ({ name }) => (
    <View style={styles.fallbackAvatar}>
      <Text style={styles.fallbackAvatarText}>{getInitials(name)}</Text>
    </View>
  );
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isEditing ? (
        // Content when isEditing is true
        <>
          <TouchableOpacity
            style={{position: 'absolute', top: 30, left: 15}}
            activeOpacity={0.8}
            onPress={() => {
              setIsEditing(false);
            }}>
            <Icon name={'arrow-back'} size={30} color={'#000'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleChooseProfilePhoto}
            disabled={!isEditing}
            style={{marginTop: 40}}>
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
            <View
              style={{
                position: 'absolute',
                top: 85,
                right: 140,
                height: 35,
                width: 35,
                backgroundColor: '#fff',
                borderRadius: 100,
                padding: 6,
              }}>
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
              // value={email}
              // onChangeText={setEmail}
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
          <Text
            style={[
              styles.label,
              {
                fontSize: 20,
                fontWeight: '700',
                position: 'absolute',
                top: 20,
                left: 20,
              },
            ]}>
            Profile
          </Text>
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
          <Text
            style={{
              textAlign: 'center',
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 20,
            }}>
            Member Since February 2024
          </Text>

          {/* <TouchableOpacity
            style={styles.editButton}
            onPress={() => setIsEditing(true)}>
            <Text style={styles.editButtonText}>
              <Text style={{}}>
                <AntDesign name={'edit'} size={20} color={'#ffff'} />
              </Text>
              Edit Profile
            </Text>
          </TouchableOpacity> */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{email}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Vehicle Number:</Text>
            <Text style={styles.value}>{vehicleNumber}</Text>
          </View>
          <View style={styles.fieldContainerEnd}>
            <Text style={styles.label}>License No:</Text>
            <Text style={styles.value}>{documentNumber}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleLogout}
            >
            <Text style={styles.editButtonText}>
             Logout
            </Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    position: 'relative',
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 100,
    marginBottom: 15,
    alignSelf: 'center',
    backgroundColor:'#FBBC05'
  },
  fallbackAvatar: {
    width: 108,
    height: 108,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  fallbackAvatarText: {
    fontSize: 40,
    color: '#fff',
  },
  fieldContainerEdit: {
    width: '98%',
    marginBottom: 10,
    paddingVertical: 10,
  },
  fieldContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginBottom: 15,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
  },
  fieldContainerEnd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '98%',
    marginBottom: 15,
    paddingVertical: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
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
  editButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'black',
    padding: 10,
    width: '36%',
    alignItems: 'center',
    borderRadius: 8,
    // marginVertical: 15,
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
