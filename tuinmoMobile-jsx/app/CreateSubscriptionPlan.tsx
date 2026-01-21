import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function CreateSubscriptionPlan() {
  const [nombre, setNombre] = useState('Plan Profesional');
  const [precio, setPrecio] = useState('8900');
  const [intervalo, setIntervalo] = useState('Mensual');
  const [descripcion, setDescripcion] = useState('Gestión completa de contratos e inmuebles');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Crear plan de suscripción
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput label="Nombre del plan" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput
              label="Precio (ARS)"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Intervalo"
              value={intervalo}
              onChangeText={setIntervalo}
              style={styles.input}
            />
            <TextInput
              label="Descripción"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Guardar plan
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
  input: {
    marginBottom: 12,
  },
});
