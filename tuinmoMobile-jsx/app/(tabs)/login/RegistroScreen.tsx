import React from 'react';
import { View, StyleSheet } from 'react-native';
import RegistroForm from '../../../components/_forms/RegistroForm';

const RegistroScreen = () => {
  return (
    <View style={styles.container}>
      <RegistroForm />
    </View>
  );
};

export default RegistroScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%', // En mobile suele ser 100%
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
});
