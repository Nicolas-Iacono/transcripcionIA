import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevaPropiedad() {
  const [direccion, setDireccion] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [tipo, setTipo] = useState('Departamento');
  const [ambientes, setAmbientes] = useState('2');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nueva propiedad
        </Text>
        <Card>
          <Card.Content>
            <TextInput
              label="Dirección"
              value={direccion}
              onChangeText={setDireccion}
              style={styles.input}
            />
            <TextInput
              label="Localidad"
              value={localidad}
              onChangeText={setLocalidad}
              style={styles.input}
            />
            <TextInput label="Tipo" value={tipo} onChangeText={setTipo} style={styles.input} />
            <TextInput
              label="Ambientes"
              value={ambientes}
              onChangeText={setAmbientes}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Guardar propiedad
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
