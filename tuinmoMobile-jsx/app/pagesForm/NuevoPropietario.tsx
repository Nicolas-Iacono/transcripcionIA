import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevoPropietario() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [email, setEmail] = useState('');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nuevo propietario
        </Text>
        <Card>
          <Card.Content>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput label="Apellido" value={apellido} onChangeText={setApellido} style={styles.input} />
            <TextInput label="DNI" value={dni} onChangeText={setDni} keyboardType="numeric" style={styles.input} />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Guardar propietario
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
});
