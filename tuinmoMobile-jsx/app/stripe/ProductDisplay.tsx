import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';

const PRODUCTOS = [
  { id: '1', nombre: 'Plan Básico', precio: 'ARS 4.900', descripcion: 'Gestión de propiedades limitada.' },
  { id: '2', nombre: 'Plan Profesional', precio: 'ARS 8.900', descripcion: 'Contratos y cobros ilimitados.' },
];

export default function ProductDisplay() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Stripe - Productos
        </Text>
        {PRODUCTOS.map((producto) => (
          <Card key={producto.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{producto.nombre}</Text>
              <Text style={styles.subtitle}>{producto.descripcion}</Text>
              <Text variant="titleLarge">{producto.precio}</Text>
              <Button mode="contained" style={styles.button} onPress={() => {}}>
                Suscribirse
              </Button>
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
  subtitle: { marginVertical: 8 },
  button: { marginTop: 12 },
});
