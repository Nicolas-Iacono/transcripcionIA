import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Surface, Text, TextInput } from 'react-native-paper';

const DESTINOS = ['Vivienda', 'Comercial', 'Temporal'] as const;

export default function CrearContrato() {
  const [propiedad, setPropiedad] = useState('Av. Colón 123');
  const [inquilino, setInquilino] = useState('María Gómez');
  const [propietario, setPropietario] = useState('Juan Pérez');
  const [monto, setMonto] = useState('250000');
  const [destino, setDestino] = useState<(typeof DESTINOS)[number]>('Vivienda');
  const [fechaInicio, setFechaInicio] = useState('2024-09-01');
  const [fechaFin, setFechaFin] = useState('2026-09-01');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Crear contrato
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Propiedad"
              value={propiedad}
              onChangeText={setPropiedad}
              style={styles.input}
            />
            <TextInput
              label="Inquilino"
              value={inquilino}
              onChangeText={setInquilino}
              style={styles.input}
            />
            <TextInput
              label="Propietario"
              value={propietario}
              onChangeText={setPropietario}
              style={styles.input}
            />
            <TextInput
              label="Monto de alquiler"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />
            <Text variant="titleSmall" style={styles.sectionLabel}>
              Destino
            </Text>
            <View style={styles.chips}>
              {DESTINOS.map((item) => (
                <Chip
                  key={item}
                  selected={destino === item}
                  onPress={() => setDestino(item)}
                  style={styles.chip}
                >
                  {item}
                </Chip>
              ))}
            </View>
            <TextInput
              label="Fecha inicio"
              value={fechaInicio}
              onChangeText={setFechaInicio}
              style={styles.input}
            />
            <TextInput
              label="Fecha fin"
              value={fechaFin}
              onChangeText={setFechaFin}
              style={styles.input}
            />
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
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: '700',
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  sectionLabel: {
    marginBottom: 8,
  },
});
