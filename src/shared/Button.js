import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React from 'react';

const Button = ({onloginClick, title, updateBtnWidth, loading = false}) => {
  return (
    <View>
      <TouchableOpacity
        style={[styles.button, {width: updateBtnWidth ? updateBtnWidth : ''}]}
        onPress={onloginClick}
        disabled={loading}
        activeOpacity={loading ? 1 : 0.7}>
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  button: {
    backgroundColor: '#111827',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default Button;
