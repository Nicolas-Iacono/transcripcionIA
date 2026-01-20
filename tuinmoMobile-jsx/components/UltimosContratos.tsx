import { useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Button, Card, DataTable, Text } from 'react-native-paper';

type Row = {
  id: string;
  label: string;
};

type Props = {
  title: string;
  rows: Row[];
  headerColor?: string;
  onCreatePress?: () => void;
  onRowPress?: (row: Row) => void;
  style?: StyleProp<ViewStyle>;
};

export default function UltimosContratos({
  title,
  rows,
  headerColor = '#1E2A78',
  onCreatePress,
  onRowPress,
  style,
}: Props) {
  const itemsPerPageOptions = useMemo(() => [4, 8, 12], []);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);

  const numberOfPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));
  const from = page * itemsPerPage;
  const to = Math.min(from + itemsPerPage, rows.length);
  const pageRows = rows.slice(from, to);

  return (
    <Card style={[styles.card, style]} mode="elevated">
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text variant="titleLarge" style={styles.headerText} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <DataTable style={styles.table}>
        {pageRows.map((r) => (
          <DataTable.Row key={r.id} onPress={onRowPress ? () => onRowPress(r) : undefined}>
            <DataTable.Cell>{r.label}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={numberOfPages}
          onPageChange={setPage}
          label={`${from + 1}-${to} de ${rows.length}`}
          numberOfItemsPerPageList={itemsPerPageOptions}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={(n) => {
            setItemsPerPage(n);
            setPage(0);
          }}
          showFastPaginationControls={false}
          selectPageDropdownLabel="Filas por página"
        />
      </DataTable>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          icon="plus"
          onPress={onCreatePress}
          disabled={!onCreatePress}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
        >
          Crear Contrato
        </Button>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerText: {
    color: '#fff',
    fontWeight: '800',
  },
  table: {
    backgroundColor: '#fff',
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  createButton: {
    borderRadius: 10,
    marginTop: 16,
  },
  createButtonContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
});
