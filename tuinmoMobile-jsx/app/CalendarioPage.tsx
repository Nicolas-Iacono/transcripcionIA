import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Surface, Text } from 'react-native-paper';

const EVENTOS = [
  {
    id: '1',
    titulo: 'Visita propiedad - Av. Colón 123',
    fecha: '2024-08-20',
    hora: '10:30',
    estado: 'Confirmado',
  },
  {
    id: '2',
    titulo: 'Renovación contrato - Depto Centro',
    fecha: '2024-08-22',
    hora: '16:00',
    estado: 'Pendiente',
  },
  {
    id: '3',
    titulo: 'Cobro alquiler - Casa Norte',
    fecha: '2024-08-25',
    hora: '09:00',
    estado: 'Confirmado',
  },
];

export default function CalendarioPage() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Calendario
        </Text>
        {EVENTOS.map((evento) => (
          <Card key={evento.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{evento.titulo}</Text>
              <View style={styles.row}>
                <Text>{evento.fecha}</Text>
                <Text>{evento.hora}</Text>
              </View>
              <Chip style={styles.chip} mode="outlined">
                {evento.estado}
              </Chip>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },
});
