import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import {
  Text,
  Surface,
  Chip,
  IconButton,
  Avatar,
  ActivityIndicator,
} from 'react-native-paper';
import ModalNotas from './ModalNotas';

interface Nota {
  id: number;
  idContrato: string;
  motivo: string;
  contenido: string;
  estado: string;
  prioridad: string;
  tipo: string;
  observaciones?: string;
  fechaCreacion: string;
  visibilidad: string;
}

interface NotasContratoListProps {
  idContrato: string;
  contrato?: any;
}

const estadoColor: Record<string, string> = {
  PENDIENTE: '#FFA726',
  EN_PROCESO: '#42A5F5',
  RESUELTO: '#66BB6A',
  CANCELADO: '#EF5350',
};

function formatFecha(fechaStr: string) {
  if (!fechaStr) return '';
  try {
    const fecha = new Date(fechaStr);
    return (
      fecha.toLocaleDateString() +
      ' ' +
      fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  } catch {
    return fechaStr;
  }
}

export default function NotasContratoList({ idContrato, contrato }: NotasContratoListProps) {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectedNota, setSelectedNota] = useState<Nota | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const notasPorPagina = 3;

  useEffect(() => {
    if (!idContrato) return;

    // Simulated API call - replace with actual API when ready
    setLoading(true);
    setTimeout(() => {
      const mockNotas: Nota[] = [
        {
          id: 1,
          idContrato,
          motivo: 'Reparación de calefón',
          contenido: 'El calefón presenta una pérdida de agua. Se requiere revisión urgente.',
          estado: 'EN_PROCESO',
          prioridad: 'Alta',
          tipo: 'reparacion',
          fechaCreacion: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          visibilidad: 'PUBLICA',
        },
        {
          id: 2,
          idContrato,
          motivo: 'Mantenimiento de jardín',
          contenido: 'Programar corte de césped y poda de árboles para el próximo mes.',
          estado: 'PENDIENTE',
          prioridad: 'Media',
          tipo: 'mantenimiento',
          fechaCreacion: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          visibilidad: 'PUBLICA',
        },
        {
          id: 3,
          idContrato,
          motivo: 'Pintura de fachada',
          contenido: 'Se completó la pintura exterior del edificio según lo acordado.',
          estado: 'RESUELTO',
          prioridad: 'Baja',
          tipo: 'mantenimiento',
          fechaCreacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          visibilidad: 'PUBLICA',
        },
      ];

      setNotas(mockNotas);
      setLoading(false);
    }, 500);
  }, [idContrato]);

  if (!idContrato) return null;

  const totalPages = Math.ceil(notas.length / notasPorPagina);
  const paginatedNotas = notas.slice((page - 1) * notasPorPagina, page * notasPorPagina);

  const renderNota = ({ item }: { item: Nota }) => (
    <Pressable
      onPress={() => {
        setSelectedNota(item);
        setModalVisible(true);
      }}
      style={({ pressed }) => [styles.notaCard, pressed && styles.notaCardPressed]}
    >
      <View style={styles.notaContent}>
        <Avatar.Icon
          size={36}
          icon="message-text-outline"
          style={styles.avatar}
          color="#fff"
        />
        <View style={styles.notaInfo}>
          <Text style={styles.notaMotivo}>{item.motivo}</Text>
          <View style={styles.chipsRow}>
            <Chip
              compact
              style={[styles.chip, { backgroundColor: estadoColor[item.estado] || '#999' }]}
              textStyle={styles.chipText}
            >
              {item.estado}
            </Chip>
            <Chip compact style={styles.chipOutlined} textStyle={styles.chipTextSmall}>
              {item.prioridad}
            </Chip>
            <Chip compact style={styles.chipOutlined} textStyle={styles.chipTextSmall}>
              {item.tipo}
            </Chip>
          </View>
          <View style={styles.dateRow}>
            <IconButton icon="clock-outline" size={14} style={styles.clockIcon} />
            <Text style={styles.dateText}>{formatFecha(item.fechaCreacion)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <>
      <Surface style={styles.container} elevation={1}>
        <Text style={styles.title}>Historial de notas</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#1F2C61" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : notas.length === 0 ? (
          <Text style={styles.emptyText}>No hay notas para este contrato.</Text>
        ) : (
          <>
            <FlatList
              data={paginatedNotas}
              renderItem={renderNota}
              keyExtractor={(item) => item.id.toString()}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              scrollEnabled={false}
            />

            <View style={styles.pagination}>
              <IconButton
                icon="chevron-left"
                size={24}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              />
              <View style={styles.pageIndicator}>
                <Text style={styles.pageText}>{page}</Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || notas.length === 0}
              />
            </View>
          </>
        )}
      </Surface>

      <ModalNotas
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedNota(null);
        }}
        nota={selectedNota}
        contrato={contrato}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2C61',
    marginBottom: 16,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
  },
  notaCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notaCardPressed: {
    backgroundColor: '#F0F0F0',
  },
  notaContent: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#1F2C61',
  },
  notaInfo: {
    flex: 1,
  },
  notaMotivo: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    height: 28,
  },
  chipOutlined: {
    height: 28,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  chipText: {
    fontSize: 11,
    lineHeight: 14,
    color: '#fff',
    fontWeight: '600',
  },
  chipTextSmall: {
    fontSize: 10,
    lineHeight: 13,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clockIcon: {
    margin: 0,
    width: 16,
    height: 16,
  },
  dateText: {
    fontSize: 11,
    color: '#666',
  },
  separator: {
    height: 12,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  pageIndicator: {
    backgroundColor: '#1F2C61',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
