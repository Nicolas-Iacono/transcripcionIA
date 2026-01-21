import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevoInterviniente() {
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('Corredor');
  const [contacto, setContacto] = useState('');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nuevo interviniente
        </Text>
        <Card>
          <Card.Content>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput label="Rol" value={rol} onChangeText={setRol} style={styles.input} />
            <TextInput
              label="Contacto"
              value={contacto}
              onChangeText={setContacto}
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Guardar interviniente
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
