import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const FloatingButton = ({ onPress, icon, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress} style={styles.button}>
        {icon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'rgba(103, 80, 164, 1)',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FloatingButton;
