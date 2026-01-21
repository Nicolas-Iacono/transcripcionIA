import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Chip, Surface, Text } from 'react-native-paper';

const PROPIEDADES = [
  { id: '1', direccion: 'Av. Colón 123', estado: 'Ocupada', renta: 250000 },
  { id: '2', direccion: 'Bv. San Juan 456', estado: 'Disponible', renta: 0 },
  { id: '3', direccion: 'Ituzaingó 789', estado: 'Ocupada', renta: 480000 },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function DashboardPropietario() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Dashboard propietario
        </Text>
        {PROPIEDADES.map((propiedad) => (
          <Card key={propiedad.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{propiedad.direccion}</Text>
              <View style={styles.row}>
                <Chip mode="outlined">{propiedad.estado}</Chip>
                <Text>{formatCurrency(propiedad.renta)}</Text>
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
