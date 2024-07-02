import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import OTPTextInput from 'react-native-otp-textinput';
import Button from '../shared/Button';

const OtpVerification = ({navigation}) => {
  const [otpValue, setOtpValue] = useState('');
  const [timer, setTimer] = useState(25);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const handleResendOTP = () => {
    setTimer(25);
    setIsActive(true);
  };
  const handleOtpChange = value => {
    setOtpValue(value);
  };

  
  const onloginOtpClick = () => {
    console.log('working....');
    // dispatch(setEmail(value));
    navigation.navigate('regsiter');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{position: 'absolute', top: 30, left: 15}}
        activeOpacity={0.8}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name={'arrow-back'} size={30} color={'#000'} />
      </TouchableOpacity>
      <Image
        source={require('../assests/otpimg.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>OTP Verification</Text>
      <Text
        style={{
          color: 'black',
          textAlign: 'center',
          marginBottom: 40,
          fontSize: 16,
        }}>
        Enter the OTP sent to + 91 123456798
      </Text>
      <View style={{marginBottom: 80}}>
        <OTPTextInput
          handleTextChange={handleOtpChange}
          inputCount={4}
          textInputStyle={styles.otpInput}
          containerStyle={styles.otpContainer}
          tintColor="#000"
          offTintColor="gray"
          keyboardType="numeric"
          //   autoFocus={true}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleResendOTP}>
              <Text style={styles.registerLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>

          <Text style={{fontSize: 16, fontWeight: '500', marginTop: 10}}>
            {' '}
            {`00:${timer < 10 ? `0${timer}` : timer}`}
          </Text>
        </View>
      </View>
      <Button onloginClick={onloginOtpClick} title="Verify & Continue" />
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
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: 70,
    height: 70,
    borderWidth: 1,
    borderColor: 'gray', // default border color
    textAlign: 'center',
    fontSize: 18,
    borderRadius: 10,
    borderBottomWidth: 1,
  },
  filledInput: {
    borderColor: 'black',
  },
  emptyInput: {
    borderColor: 'gray',
  },
  registerContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  registerText: {
    color: '#000',
    textAlign: 'center',
  },
  registerLink: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OtpVerification;
