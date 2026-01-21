import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function AsignarPropietario() {
  const [propiedad, setPropiedad] = useState('Av. Colón 123');
  const [propietario, setPropietario] = useState('Juan Pérez');
  const [observaciones, setObservaciones] = useState('');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Asignar propietario
        </Text>
        <Card>
          <Card.Content>
            <TextInput
              label="Propiedad"
              value={propiedad}
              onChangeText={setPropiedad}
              style={styles.input}
            />
            <TextInput
              label="Propietario"
              value={propietario}
              onChangeText={setPropietario}
              style={styles.input}
            />
            <TextInput
              label="Observaciones"
              value={observaciones}
              onChangeText={setObservaciones}
              multiline
              numberOfLines={3}
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Asignar
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  title: { marginBottom: 16, fontWeight: '700' },
  input: { marginBottom: 12 },
});
