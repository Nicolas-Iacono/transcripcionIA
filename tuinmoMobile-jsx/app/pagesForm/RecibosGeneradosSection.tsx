import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Card, Chip, Surface, Text } from 'react-native-paper';

const RECIBOS = [
  { id: '1', numero: '001', periodo: 'Julio 2024', estado: 'Pagado' },
  { id: '2', numero: '002', periodo: 'Agosto 2024', estado: 'Pendiente' },
];

export default function RecibosGeneradosSection() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Recibos generados
        </Text>
        {RECIBOS.map((recibo) => (
          <Card key={recibo.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">Recibo N° {recibo.numero}</Text>
              <Text>{recibo.periodo}</Text>
              <Chip style={styles.chip} mode="outlined">
                {recibo.estado}
              </Chip>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  title: { marginBottom: 16, fontWeight: '700' },
  card: { marginBottom: 12 },
  chip: { marginTop: 8, alignSelf: 'flex-start' },
});
