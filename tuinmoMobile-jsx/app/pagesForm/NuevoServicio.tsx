import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevoServicio() {
  const [nombre, setNombre] = useState('Mantenimiento');
  const [monto, setMonto] = useState('15000');
  const [vencimiento, setVencimiento] = useState('2024-09-15');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nuevo servicio
        </Text>
        <Card>
          <Card.Content>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput
              label="Monto"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Vencimiento"
              value={vencimiento}
              onChangeText={setVencimiento}
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Guardar servicio
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
