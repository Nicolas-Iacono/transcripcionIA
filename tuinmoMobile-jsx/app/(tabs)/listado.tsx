import { StyleSheet, View } from 'react-native';
import { Surface, Text } from 'react-native-paper';

export default function ListadoScreen() {
  return (
    <Surface style={styles.screen} elevation={0}>
      <View style={styles.content}>
        <Text variant="titleLarge">Listado</Text>
      </View>
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
});
