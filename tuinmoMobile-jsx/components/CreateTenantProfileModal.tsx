import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text, TextInput } from 'react-native-paper';

export type CreateTenantProfilePayload = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
};

type MinimalTenant = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
};

type Props = {
  visible: boolean;
  tenant: MinimalTenant | null;
  onDismiss: () => void;
  onSubmit?: (payload: CreateTenantProfilePayload) => void;
};

export default function CreateTenantProfileModal({ visible, tenant, onDismiss, onSubmit }: Props) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (visible) setPassword('');
  }, [visible]);

  const username = useMemo(() => tenant?.email ?? '', [tenant?.email]);

  const handleSubmit = () => {
    if (!tenant) return;
    const payload: CreateTenantProfilePayload = {
      nombre: tenant?.nombre ?? '',
      apellido: tenant?.apellido ?? '',
      dni: tenant?.dni ?? '',
      email: tenant?.email ?? '',
      password: password ?? '',
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
      <Dialog.Title>Crear perfil de inquilino</Dialog.Title>
      <Dialog.Content>
        <View style={styles.form}>
          <TextInput label="Username" value={username} disabled mode="outlined" />
          <TextInput
            label="Password"
            value={password}
            mode="outlined"
            secureTextEntry
            onChangeText={setPassword}
          />
          <Text variant="bodySmall" style={styles.helper}>
            El username se toma del email del inquilino.
          </Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancelar</Button>
        <Button mode="contained" onPress={handleSubmit} disabled={!tenant || password.trim().length === 0}>
          Crear perfil
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 18,
  },
  form: {
    gap: 12,
  },
  helper: {
    opacity: 0.7,
  },
});
