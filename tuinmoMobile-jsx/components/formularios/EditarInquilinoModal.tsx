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
  Portal,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';

export type EditarInquilinoForm = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  dni: string;
  direccionResidencial: string;
  cuit: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  inquilino: Partial<EditarInquilinoForm> | null;
  onSubmit?: (payload: EditarInquilinoForm) => void | Promise<void>;
};

const emptyForm = (): EditarInquilinoForm => ({
  id: '',
  nombre: '',
  apellido: '',
  telefono: '',
  email: '',
  dni: '',
  direccionResidencial: '',
  cuit: '',
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

export default function EditarInquilinoModal({ visible, onDismiss, inquilino, onSubmit }: Props) {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState<EditarInquilinoForm>(emptyForm());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof EditarInquilinoForm, string>>>({});
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (!inquilino) {
      setFormData(emptyForm());
      setErrors({});
      return;
    }

    setFormData({
      id: inquilino.id ?? '',
      nombre: inquilino.nombre ?? '',
      apellido: inquilino.apellido ?? '',
      telefono: inquilino.telefono ?? '',
      email: inquilino.email ?? '',
      dni: inquilino.dni ?? '',
      direccionResidencial: inquilino.direccionResidencial ?? '',
      cuit: inquilino.cuit ?? '',
    });
    setErrors({});
  }, [visible, inquilino]);

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
    const next: Partial<Record<keyof EditarInquilinoForm, string>> = {};

    if (!formData.nombre.trim()) next.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) next.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) next.email = 'El email es requerido';
    else if (!isValidEmail) next.email = 'El email no es válido';
    if (!formData.telefono.trim()) next.telefono = 'El teléfono es requerido';
    if (!formData.dni.trim()) next.dni = 'El DNI es requerido';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const setField = (name: keyof EditarInquilinoForm, value: string) => {
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

          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.kav}>
            <Surface
              style={[styles.sheet, keyboardHeight > 0 ? { marginBottom: keyboardHeight } : undefined]}
              elevation={3}
            >
              <View style={styles.header}>
                <Text variant="titleMedium" style={styles.title}>
                  Editar Inquilino
                </Text>
                <IconButton icon="close" onPress={handleClose} disabled={loading} />
              </View>

              <ScrollView
                contentContainerStyle={[styles.body, { paddingBottom: scrollBottomPadding }]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
              >
                <TextInput
                  label="Nombre *"
                  mode="outlined"
                  value={formData.nombre}
                  onChangeText={(t) => setField('nombre', t)}
                  style={styles.entrada}
                />
                <HelperText type="error" visible={!!errors.nombre}>
                  {errors.nombre}
                </HelperText>

                <TextInput
                  label="Apellido *"
                  mode="outlined"
                  value={formData.apellido}
                  onChangeText={(t) => setField('apellido', t)}
                  style={styles.entrada}
                />
                <HelperText type="error" visible={!!errors.apellido}>
                  {errors.apellido}
                </HelperText>

                <TextInput
                  label="Email *"
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(t) => setField('email', t)}
                  style={styles.entrada}
                />
                <HelperText type="error" visible={!!errors.email}>
                  {errors.email}
                </HelperText>

                <TextInput
                  label="Teléfono *"
                  mode="outlined"
                  keyboardType="phone-pad"
                  value={formData.telefono}
                  onChangeText={(t) => setField('telefono', t)}
                  style={styles.entrada}
                />
                <HelperText type="error" visible={!!errors.telefono}>
                  {errors.telefono}
                </HelperText>

                <View style={styles.row}>
                  <View style={styles.col6}>
                    <TextInput
                      label="DNI *"
                      mode="outlined"
                      keyboardType="number-pad"
                      value={formData.dni}
                      onChangeText={(t) => setField('dni', formatDni(t))}
                      style={styles.entrada}
                    />
                    <HelperText type="error" visible={!!errors.dni}>
                      {errors.dni}
                    </HelperText>
                  </View>

                  <View style={styles.col6}>
                    <TextInput
                      label="CUIT"
                      mode="outlined"
                      keyboardType="number-pad"
                      value={formData.cuit}
                      onChangeText={(t) => setField('cuit', formatCuit(t))}
                      placeholder="XX-XXXXXXXX-X"
                      style={styles.entrada}
                    />
                  </View>
                </View>

                <TextInput
                  label="Dirección Residencial"
                  mode="outlined"
                  value={formData.direccionResidencial}
                  onChangeText={(t) => setField('direccionResidencial', t)}
                  multiline
                  style={styles.entrada}
                />
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
    maxHeight: '92%',
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
