import { router } from 'expo-router';
import { StyleSheet, ScrollView, View } from 'react-native';

import StatCard from '@/components/StatCard';
import { Surface } from 'react-native-paper';
import UltimosContratos from '@/components/UltimosContratos';

const CARDS = [
  { title: 'Propietarios', value: 13, color: '#1E2A78' },
  { title: 'Inquilinos', value: 22, color: '#0B8A7D' },
  { title: 'Propiedades', value: 21, color: '#D32F2F' },
  { title: 'Contratos', value: 20, color: '#F57C00' },
] as const;

const CONTRATOS = [
  { id: '1', label: 'Contrato #001' },
  { id: '2', label: 'Contrato #002' },
  { id: '3', label: 'Contrato #003' },
  { id: '4', label: 'Contrato #004' },
  { id: '5', label: 'Contrato #005' },
] as const;

export default function HomeScreen() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {CARDS.map((c) => (
            <StatCard
              key={c.title}
              title={c.title}
              value={c.value}
              color={c.color}
              onPress={
                c.title === 'Propietarios'
                  ? () => router.push('/propietariosPage')
                  : c.title === 'Inquilinos'
                    ? () => router.push('/InquilinosPage')
                    : c.title === 'Propiedades'
                      ? () => router.push('/PropiedadesScreen')
                      : c.title === 'Contratos'
                        ? () => router.push('/ContratosPage')
                        : undefined
              }
              style={styles.card}
            />
          ))}
        </View>
        <View style={styles.table}>
          <UltimosContratos
            title="Últimos Contratos"
            rows={[...CONTRATOS]}
            onCreatePress={() => {}}
            style={styles.card}
          />
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  list: {
    flex: 1,
    marginTop: 54,
  },
   table: {
    flex: 1,
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
  },
});
