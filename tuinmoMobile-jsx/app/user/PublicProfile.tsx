import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Card, Surface, Text } from 'react-native-paper';

export default function PublicProfile() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Avatar.Text label="NR" size={72} />
          <Text variant="headlineSmall" style={styles.name}>
            Nicolás Ruiz
          </Text>
          <Text variant="bodyMedium">Inmobiliaria TuInmo</Text>
        </View>
        <Card>
          <Card.Content>
            <Text variant="titleMedium">Información pública</Text>
            <Text style={styles.row}>Email: nicolas@tuinmo.com</Text>
            <Text style={styles.row}>Teléfono: +54 351 123 456</Text>
            <Text style={styles.row}>Ciudad: Córdoba</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16 },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    marginTop: 12,
    fontWeight: '700',
  },
  row: {
    marginTop: 8,
  },
});
