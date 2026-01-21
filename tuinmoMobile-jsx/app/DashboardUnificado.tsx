import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Surface, Text } from 'react-native-paper';

const METRICAS = [
  { id: '1', label: 'Contratos activos', value: 18 },
  { id: '2', label: 'Cobros del mes', value: '$ 3.200.000' },
  { id: '3', label: 'Propiedades disponibles', value: 5 },
  { id: '4', label: 'Tareas pendientes', value: 7 },
];

export default function DashboardUnificado() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Dashboard unificado
        </Text>
        <View style={styles.grid}>
          {METRICAS.map((item) => (
            <Card key={item.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.value}>
                  {item.value}
                </Text>
                <Text variant="bodyMedium">{item.label}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
  },
  value: {
    marginBottom: 6,
  },
});
