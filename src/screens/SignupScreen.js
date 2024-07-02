// import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
// import React from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';

// export default function SignupScreen({navigation}) {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Get Started</Text>
//       <View style={{flexDirection: 'row', gap: 14, width: '100%'}}>
//         <View style={[styles.inputContainer, {width: '48%'}]}>
//           <Text style={styles.inputTitle}>First Name</Text>
//           <TextInput style={styles.input} placeholder="First Name" />
//         </View>

//         <View style={[styles.inputContainer, {width: '48%'}]}>
//           <Text style={styles.inputTitle}>Last Name</Text>
//           <TextInput style={styles.input} placeholder="Last Name" />
//         </View>
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.inputTitle}>Email</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           keyboardType="email-address"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.inputTitle}>Phone Number</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Phone Number"
//           keyboardType="phone-pad"
//         />
//       </View>
//       <View style={styles.inputContainer}>
//         <Text style={styles.inputTitle}>Vehicle Number</Text>
//         <TextInput style={styles.input} placeholder="Vehicle Number" />
//       </View>

//       <View style={{flexDirection: 'row', gap: 14, width: '100%'}}>
//         <View style={[styles.inputContainer, {width: '48%'}]}>
//           <Text style={styles.inputTitle}>Password</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             secureTextEntry
//           />
//         </View>

//         <View style={[styles.inputContainer, {width: '48%'}]}>
//           <Text style={styles.inputTitle}>Confirm Password</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Confirm Password"
//             secureTextEntry
//           />
//         </View>
//       </View>
//       <TouchableOpacity style={styles.button}>
//         <Text style={styles.buttonText}>Register</Text>
//       </TouchableOpacity>

//       <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
//         <Text style={styles.loginText}>Already an account? Login</Text>
//       </TouchableOpacity>

//       <View style={styles.socialLoginContainer}>
//         <View style={styles.line} />
//         <Text style={styles.orText}>Or</Text>
//         <View style={styles.line} />
//       </View>
//       <GoogleSigninButton
//         style={styles.googleButton}
//         size={GoogleSigninButton.Size.Wide}
//         color={GoogleSigninButton.Color.Dark}
//         // onPress={onGoogleButtonPress}
//       />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: '900',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: 'black',
//   },
//   inputTitle: {
//     color: 'black',
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   inputContainer: {
//     marginBottom: 15,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//   },
//   button: {
//     backgroundColor: '#ff0000',
//     padding: 15,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   loginText: {
//     textAlign: 'center',
//     color: '#ff0000',
//     marginBottom: 20,
//   },
//   socialLoginContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   line: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#ccc',
//   },
//   orText: {
//     marginHorizontal: 10,
//     fontWeight: 'bold',
//   },
//   socialButton: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 15,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   socialButtonText: {
//     color: '#000',
//     fontWeight: 'bold',
//   },
//   googleButton: {
//     alignSelf: 'center',
//     width: '80%',
//     height: 48,
//   },
// });

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/AntDesign';
import Button from '../shared/Button';
import {useDispatch, useSelector} from 'react-redux';
import {setEmail} from '../redux/action';

export default function SignupScreen({navigation}) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhoneNo, setUserPhoneNo] = useState('');
  const [userVehicleNo, setUserVehicleNo] = useState('');
  const [userDocNo, setUserDocNo] = useState('');
  const [imageUris, setImageUris] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  console.log('name', name);
  const handleChooseProfilePhoto = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setProfileImage(response.assets[0].uri);
      }
    });
  };
  const handleImagePicker = () => {
    launchImageLibrary(
      {mediaType: 'photo', selectionLimit: 0}, // selectionLimit: 0 allows multiple selection
      response => {
        if (response.assets && response.assets.length > 0) {
          const uris = response.assets.map(asset => asset.uri);
          setImageUris([...imageUris, ...uris]);
        }
      },
    );
  };
  const removeImage = uri => {
    setImageUris(imageUris.filter(imageUri => imageUri !== uri));
  };

  const onRegisterClick = () => {
    console.log('working....');
    dispatch(setEmail(name));
    navigation.navigate('Home');
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fill Your Details</Text>

      <TouchableOpacity onPress={handleChooseProfilePhoto}>
        <Image
          source={{
            uri: profileImage
              ? profileImage
              : 'https://media.istockphoto.com/id/1483487034/photo/portrait-of-a-cute-female-video-game-avatar.webp?b=1&s=170667a&w=0&k=20&c=tMwM3rBZ6eOhv9LQi2lTUgfbC96X2BDKAmpUpK2r-BA=',
          }}
          style={styles.avatar}
        />
        <View
          style={{
            position: 'absolute',
            top: 85,
            left: 180,
            height: 35,
            width: 35,
            backgroundColor: '#fff',
            borderRadius: 100,
            padding: 6,
          }}>
          <Icon name={'camerao'} size={25} color={'#000'} />
        </View>
      </TouchableOpacity>
      <View style={[styles.inputContainer]}>
        <Text style={styles.inputTitle}> Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Your Name"
          onChangeText={setName}
        />
      </View>
      {/* <View style={{flexDirection: 'row', gap: 14, width: '100%'}}>
        <View style={[styles.inputContainer, {width: '48%'}]}>
          <Text style={styles.inputTitle}> Name</Text>
          <TextInput style={styles.input} placeholder="First Name" />
        </View>

        <View style={[styles.inputContainer, {width: '48%'}]}>
          <Text style={styles.inputTitle}>Last Name</Text>
          <TextInput style={styles.input} placeholder="Last Name" />
        </View>
      </View> */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          keyboardType="email-address"
        />
      </View>

      <View style={{flexDirection: 'row', gap: 14, width: '100%'}}>
        <View style={[styles.inputContainer, {width: '48%'}]}>
          <Text style={styles.inputTitle}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={[styles.inputContainer, {width: '48%'}]}>
          <Text style={styles.inputTitle}>Vehicle Number</Text>
          <TextInput style={styles.input} placeholder="Vehicle Number" />
        </View>
      </View>
      {/* <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Vehicle Number</Text>
        <TextInput style={styles.input} placeholder="Vehicle Number" />
      </View> */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Driving Licence/PAN Card Number</Text>
        <TextInput style={styles.input} placeholder="Identity Number" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputTitle}>Upload Driving Licence/PAN Card</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImagePicker}>
          <Icon name={'clouduploado'} size={35} color={'#000'} />

          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {imageUris.map((uri, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{uri}} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(uri)}>
                <Text style={styles.removeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
      <Button onloginClick={onRegisterClick} title="Save & Continue" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    color: 'black',
  },
  avatar: {
    width: 108,
    height: 108,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: 'center',
  },
  inputTitle: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  uploadButton: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    height: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  uploadButtonText: {
    fontSize: 15,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  imagePreview: {
    width: 70,
    height: 70,
    marginTop: 10,
    marginHorizontal: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    // marginHorizontal:,
    // justifyContent:"space-around"
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'gray',
    height: 20,
    width: 20,
    borderRadius: 50,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },

  socialButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  socialButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  googleButton: {
    alignSelf: 'center',
    width: '80%',
    height: 48,
  },
});
