import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Surface, Text } from 'react-native-paper';
import { router } from 'expo-router';

const CONTRATOS = [
  { id: '1', nombre: 'Contrato Depto Centro', inquilino: 'María Gómez' },
  { id: '2', nombre: 'Contrato Casa Norte', inquilino: 'Sofía López' },
  { id: '3', nombre: 'Contrato Local Comercial', inquilino: 'Miguel Sosa' },
];

export default function RecibosPage() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Recibos
        </Text>
        {CONTRATOS.map((contrato) => (
          <Card key={contrato.id} style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium">{contrato.nombre}</Text>
              <Text variant="bodyMedium" style={styles.subtitle}>
                {contrato.inquilino}
              </Text>
              <View style={styles.actions}>
                <Button mode="contained" onPress={() => router.push(`/RecibosGeneradosPage?contratoId=${contrato.id}`)}>
                  Ver recibos
                </Button>
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
  subtitle: {
    marginTop: 4,
  },
  actions: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
});
