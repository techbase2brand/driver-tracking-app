// OnboardingScreen.js
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

const OnboardingScreen = ({ onFinish }) => {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assests/OnboardingNew.png')}
        style={{
          width: windowWidth,
          height: windowHeight,
          padding: 20,
        }}
        resizeMode="cover">
        <View style={{ flex: 2 }} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.text, { textAlign: 'center' }]}>
            Deliver smarter, every trip
          </Text>
          <Text style={styles.subText}>
            See your orders, navigate with live maps and directions, update
            delivery status in one place, and keep customers in the loop—built
            for drivers on the road.
          </Text>
          {/* <Text title="Get Started" onPress={onFinish} /> */}
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <Text style={[styles.text, {fontSize: 17}]} onPress={onFinish}>
              Get Started
            </Text>

            <Text style={[styles.text, {fontSize: 17}]} onPress={onFinish}>
              Skip
            </Text>
          </View> */}
          <TouchableOpacity style={styles.button} onPress={onFinish}>
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 25,
    fontWeight: '700',
    marginBottom: 20,
    // textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
