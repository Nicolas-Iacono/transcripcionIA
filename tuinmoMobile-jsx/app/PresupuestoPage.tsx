import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Surface, Text, TextInput } from 'react-native-paper';

type Item = {
  id: string;
  concepto: string;
  monto: string;
};

export default function PresupuestoPage() {
  const [items, setItems] = useState<Item[]>([
    { id: '1', concepto: 'Honorarios', monto: '45000' },
    { id: '2', concepto: 'Certificación', monto: '12000' },
  ]);
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');

  const total = items.reduce((acc, item) => acc + (Number(item.monto) || 0), 0);

  const onAgregar = () => {
    if (!concepto || !monto) return;
    setItems((prev) => [...prev, { id: `${Date.now()}`, concepto, monto }]);
    setConcepto('');
    setMonto('');
  };

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Presupuesto
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Agregar item</Text>
            <TextInput label="Concepto" value={concepto} onChangeText={setConcepto} style={styles.input} />
            <TextInput
              label="Monto"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />
            <Button mode="contained" onPress={onAgregar}>
              Agregar
            </Button>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content>
            <Text variant="titleMedium">Detalle</Text>
            <Divider style={styles.divider} />
            {items.map((item) => (
              <View key={item.id} style={styles.row}>
                <Text>{item.concepto}</Text>
                <Text>${item.monto}</Text>
              </View>
            ))}
            <Divider style={styles.divider} />
            <View style={styles.row}>
              <Text variant="titleMedium">Total</Text>
              <Text variant="titleMedium">${total}</Text>
            </View>
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
  divider: {
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
