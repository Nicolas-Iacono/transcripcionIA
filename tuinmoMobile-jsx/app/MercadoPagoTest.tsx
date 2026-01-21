import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';

export default function MercadoPagoTest() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Mercado Pago (Test)
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Simulador de pagos</Text>
            <Text style={styles.subtitle}>
              Ejecuta un flujo de pago de prueba para validar el checkout.
            </Text>
            <Button mode="contained" onPress={() => {}}>
              Crear pago de prueba
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
  subtitle: {
    marginVertical: 12,
  },
});
