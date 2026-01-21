import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Surface, Text, TextInput } from 'react-native-paper';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function CalculadoraDeAlquileres() {
  const [montoBase, setMontoBase] = useState('250000');
  const [meses, setMeses] = useState('12');
  const [incremento, setIncremento] = useState('10');

  const resultado = useMemo(() => {
    const base = Number(montoBase) || 0;
    const mesesNumero = Number(meses) || 0;
    const incrementoNumero = Number(incremento) || 0;
    const montoAjustado = base + base * (incrementoNumero / 100);
    const total = montoAjustado * mesesNumero;

    return {
      base,
      meses: mesesNumero,
      incremento: incrementoNumero,
      montoAjustado,
      total,
    };
  }, [incremento, meses, montoBase]);

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Calculadora de Alquileres
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Datos del contrato</Text>
            <TextInput
              label="Monto base"
              value={montoBase}
              onChangeText={setMontoBase}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Meses"
              value={meses}
              onChangeText={setMeses}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              label="Incremento (%)"
              value={incremento}
              onChangeText={setIncremento}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">Resultado estimado</Text>
            <Divider style={styles.divider} />
            <View style={styles.rowBetween}>
              <Text>Monto base</Text>
              <Text>{formatCurrency(resultado.base)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text>Incremento</Text>
              <Text>{resultado.incremento}%</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text>Monto ajustado</Text>
              <Text>{formatCurrency(resultado.montoAjustado)}</Text>
            </View>
            <View style={styles.rowBetween}>
              <Text>Meses</Text>
              <Text>{resultado.meses}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.rowBetween}>
              <Text variant="titleMedium">Total estimado</Text>
              <Text variant="titleMedium">{formatCurrency(resultado.total)}</Text>
            </View>
          </Card.Content>
        </Card>
        <Button mode="contained" onPress={() => {}}>
          Guardar cálculo
        </Button>
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
    paddingBottom: 32,
  },
  title: {
    marginBottom: 16,
    fontWeight: '700',
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginTop: 12,
  },
  divider: {
    marginVertical: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});
