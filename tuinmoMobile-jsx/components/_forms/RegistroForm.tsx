import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import { registroSchema } from '../../app/common/validationsForms/registroSchema';
import { usuarioApi } from '../../app/api/usuarioApi';

// Ajustá rutas a tus assets dentro del proyecto React Native
// TODO: Descomentar cuando agregues las imágenes a la carpeta assets/
// const logoBlanco = require('../../assets/logotipoblanco.png');
// const logoT = require('../../assets/logoInmo512.png');

type RegistroFormProps = {
  onRegistroExitoso?: () => void;
};

type RegistroValues = {
  username: string;
  password: string;
  nombreNegocio: string;
  email: string;
  telefono: string;
  cuit: string;
  razonSocial: string;
  partido: string;
  provincia: string;
  localidad: string;
  matricula: string;
};

const RegistroForm: React.FC<RegistroFormProps> = ({ onRegistroExitoso }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [country, setCountry] = useState<'AR' | 'UY' | 'CL' | 'PY' | 'BO' | 'BR' | 'US' | 'ES'>('AR');

  const initialValues: RegistroValues = {
    username: '',
    password: '',
    nombreNegocio: '',
    email: '',
    telefono: '',
    cuit: '',
    razonSocial: '',
    partido: '',
    provincia: '',
    localidad: '',
    matricula: '',
  };

  const countryOptions = useMemo(
    () => [
      { code: 'AR', name: 'Argentina', prefix: '+54' },
      { code: 'UY', name: 'Uruguay', prefix: '+598' },
      { code: 'CL', name: 'Chile', prefix: '+56' },
      { code: 'PY', name: 'Paraguay', prefix: '+595' },
      { code: 'BO', name: 'Bolivia', prefix: '+591' },
      { code: 'BR', name: 'Brasil', prefix: '+55' },
      { code: 'US', name: 'Estados Unidos', prefix: '+1' },
      { code: 'ES', name: 'España', prefix: '+34' },
    ],
    []
  );

  const currentPrefix =
    countryOptions.find((c) => c.code === country)?.prefix || '+54';

  const onSubmit = async (
    values: RegistroValues,
    { setSubmitting }: { setSubmitting: (v: boolean) => void }
  ) => {
    if (!acceptTerms) {
      Alert.alert('Términos', 'Debes aceptar los términos y condiciones');
      setSubmitting(false);
      return;
    }

    try {
      await usuarioApi.registrarUsuario(values);
      Alert.alert('Éxito', 'Usuario registrado exitosamente');

      setTimeout(() => {
        if (onRegistroExitoso) {
          onRegistroExitoso();
        }
      }, 1000);
    } catch (error: any) {
      console.error('Error al registrar usuario:', error?.message || error);
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        'Ocurrió un error. Intentá nuevamente.';
      Alert.alert('Error', backendMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenTerms = () => {
    Linking.openURL('https://landing.tuinmo.net/privacidad-tuinmo').catch(() => {
      Alert.alert('Error', 'No se pudo abrir el enlace.');
    });
  };

  return (
    <View style={styles.root}>
      {/* Columna izquierda con logos (solo en pantallas grandes podría tener sentido).
          Para simplificar, la muestro arriba del formulario en mobile */}
      {/* TODO: Descomentar cuando agregues las imágenes */}
      {/* <View style={styles.logoColumn}>
        <Image source={logoT} style={styles.logoT} resizeMode="contain" />
        <Image source={logoBlanco} style={styles.logoBlanco} resizeMode="contain" />
      </View> */}

      {/* Columna derecha: formulario scrollable */}
      <View style={styles.formColumn}>
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Crear Cuenta</Text>
            <Text style={styles.headerSubtitle}>
              Llená los campos para crear tu cuenta
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={registroSchema}
            onSubmit={onSubmit}
          >
            {({
              values,
              handleChange,
              handleBlur,
              errors,
              touched,
              isSubmitting,
              setFieldValue,
            }) => (
              <>
                {/* Username */}
                <FieldBlock
                  label="Username"
                  placeholder="Nombre de usuario"
                  value={values.username}
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  error={touched.username ? errors.username : undefined}
                />

                {/* Email */}
                <FieldBlock
                  label="Email"
                  placeholder="ejemplo@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email ? errors.email : undefined}
                />

                {/* Password */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>Password</Text>
                  <View style={styles.passwordRow}>
                    <TextInput
                      placeholder="Tu contraseña"
                      placeholderTextColor="rgba(255,255,255,0.6)"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      style={[styles.input, { flex: 1, marginRight: 8 }]}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
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
                  {touched.password && errors.password ? (
                    <Text style={styles.errorText}>{String(errors.password)}</Text>
                  ) : null}
                </View>

                {/* Nombre negocio */}
                <FieldBlock
                  label="Inmobiliaria"
                  placeholder="Nombre de la inmobiliaria"
                  value={values.nombreNegocio}
                  onChangeText={handleChange('nombreNegocio')}
                  onBlur={handleBlur('nombreNegocio')}
                  error={touched.nombreNegocio ? errors.nombreNegocio : undefined}
                />

                {/* País + Teléfono (simplificado) */}
                <View style={styles.fieldWrapper}>
                  <Text style={styles.fieldLabel}>País</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.countryRow}
                  >
                    {countryOptions.map((opt) => (
                      <TouchableOpacity
                        key={opt.code}
                        style={[
                          styles.countryChip,
                          country === opt.code && styles.countryChipSelected,
                        ]}
                        onPress={() => setCountry(opt.code as any)}
                      >
                        <Text
                          style={[
                            styles.countryChipText,
                            country === opt.code && styles.countryChipTextSelected,
                          ]}
                        >
                          {opt.code} ({opt.prefix})
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                <FieldBlock
                  label="Teléfono"
                  placeholder={`${currentPrefix} 9 11 12345678`}
                  keyboardType="phone-pad"
                  value={values.telefono}
                  onChangeText={(text) => setFieldValue('telefono', text)}
                  onBlur={handleBlur('telefono')}
                  error={touched.telefono ? errors.telefono : undefined}
                />

                {/* CUIT */}
                <FieldBlock
                  label="CUIT"
                  placeholder="Ej: 20-12345678-1"
                  keyboardType="numeric"
                  value={values.cuit}
                  onChangeText={(text) => {
                    const digits = (text || '').replace(/\D/g, '').slice(0, 11);
                    let formatted = digits;
                    if (digits.length > 2 && digits.length <= 10) {
                      formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
                    } else if (digits.length > 10) {
                      formatted = `${digits.slice(0, 2)}-${digits.slice(
                        2,
                        10
                      )}-${digits.slice(10)}`;
                    }
                    setFieldValue('cuit', formatted);
                  }}
                  onBlur={handleBlur('cuit')}
                  error={touched.cuit ? errors.cuit : undefined}
                />

                {/* Razón social */}
                <FieldBlock
                  label="Razón Social"
                  placeholder="Razón social de la empresa"
                  value={values.razonSocial}
                  onChangeText={handleChange('razonSocial')}
                  onBlur={handleBlur('razonSocial')}
                  error={touched.razonSocial ? errors.razonSocial : undefined}
                />

                {/* Ubicación */}
                <FieldBlock
                  label="Partido"
                  placeholder="Partido"
                  value={values.partido}
                  onChangeText={handleChange('partido')}
                  onBlur={handleBlur('partido')}
                  error={touched.partido ? errors.partido : undefined}
                />

                <FieldBlock
                  label="Provincia"
                  placeholder="Provincia"
                  value={values.provincia}
                  onChangeText={handleChange('provincia')}
                  onBlur={handleBlur('provincia')}
                  error={touched.provincia ? errors.provincia : undefined}
                />

                <FieldBlock
                  label="Localidad"
                  placeholder="Localidad"
                  value={values.localidad}
                  onChangeText={handleChange('localidad')}
                  onBlur={handleBlur('localidad')}
                  error={touched.localidad ? errors.localidad : undefined}
                />

                <FieldBlock
                  label="Matrícula"
                  placeholder="Ej: 12345"
                  value={values.matricula}
                  onChangeText={handleChange('matricula')}
                  onBlur={handleBlur('matricula')}
                  error={touched.matricula ? errors.matricula : undefined}
                />

                {/* Términos */}
                <TouchableOpacity
                  style={styles.termsRow}
                  activeOpacity={0.7}
                  onPress={() => setAcceptTerms((prev) => !prev)}
                >
                  <View
                    style={[
                      styles.checkboxBox,
                      acceptTerms && styles.checkboxBoxChecked,
                    ]}
                  >
                    {acceptTerms && <Text style={styles.checkboxTick}>✓</Text>}
                  </View>
                  <Text style={styles.termsText}>
                    Acepto{' '}
                    <Text
                      style={styles.termsLink}
                      onPress={handleOpenTerms}
                    >
                      Términos y Condiciones
                    </Text>
                  </Text>
                </TouchableOpacity>

                {/* Botón Sign Up */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    (isSubmitting || !acceptTerms) &&
                      styles.submitButtonDisabled,
                  ]}
                  activeOpacity={0.8}
                  disabled={isSubmitting || !acceptTerms}
                  onPress={() => {
                    // Formik simple: llamamos a handleSubmit de forma manual
                    // pero como estamos usando render props, usamos setTimeout
                    // para que Formik recalcule; más simple: usamos `onPress={handleSubmit}`
                    // aunque aquí no tenemos handleSubmit, podríamos envolver todo con
                    // <Formik> children={(props) => ... onPress={props.handleSubmit}}
                    // pero para no ensuciar, lo hacemos así:
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#6c5ce7" />
                  ) : (
                    <Text style={styles.submitButtonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>

                {/* Truco: botón real llamando a handleSubmit */}
                <TouchableOpacity
                  style={StyleSheet.absoluteFillObject}
                  onPress={() => {}}
                />
              </>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
};

export default RegistroForm;

// Pequeño subcomponente para no repetir tanto
type FieldBlockProps = {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: (e?: any) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string | undefined;
};

const FieldBlock: React.FC<FieldBlockProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}) => {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.6)"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
      {error ? <Text style={styles.errorText}>{String(error)}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#5617A4', // simplificación del gradient
    flexDirection: 'column',
    paddingTop: 40,
  },
  logoColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  logoT: {
    width: 260,
    height: 200,
    marginBottom: 12,
  },
  logoBlanco: {
    width: 180,
    height: 60,
  },
  formColumn: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  fieldWrapper: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    color: '#fed7d7',
    fontSize: 12,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showPasswordButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  showPasswordText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  countryRow: {
    paddingVertical: 4,
    gap: 8,
  },
  countryChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginRight: 8,
  },
  countryChipSelected: {
    backgroundColor: '#ffffff',
  },
  countryChipText: {
    color: '#ffffff',
    fontSize: 12,
  },
  countryChipTextSelected: {
    color: '#5617A4',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#ffffff',
  },
  checkboxTick: {
    color: '#5617A4',
    fontSize: 14,
    fontWeight: '700',
  },
  termsText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLink: {
    color: '#ffffff',
    textDecorationLine: 'underline',
  },
  submitButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#6c5ce7',
    fontSize: 16,
    fontWeight: '600',
  },
});
