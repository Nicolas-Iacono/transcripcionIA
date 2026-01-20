import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Text, TextInput } from 'react-native-paper';

export type CreateOwnerProfilePayload = {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  password: string;
};

type MinimalOwner = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  email?: string;
};

type Props = {
  visible: boolean;
  owner: MinimalOwner | null;
  onDismiss: () => void;
  onSubmit?: (payload: CreateOwnerProfilePayload) => void;
};

export default function CreateOwnerProfileModal({ visible, owner, onDismiss, onSubmit }: Props) {
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (visible) setPassword('');
  }, [visible]);

  const username = useMemo(() => owner?.email ?? '', [owner?.email]);

  const handleSubmit = () => {
    if (!owner) return;
    const payload: CreateOwnerProfilePayload = {
      nombre: owner?.nombre ?? '',
      apellido: owner?.apellido ?? '',
      dni: owner?.dni ?? '',
      email: owner?.email ?? '',
      password: password ?? '',
    };
    onSubmit?.(payload);
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
      <Dialog.Title>Crear perfil de propietario</Dialog.Title>
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
            El username se toma del email del propietario.
          </Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onDismiss}>Cancelar</Button>
        <Button mode="contained" onPress={handleSubmit} disabled={!owner || password.trim().length === 0}>
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
