import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Surface, Text } from 'react-native-paper';

const INQUILINOS = [
  { id: '1', nombre: 'María Gómez', estado: 'Al día', deuda: 0 },
  { id: '2', nombre: 'Miguel Sosa', estado: 'Pendiente', deuda: 250000 },
  { id: '3', nombre: 'Sofía López', estado: 'Al día', deuda: 0 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function DashboardInquilinos() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Dashboard de inquilinos
        </Text>
        {INQUILINOS.map((inquilino) => (
          <Card key={inquilino.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{inquilino.nombre}</Text>
              <View style={styles.row}>
                <Chip mode="outlined">{inquilino.estado}</Chip>
                <Text>{formatCurrency(inquilino.deuda)}</Text>
              </View>
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
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
