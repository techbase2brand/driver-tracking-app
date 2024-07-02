import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import Button from '../shared/Button';
import {useDispatch, useSelector} from 'react-redux';
import {setEmail} from '../redux/action';
import {BACKEND_URL} from '../constant/Constant';

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [value, setValue] = useState('');
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  // const onloginClick = () => {
  //   console.log('working....');
  //   // dispatch(setEmail(value));
  //   navigation.navigate('OtpVerification');
  // };
  const onloginClick = async () => {
    console.log('working....');

    console.log('emailText....', emailText);
    console.log('passwordText....', passwordText);
    const response = await fetch(`${BACKEND_URL}/api/driverLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailText,
        password: passwordText,
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      // Handle successful login
      dispatch(setEmail(data));
      navigation.navigate('Home');
    } else {
      // Handle login failure
      Alert.alert('Login failed:', data.error);
      console.log('Login failed:', data.error);
    }
  };

  const handlePress = type => {
    // Handle the press event for the links here
    console.log(type);
    // navigation.navigate('OtpVerification');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assests/startupLogin.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Get Started With App</Text>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          marginBottom: 40,
          fontSize: 16,
        }}>
        Login or Signup to use App
      </Text>
      <View style={{marginBottom: 20}}>
        <Text style={styles.inputTitle}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={emailText}
          onChangeText={setEmailText}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="gray"
        />
        <Text style={styles.inputTitle}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={passwordText}
          onChangeText={setPasswordText}
        />
        {/* <View style={styles.socialLoginContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Login With Phone Number</Text>
        <View style={styles.line} />
      </View>
        <Text style={styles.inputTitle}>Enter Phone Number</Text>
        <PhoneInput
          style={{width: '100%'}}
          // ref={phoneInput}
          // defaultValue={value}
          defaultCode="IN"
          // layout="first"
          onChangeText={text => {
            setValue(text);
          }}
          // onChangeFormattedText={(text) => {
          //   setFormattedValue(text);
          // }}
          withDarkTheme
          withShadow
          // autoFocus
          containerStyle={{
            width: '100%',
            height: 60,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: '#ccc',
          }}
          textContainerStyle={{borderRadius: 8}}
          textInputStyle={{height: 70}}
        /> */}
      </View>
      <Button onloginClick={onloginClick} title="Login" />
      <Text style={styles.registerText}>By continuing you agree to our </Text>
      <View style={styles.linksContainer}>
        <TouchableOpacity onPress={() => handlePress('Terms of Service')}>
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('Privacy Policy')}>
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePress('Content Policy')}>
          <Text style={styles.linkText}>Content Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: 'black',
  },
  inputTitle: {
    color: 'black',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: 'black',
  },
  registerText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  linkText: {
    fontSize: 14,
    color: '#1E90FF',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  orText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
