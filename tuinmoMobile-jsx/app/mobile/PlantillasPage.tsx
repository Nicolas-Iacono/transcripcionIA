import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';

const PLANTILLAS = [
  { id: '1', nombre: 'Contrato de locación', descripcion: 'Plantilla estándar de contrato.' },
  { id: '2', nombre: 'Recibo de alquiler', descripcion: 'Plantilla con detalle de impuestos.' },
  { id: '3', nombre: 'Aviso de renovación', descripcion: 'Mensaje para renovación de contrato.' },
];

export default function PlantillasPage() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Plantillas
        </Text>
        {PLANTILLAS.map((plantilla) => (
          <Card key={plantilla.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{plantilla.nombre}</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {plantilla.descripcion}
              </Text>
              <Button mode="outlined" onPress={() => {}}>
                Usar plantilla
              </Button>
            </Card.Content>
          </Card>
        ))}
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
    marginBottom: 12,
  },
  subtitle: {
    marginVertical: 8,
  },
});
