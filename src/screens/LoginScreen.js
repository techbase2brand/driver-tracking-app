import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import Button from '../shared/Button';
import {useDispatch} from 'react-redux';
import {setEmail} from '../redux/action';
import {
  BACKEND_URL,
  USE_STATIC_DEMO_MODE,
  STATIC_DEMO_EMAIL,
  STATIC_DEMO_PASSWORD,
  STATIC_DEMO_LOGIN_RESPONSE,
} from '../constant/Constant';

/** Basic email format check (password intentionally not regex-based). */
const isValidEmail = email => {
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

const isPasswordFilled = password => password.trim().length > 0;

const LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  /** Wrong email/password after format checks — highlight both fields, no sensitive hints. */
  const [credentialsMismatch, setCredentialsMismatch] = useState(false);
  // const onloginClick = () => {
  //   console.log('working....');
  //   // dispatch(setEmail(value));
  //   navigation.navigate('OtpVerification');
  // };
  const onloginClick = async () => {
    let valid = true;
    const trimmedEmail = emailText.trim();
    setCredentialsMismatch(false);
    if (!trimmedEmail) {
      setEmailError('Email is required');
      valid = false;
    } else if (!isValidEmail(emailText)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!isPasswordFilled(passwordText)) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (!valid) {
      return;
    }

    console.log('working....');
    console.log('emailText....', emailText);
    console.log('passwordText....', passwordText);

    if (USE_STATIC_DEMO_MODE) {
      const ok =
        trimmedEmail.toLowerCase() === STATIC_DEMO_EMAIL.toLowerCase() &&
        passwordText === STATIC_DEMO_PASSWORD;
      if (ok) {
        dispatch(setEmail(STATIC_DEMO_LOGIN_RESPONSE));
      } else {
        setCredentialsMismatch(true);
        setPasswordError(
          'Invalid email or password. Please check and try again.',
        );
      }
      return;
    }

    /* API login — restored when USE_STATIC_DEMO_MODE is false */
    const response = await fetch(`${BACKEND_URL}/api/driverLogin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: emailText.trim(),
        password: passwordText,
      }),
    });

    const data = await response.json();
    console.log('Response:', data);

    if (response.ok) {
      dispatch(setEmail(data));
    } else {
      setCredentialsMismatch(true);
      setPasswordError(
        'Invalid email or password. Please check and try again.',
      );
      if (__DEV__) {
        console.log('Login failed:', data?.error);
      }
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
          style={[
            styles.input,
            emailError || credentialsMismatch ? styles.inputError : null,
          ]}
          placeholder="Email"
          value={emailText}
          onChangeText={text => {
            setEmailText(text);
            setCredentialsMismatch(false);
            if (emailError) {
              setEmailError('');
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="gray"
        />
        {emailError && emailError.trim() ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
        <Text style={styles.inputTitle}>Password</Text>
        <TextInput
          style={[
            styles.input,
            passwordError || credentialsMismatch ? styles.inputError : null,
          ]}
          placeholder="Password"
          secureTextEntry
          value={passwordText}
          onChangeText={text => {
            setPasswordText(text);
            setCredentialsMismatch(false);
            if (passwordError) {
              setPasswordError('');
            }
          }}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
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
    marginBottom: 8,
    color: 'black',
  },
  inputError: {
    borderColor: '#c62828',
  },
  errorText: {
    color: '#c62828',
    fontSize: 13,
    marginBottom: 16,
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
