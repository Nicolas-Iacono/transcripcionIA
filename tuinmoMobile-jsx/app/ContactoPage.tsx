import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Surface, Text, TextInput } from 'react-native-paper';

export default function ContactoPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');

  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineMedium" style={styles.title}>
          Contacto
        </Text>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium">¿Necesitas ayuda?</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Envíanos tu consulta y nos pondremos en contacto.
            </Text>
            <TextInput label="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
            <TextInput
              label="Correo"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              label="Mensaje"
              value={mensaje}
              onChangeText={setMensaje}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            <Button mode="contained" onPress={() => {}}>
              Enviar mensaje
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
  subtitle: {
    marginBottom: 12,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
});
