import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

type Props = {
  title: string;
  value: number | string;
  color: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

export default function StatCard({
  title,
  value,
  color,
  onPress,
  style,
  titleStyle,
  valueStyle,
}: Props) {
  return (
    <Card
      mode="contained"
      onPress={onPress}
      disabled={!onPress}
      style={[styles.card, { backgroundColor: color }, style]}
    >
      <Card.Content style={styles.content}>
        <View style={styles.row}>
          <Text variant="titleMedium" style={[styles.title, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
          <Text variant="headlineMedium" style={[styles.value, valueStyle]} numberOfLines={1}>
            {value}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    minHeight: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  content: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  value: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
});
