import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

import LoginForm from '../components/_forms/LoginForm';
import RegistroForm from '../components/_forms/RegistroForm';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoginScreen: React.FC = () => {
  const [register, setRegister] = useState(false);

  const cambio = () => setRegister((prev) => !prev);

  const irALoginInquilinos = () => {
    // Navegar a login de inquilinos si existe
    console.log('Ir a login inquilinos');
  };

  return (
    <View style={styles.root}>
      {/* Fondo violeta "wave" simplificado */}
      <View style={styles.topBackground} />

      {/* Botón Portal alquileres (solo en login) */}
      {!register && (
        <TouchableOpacity
          onPress={irALoginInquilinos}
          style={styles.portalButton}
          activeOpacity={0.7}
        >
          <Text style={styles.portalText}>Portal alquileres</Text>
          <Text style={styles.portalIcon}>▶</Text>
        </TouchableOpacity>
      )}

      {/* Contenedor central del formulario */}
      <View style={styles.contentWrapper}>
        {register ? (
          <RegistroForm onRegistroExitoso={cambio} />
        ) : (
          <LoginForm />
        )}
      </View>

      {/* Barra inferior para cambiar entre login / registro */}
      <View
        style={[
          styles.bottomBar,
          register && styles.bottomBarRegister,
        ]}
      >
        {register ? (
          <Text
            style={[
              styles.bottomText,
              register && styles.bottomTextRegister,
            ]}
          >
            ¿Ya tienes cuenta?{' '}
            <Text
              style={[
                styles.bottomLink,
                register && styles.bottomLinkRegister,
              ]}
              onPress={cambio}
            >
              Iniciar sesión
            </Text>
          </Text>
        ) : (
          <Text style={styles.bottomText}>
            ¿No tienes cuenta?{' '}
            <Text
              style={styles.bottomLink}
              onPress={cambio}
            >
              Registrarse
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: SCREEN_HEIGHT * 0.3,
    backgroundColor: '#5617A4',
    zIndex: -1,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 60,
    justifyContent: 'center',
  },
  portalButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1001,
    backgroundColor: 'transparent',
  },
  portalText: {
    color: '#ffffff',
    fontSize: 14,
    marginRight: 4,
  },
  portalIcon: {
    color: '#ffffff',
    fontSize: 16,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: 48,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#e5e7eb',
    zIndex: 1000,
  },
  bottomBarRegister: {
    backgroundColor: 'rgb(86, 23, 164)',
    borderTopColor: 'transparent',
  },
  bottomText: {
    color: 'rgb(86, 23, 164)',
    fontSize: 14,
  },
  bottomTextRegister: {
    color: '#ffffff',
  },
  bottomLink: {
    fontWeight: '600',
    color: 'rgb(86, 23, 164)',
    textDecorationLine: 'underline',
  },
  bottomLinkRegister: {
    color: '#ffffff',
  },
});
