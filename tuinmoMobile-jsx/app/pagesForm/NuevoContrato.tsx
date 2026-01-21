import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevoContrato() {
  const [nombre, setNombre] = useState('Contrato Depto Centro');
  const [monto, setMonto] = useState('250000');
  const [inicio, setInicio] = useState('2024-09-01');
  const [fin, setFin] = useState('2026-09-01');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nuevo contrato
        </Text>
        <Card>
          <Card.Content>
            <TextInput
              label="Nombre del contrato"
              value={nombre}
              onChangeText={setNombre}
              style={styles.input}
            />
            <TextInput
              label="Monto de alquiler"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput label="Inicio" value={inicio} onChangeText={setInicio} style={styles.input} />
            <TextInput label="Fin" value={fin} onChangeText={setFin} style={styles.input} />
            <Button mode="contained" onPress={() => {}}>
              Guardar contrato
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
