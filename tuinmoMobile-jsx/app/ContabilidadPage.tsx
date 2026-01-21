import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Divider, Surface, Text } from 'react-native-paper';

const MOVIMIENTOS = [
  { id: '1', concepto: 'Cobro alquiler - Depto Centro', monto: 250000, tipo: 'Ingreso' },
  { id: '2', concepto: 'Pago expensas - Casa Norte', monto: -35000, tipo: 'Egreso' },
  { id: '3', concepto: 'Comisión contrato - Local Comercial', monto: 480000, tipo: 'Ingreso' },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function ContabilidadPage() {
  const totalIngresos = MOVIMIENTOS.filter((m) => m.monto > 0).reduce((acc, m) => acc + m.monto, 0);
  const totalEgresos = MOVIMIENTOS.filter((m) => m.monto < 0).reduce((acc, m) => acc + m.monto, 0);

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Contabilidad
        </Text>
        <View style={styles.row}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="titleSmall">Ingresos</Text>
              <Text variant="titleLarge" style={styles.income}>
                {formatCurrency(totalIngresos)}
              </Text>
            </Card.Content>
          </Card>
          <Card style={styles.statCard}>
            <Card.Content>
              <Text variant="titleSmall">Egresos</Text>
              <Text variant="titleLarge" style={styles.expense}>
                {formatCurrency(totalEgresos)}
              </Text>
            </Card.Content>
          </Card>
        </View>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Movimientos recientes</Text>
            <Divider style={styles.divider} />
            {MOVIMIENTOS.map((mov) => (
              <View key={mov.id} style={styles.movement}>
                <View>
                  <Text>{mov.concepto}</Text>
                  <Text variant="labelSmall">{mov.tipo}</Text>
                </View>
                <Text style={mov.monto >= 0 ? styles.income : styles.expense}>
                  {formatCurrency(mov.monto)}
                </Text>
              </View>
            ))}
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
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
  },
  income: {
    color: '#1B5E20',
    marginTop: 6,
  },
  expense: {
    color: '#B71C1C',
    marginTop: 6,
  },
  card: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 12,
  },
  movement: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});
