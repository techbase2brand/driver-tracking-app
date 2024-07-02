import React, { useEffect } from 'react';
import { View, Image, StyleSheet,Dimensions } from 'react-native';

const {width, height} = Dimensions.get('window');
const SplashScreen = ({ navigation }) => {
//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       navigation.replace('Home');
//     }, 1800);

//     return () => clearTimeout(timeout); 
//   }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assests/SplashScreen.png')}
        style={styles.logo}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  logo: {
    width: width,
    height: height,
  },
});

export default SplashScreen;
