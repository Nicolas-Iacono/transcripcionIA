import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Switch, Text, TextInput } from 'react-native-paper';

export default function UserSettings() {
  const [nombre, setNombre] = useState('Nicolás');
  const [apellido, setApellido] = useState('Ruiz');
  const [email, setEmail] = useState('nicolas@tuinmo.com');
  const [notificaciones, setNotificaciones] = useState(true);

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Configuración de usuario
        </Text>
        <Card>
          <Card.Content>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput label="Apellido" value={apellido} onChangeText={setApellido} style={styles.input} />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Text style={styles.switchLabel}>Notificaciones</Text>
            <Switch value={notificaciones} onValueChange={setNotificaciones} />
            <Button mode="contained" style={styles.button} onPress={() => {}}>
              Guardar cambios
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  title: { marginBottom: 16, fontWeight: '700' },
  input: { marginBottom: 12 },
  switchLabel: {
    marginBottom: 8,
  },
  button: { marginTop: 16 },
});
