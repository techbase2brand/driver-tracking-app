// OnboardingScreen.js
import React from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';

const OnboardingScreen = ({onFinish}) => {
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
        <View style={{flex: 2}} />
        <View style={{flex: 1}}>
          <Text style={[styles.text, {textAlign: 'center'}]}>
            Lorem ipsum dolor sit amet, consectetur.
          </Text>
          <Text style={styles.subText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non
            eros rutrum, semper ex sed, iaculis quam. Vivamus sit amet vehicula
            nulla.
          </Text>
          {/* <Text title="Get Started" onPress={onFinish} /> */}
          <View
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
          </View>
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
});

export default OnboardingScreen;
