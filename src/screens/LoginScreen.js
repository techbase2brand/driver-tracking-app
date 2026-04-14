import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../shared/Button';
import {useDispatch} from 'react-redux';
import {setEmail} from '../redux/action';
import {API_BASE_URL} from '../constant/Constant';

/** Basic email format check (password intentionally not regex-based). */
const isValidEmail = email => {
  const trimmed = email.trim();
  if (!trimmed) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
};

const isPasswordFilled = password => password.trim().length > 0;
const LOGIN_API_URL = `${API_BASE_URL}/driverLogin`;

const getSessionPayload = responseData => {
  if (responseData?.driver?.email || responseData?.token) {
    return responseData;
  }

  if (responseData?.data?.driver?.email || responseData?.data?.token) {
    return responseData.data;
  }

  return responseData;
};

const LoginScreen = () => {
  const dispatch = useDispatch();
  const [emailText, setEmailText] = useState('');
  const [passwordText, setPasswordText] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      setIsLoginLoading(true);
      const response = await fetch(LOGIN_API_URL, {
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
      if (__DEV__) {
        console.log('Login response:', data);
      }

      if (response.ok) {
        const sessionPayload = getSessionPayload(data);
        if (sessionPayload?.driver?.email || sessionPayload?.token) {
          dispatch(
            setEmail({
              ...sessionPayload,
              loginSessionAt: Date.now(),
            }),
          );
        } else {
          setCredentialsMismatch(true);
          setPasswordError('Login response format is invalid.');
        }
      } else {
        setCredentialsMismatch(true);
        setPasswordError(
          'Invalid email or password. Please check and try again.',
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.log('Login request failed:', error);
      }
      setCredentialsMismatch(true);
      setPasswordError('Unable to login right now. Please try again.');
    } finally {
      setIsLoginLoading(false);
    }
  };

  const handlePress = type => {
    // Handle the press event for the links here
    console.log(type);
    // navigation.navigate('OtpVerification');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
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
          autoCorrect={false}
          spellCheck={false}
          textContentType="username"
          autoComplete="email"
          placeholderTextColor="gray"
        />
        {emailError && emailError.trim() ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
        <Text style={styles.inputTitle}>Password</Text>
        <View
          style={[
            styles.passwordInputWrapper,
            passwordError || credentialsMismatch ? styles.inputError : null,
          ]}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={passwordText}
            onChangeText={text => {
              setPasswordText(text);
              setCredentialsMismatch(false);
              if (passwordError) {
                setPasswordError('');
              }
            }}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            activeOpacity={0.7}
            onPress={() => setShowPassword(prev => !prev)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>
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
      <Button
        onloginClick={onloginClick}
        title="Login"
        loading={isLoginLoading}
      />
      {/* <Text style={styles.registerText}>By continuing you agree to our </Text>
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
      </View> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
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
  passwordInputWrapper: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    color: 'black',
    paddingVertical: 0,
  },
  eyeButton: {
    paddingLeft: 10,
    paddingVertical: 4,
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
