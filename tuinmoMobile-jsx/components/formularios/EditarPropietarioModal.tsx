import React, { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Button,
  HelperText,
  IconButton,
  Menu,
  Portal,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

export type EditarPropietarioForm = {
  id: string;
  pronombre: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
  direccionResidencial: string;
  cuit: string;
  nacionalidad: string;
  estadoCivil: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  propietario: Partial<EditarPropietarioForm> | null;
  onSubmit?: (payload: EditarPropietarioForm) => void | Promise<void>;
};

const PRONOMBRES = ['Sr.', 'Sra.', 'Dr.', 'Dra.', 'Ing.', 'Lic.', 'Prof.'] as const;
const ESTADOS_CIVILES = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Unión Civil'] as const;
const NACIONALIDADES = [
  'Argentina',
  'Brasileña',
  'Chilena',
  'Uruguaya',
  'Paraguaya',
  'Boliviana',
  'Peruana',
  'Colombiana',
  'Venezolana',
  'Otra',
] as const;

const emptyForm = (): EditarPropietarioForm => ({
  id: '',
  pronombre: '',
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  dni: '',
  direccionResidencial: '',
  cuit: '',
  nacionalidad: '',
  estadoCivil: '',
});

const onlyDigits = (v: string) => String(v ?? '').replace(/\D/g, '');

const formatDni = (v: string) => {
  const digits = onlyDigits(v).slice(0, 11);
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const formatCuit = (v: string) => {
  const digits = onlyDigits(v).slice(0, 11);
  const a = digits.slice(0, 2);
  const b = digits.slice(2, 10);
  const c = digits.slice(10, 11);
  return [a, b, c]
    .map((seg, idx) => (idx === 0 ? seg : seg ? '-' + seg : ''))
    .join('')
    .replace(/^-/, '');
};

export default function EditarPropietarioModal({ visible, onDismiss, propietario, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<EditarPropietarioForm>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EditarPropietarioForm, string>>>({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const [pronombreOpen, setPronombreOpen] = useState(false);
  const [nacionalidadOpen, setNacionalidadOpen] = useState(false);
  const [estadoCivilOpen, setEstadoCivilOpen] = useState(false);

  useEffect(() => {
    if (!visible) return;
    if (!propietario) {
      setFormData(emptyForm());
      setErrors({});
      return;
    }

    setFormData({
      id: propietario.id ?? '',
      pronombre: propietario.pronombre ?? '',
      nombre: propietario.nombre ?? '',
      apellido: propietario.apellido ?? '',
      telefono: propietario.telefono ?? '',
      email: propietario.email ?? '',
      dni: propietario.dni ?? '',
      direccionResidencial: propietario.direccionResidencial ?? '',
      cuit: propietario.cuit ?? '',
      nacionalidad: propietario.nacionalidad ?? '',
      estadoCivil: propietario.estadoCivil ?? '',
    });
    setErrors({});
  }, [visible, propietario]);

  useEffect(() => {
    if (!visible) return;

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent as any, (e: any) => {
      const h = e?.endCoordinates?.height ?? 0;
      setKeyboardHeight(h);
    });
    const hideSub = Keyboard.addListener(hideEvent as any, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [visible]);

  const bottomCover = keyboardHeight > 0 ? 0 : insets.bottom;
  const scrollBottomPadding = 24 + Math.max(bottomCover, keyboardHeight);

  const isValidEmail = useMemo(() => {
    const e = formData.email.trim();
    if (!e) return false;
    return /\S+@\S+\.\S+/.test(e);
  }, [formData.email]);

  const validateForm = () => {
    const next: Partial<Record<keyof EditarPropietarioForm, string>> = {};

    if (!formData.nombre.trim()) next.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) next.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) next.email = 'El email es requerido';
    else if (!isValidEmail) next.email = 'El email no es válido';
    if (!formData.telefono.trim()) next.telefono = 'El teléfono es requerido';
    if (!formData.dni.trim()) next.dni = 'El DNI es requerido';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const setField = (name: keyof EditarPropietarioForm, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      await onSubmit?.({
        ...formData,
        dni: formatDni(formData.dni),
        cuit: formatCuit(formData.cuit),
      });
      onDismiss();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onDismiss();
  };

  return (
    <Portal>
      {visible && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="box-none">
          <Pressable style={[StyleSheet.absoluteFill, styles.backdrop]} onPress={handleClose} />

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.kav}
          >
            <Surface
              style={[styles.sheet, keyboardHeight > 0 ? { marginBottom: keyboardHeight } : undefined]}
              elevation={3}
            >
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                  Editar Propietario
                </Text>
                <IconButton icon="close" onPress={handleClose} disabled={loading} />
              </View>

              <ScrollView
                contentContainerStyle={[styles.body, { paddingBottom: scrollBottomPadding }]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              >
                <View style={styles.row}>
                  <View style={styles.col4}>
                    <Menu
                      visible={pronombreOpen}
                      onDismiss={() => setPronombreOpen(false)}
                      anchor={
                        <Pressable onPress={() => setPronombreOpen(true)}>
                          <View pointerEvents="none">
                            <TextInput
                            style={styles.entrada}
                              label="Pronombre"
                              mode="outlined"
                              value={formData.pronombre}
                              right={<TextInput.Icon icon="menu-down" />}
                            />
                          </View>
                        </Pressable>
                      }
                    >
                      {PRONOMBRES.map((p) => (
                        <Menu.Item
                        style={styles.entrada}
                          key={p}
                          title={p}
                          onPress={() => {
                            setPronombreOpen(false);
                            setField('pronombre', p);
                          }}
                        />
                      ))}
                    </Menu>
                  </View>

                  <View style={styles.col8}>
                    <TextInput
                    style={styles.entrada}
                      label="Nombre *"
                      mode="outlined"
                      value={formData.nombre}
                      onChangeText={(t) => setField('nombre', t)}
                    />
                    <HelperText type="error" visible={!!errors.nombre}>
                      {errors.nombre}
                    </HelperText>
                  </View>
                </View>

                <TextInput
                style={styles.entrada}
                  label="Apellido *"
                  mode="outlined"
                  value={formData.apellido}
                  onChangeText={(t) => setField('apellido', t)}
                />
                <HelperText type="error" visible={!!errors.apellido}>
                  {errors.apellido}
                </HelperText>

                <TextInput
                style={styles.entrada}
                  label="Email *"
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => setField('email', t)}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>

                <TextInput
                style={styles.entrada}
                  label="Teléfono *"
                  mode="outlined"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(t) => setField('telefono', t)}
                />
                <HelperText type="error" visible={!!errors.telefono}>
                  {errors.telefono}
                </HelperText>

                <View style={styles.row}>
                  <View style={styles.col6}>
                    <TextInput
                    style={styles.entrada}
                      label="DNI *"
                      mode="outlined"
                      keyboardType="number-pad"
                      value={formData.dni}
                      onChangeText={(t) => setField('dni', formatDni(t))}
                    />
                    <HelperText type="error" visible={!!errors.dni}>
                      {errors.dni}
                    </HelperText>
                  </View>

                  <View style={styles.col6}>
                    <TextInput
                    style={styles.entrada}
                      label="CUIT"
                      mode="outlined"
                      keyboardType="number-pad"
                      value={formData.cuit}
                      onChangeText={(t) => setField('cuit', formatCuit(t))}
                      placeholder="XX-XXXXXXXX-X"
                    />
                  </View>
                </View>

                <TextInput
                  label="Dirección Residencial"
                  mode="outlined"
                  value={formData.direccionResidencial}
                  onChangeText={(t) => setField('direccionResidencial', t)}
                  multiline
                />

                <View style={styles.row}>
                  <View style={styles.col6}>
                    <Menu
                      visible={nacionalidadOpen}
                      onDismiss={() => setNacionalidadOpen(false)}
                      anchor={
                        <Pressable onPress={() => setNacionalidadOpen(true)}>
                          <View pointerEvents="none">
                            <TextInput
                              style={styles.entrada}
                              label="Nacionalidad"
                              mode="outlined"
                              value={formData.nacionalidad}
                              right={<TextInput.Icon icon="menu-down" />}
                            />
                          </View>
                        </Pressable>
                      }
                    >
                      {NACIONALIDADES.map((n) => (
                        <Menu.Item
                          key={n}
                          title={n}
                          onPress={() => {
                            setNacionalidadOpen(false);
                            setField('nacionalidad', n);
                          }}
                        />
                      ))}
                    </Menu>
                  </View>

                  <View style={styles.col6}>
                    <Menu
                      visible={estadoCivilOpen}
                      onDismiss={() => setEstadoCivilOpen(false)}
                      anchor={
                        <Pressable onPress={() => setEstadoCivilOpen(true)}>
                          <View pointerEvents="none">
                            <TextInput
                            style={styles.entrada}
                              label="Estado Civil"
                              mode="outlined"
                              value={formData.estadoCivil}
                              right={<TextInput.Icon icon="menu-down" />}
                            />
                          </View>
                        </Pressable>
                      }
                    >
                      {ESTADOS_CIVILES.map((ec) => (
                        <Menu.Item
                          key={ec}
                          title={ec}
                          onPress={() => {
                            setEstadoCivilOpen(false);
                            setField('estadoCivil', ec);
                          }}
                        />
                      ))}
                    </Menu>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.actions}>
                <Button mode="outlined" onPress={handleClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button mode="contained" onPress={handleSubmit} disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar'}
                </Button>
                {loading && <ActivityIndicator style={styles.spinner} />}
              </View>

              <View style={{ height: bottomCover, backgroundColor: '#fff' }} />
            </Surface>
          </KeyboardAvoidingView>
        </View>
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'flex-end',
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  kav: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: '100%',
    marginBottom: 0,
    paddingBottom: 18,
    backgroundColor: '#fff',
    maxHeight: '100%',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontWeight: '800',
  },
  body: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 6,
  },
  entrada: {
    borderRadius: 25,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col4: {
    flex: 4,
  },
  col8: {
    flex: 8,

  },
  col6: {
    flex: 6,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  spinner: {
    marginLeft: 4,
  },
});
