import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function NuevoRecibo() {
  const [periodo, setPeriodo] = useState('Agosto 2024');
  const [fechaEmision, setFechaEmision] = useState('2024-08-01');
  const [monto, setMonto] = useState('250000');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Nuevo recibo
        </Text>
        <Card>
          <Card.Content>
            <TextInput
              label="Periodo"
              value={periodo}
              onChangeText={setPeriodo}
              style={styles.input}
            />
            <TextInput
              label="Fecha de emisión"
              value={fechaEmision}
              onChangeText={setFechaEmision}
              style={styles.input}
            />
            <TextInput
              label="Monto"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Generar recibo
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
