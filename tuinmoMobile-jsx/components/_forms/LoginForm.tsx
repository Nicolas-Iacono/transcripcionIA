import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import { router } from 'expo-router';

import usuarioApi from '../../app/api/usuarioApi';
import { useAuth } from '../../app/context/GlobalAuth';

// TODO: Descomentar cuando agregues la imagen a la carpeta assets/
// const logo = require('../../assets/logotipoblanco.png');

type LoginValues = {
  username: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const { login } = useAuth();

  const [openRecover, setOpenRecover] = useState(false);
  const [recoverEmail, setRecoverEmail] = useState('');
  const [recoverLoading, setRecoverLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const initialValues: LoginValues = {
    username: '',
    password: '',
  };

  const handleSubmitLogin = async (
    values: LoginValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    try {
      console.log('📝 Enviando credenciales:', { username: values.username });
      const response = await usuarioApi.login(values);

      if (response && response.jwt && response.username) {
        console.log('✅ Guardando token y redirigiendo...');
        await login(response.jwt, response.username);
        
        // Redirigir inmediatamente a las tabs
        router.replace('/(tabs)');
      } else {
        Alert.alert(
          'Error al iniciar sesión',
          response?.message || 'Credenciales incorrectas'
        );
      }
    } catch (error: any) {
      console.error('❌ Error durante el inicio de sesión:', error);
      console.error('❌ Error completo:', JSON.stringify(error, null, 2));
      
      const errorMessage = error?.message || 'Ocurrió un error. Intentá nuevamente.';
      
      Alert.alert(
        'Error al iniciar sesión',
        errorMessage
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecoverPassword = async () => {
    if (!recoverEmail) {
      Alert.alert('Email requerido', 'Por favor ingresá tu email.');
      return;
    }

    try {
      setRecoverLoading(true);
      await usuarioApi.forgotPassword(String(recoverEmail || '').trim());

      Alert.alert(
        '¡Listo!',
        'Te enviamos un correo si el email existe. Revisá tu bandeja de entrada y spam.'
      );
      setOpenRecover(false);
      setRecoverEmail('');
    } catch (error: any) {
      console.error('Error recuperando contraseña:', error);
      const status = error?.response?.status;
      const backendMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (typeof error?.response?.data === 'string'
          ? error.response.data
          : null);

      Alert.alert(
        'No pudimos iniciar el recupero',
        backendMsg ||
          (status ? `Error ${status}` : error?.message) ||
          'Intentá nuevamente en unos minutos.'
      );
    } finally {
      setRecoverLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        {/* TODO: Descomentar cuando agregues la imagen */}
        {/* <View style={styles.logoWrapper}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
        </View> */}

        <View style={styles.titleRow}>
          <Text style={styles.title}>Login</Text>
        </View>

        <Formik initialValues={initialValues} onSubmit={handleSubmitLogin}>
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Nombre de tu inmo, email ..."
                  placeholderTextColor="#9ca3af"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.passwordRow}>
                  <TextInput
                    placeholder="Contraseña"
                    placeholderTextColor="#9ca3af"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    style={[styles.input, { flex: 1, marginRight: 8 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={styles.showPasswordButton}
                  >
                    <Text style={styles.showPasswordText}>
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.actionsWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.submitButton,
                    isSubmitting && styles.submitButtonDisabled,
                  ]}
                  disabled={isSubmitting}
                  onPress={() => handleSubmit()}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Iniciar Sesión
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setOpenRecover(true)}
                  style={styles.forgotButton}
                >
                  <Text style={styles.forgotText}>Olvidé la contraseña</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Formik>
      </View>

      <Modal
        visible={openRecover}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenRecover(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Recuperar contraseña</Text>
              <TouchableOpacity
                onPress={() => setOpenRecover(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <TextInput
                placeholder="Email"
                placeholderTextColor="#9ca3af"
                value={recoverEmail}
                onChangeText={setRecoverEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.modalInput}
              />

              <TouchableOpacity
                style={[
                  styles.modalSubmitButton,
                  (recoverLoading || !recoverEmail) &&
                    styles.modalSubmitButtonDisabled,
                ]}
                disabled={recoverLoading || !recoverEmail}
                onPress={handleRecoverPassword}
              >
                {recoverLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.modalSubmitText}>Recuperar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  logoWrapper: {
    width: 260,
    height: 260,
    marginTop: -60,
    marginBottom: -60,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  titleRow: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    color: 'rgba(53, 52, 54, 1)',
  },
  inputWrapper: {
    width: '80%',
    maxWidth: 600,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#111827',
    fontSize: 14,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f3e8ff',
  },
  showPasswordText: {
    color: 'rgba(122, 37, 192, 1)',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsWrapper: {
    width: '80%',
    maxWidth: 600,
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#775AE0',
    shadowColor: '#6C3EFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  forgotButton: {
    marginTop: 4,
  },
  forgotText: {
    color: 'rgba(122, 37, 192, 1)',
    fontWeight: '500',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    width: '100%',
    height: '40%',
    backgroundColor: 'rgb(117,104,218)',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    flex: 1,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalCloseButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalCloseText: {
    color: '#ffffff',
    fontSize: 18,
  },
  modalBody: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modalInput: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#2E2C97',
    fontSize: 14,
    marginBottom: 16,
  },
  modalSubmitButton: {
    width: 160,
    height: 48,
    borderRadius: 20,
    backgroundColor: 'rgb(54, 154, 159)',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
  },
  modalSubmitButtonDisabled: {
    opacity: 0.7,
  },
  modalSubmitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
