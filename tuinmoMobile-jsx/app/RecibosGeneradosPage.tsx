import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  IconButton,
  ActivityIndicator,
  FAB,
  Button,
  Divider,
} from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_MARGIN = width * 0.05;

interface Recibo {
  id: string;
  numeroRecibo: string;
  periodo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  concepto: string;
  montoTotal: number;
  estado: boolean;
  impuestos?: Array<{
    id: string;
    tipoImpuesto: string;
    montoAPagar: number;
    porcentaje: number;
  }>;
}

export default function RecibosGeneradosPage() {
  const { contratoId } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(true);
  const [recibos, setRecibos] = useState<Recibo[]>([]);
  const [filtro, setFiltro] = useState<'todos' | 'pagados' | 'pendientes'>('todos');
  const [activeIndex, setActiveIndex] = useState(0);
  const [updatingEstado, setUpdatingEstado] = useState<{ [key: string]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecibo, setSelectedRecibo] = useState<Recibo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadRecibos();
  }, [contratoId]);

  const loadRecibos = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrar con API
      // const response = await fetch(`/api/recibos/${contratoId}`);
      // const data = await response.json();
      
      // Datos de ejemplo
      const mockRecibos: Recibo[] = [
        {
          id: '1',
          numeroRecibo: '001',
          periodo: 'Enero 2024',
          fechaEmision: '2024-01-01',
          fechaVencimiento: '2024-01-10',
          concepto: 'Alquiler mensual',
          montoTotal: 250000,
          estado: true,
          impuestos: [
            { id: '1', tipoImpuesto: 'AGUA', montoAPagar: 5000, porcentaje: 100 },
            { id: '2', tipoImpuesto: 'LUZ', montoAPagar: 8000, porcentaje: 100 },
          ],
        },
        {
          id: '2',
          numeroRecibo: '002',
          periodo: 'Febrero 2024',
          fechaEmision: '2024-02-01',
          fechaVencimiento: '2024-02-10',
          concepto: 'Alquiler mensual',
          montoTotal: 250000,
          estado: false,
          impuestos: [
            { id: '3', tipoImpuesto: 'GAS', montoAPagar: 6000, porcentaje: 100 },
          ],
        },
      ];
      
      setRecibos(mockRecibos);
    } catch (error) {
      console.error('Error cargando recibos:', error);
      Alert.alert('Error', 'No se pudieron cargar los recibos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRecibos = (recibos || []).filter((recibo) => {
    if (filtro === 'pagados') return recibo.estado;
    if (filtro === 'pendientes') return !recibo.estado;
    return true;
  });

  const formatFecha = (fecha: string) => {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-AR');
  };

  const handleUpdateEstado = async (recibo: Recibo) => {
    setUpdatingEstado({ ...updatingEstado, [recibo.id]: true });
    try {
      // TODO: Integrar con API
      // await fetch(`/api/recibos/${recibo.id}/estado`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ estado: !recibo.estado }),
      // });
      
      setRecibos((recibos || []).map(r => 
        r.id === recibo.id ? { ...r, estado: !r.estado } : r
      ));
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setUpdatingEstado({ ...updatingEstado, [recibo.id]: false });
    }
  };

  const handleOpenReciboModal = (recibo: Recibo) => {
    setSelectedRecibo(recibo);
    setModalVisible(true);
  };

  const handleCloseReciboModal = () => {
    setModalVisible(false);
    setSelectedRecibo(null);
  };

  const handleDeleteRecibo = async () => {
    if (!selectedRecibo) return;
    
    Alert.alert(
      'Eliminar Recibo',
      `¿Estás seguro de eliminar el recibo N°${selectedRecibo.numeroRecibo}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsDeleting(true);
              // TODO: Integrar con API
              // await fetch(`/api/recibos/${selectedRecibo.id}`, { method: 'DELETE' });
              
              setRecibos((prev) => prev.filter((r) => r.id !== selectedRecibo.id));
              Alert.alert('Éxito', 'Recibo eliminado correctamente');
              handleCloseReciboModal();
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el recibo');
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const handleDownloadPDF = (recibo: Recibo) => {
    Alert.alert('Descargar PDF', `Descargando recibo ${recibo.numeroRecibo}`);
    // TODO: Implementar descarga de PDF
  };

  const getTipoImpuestoColor = (tipo: string) => {
    const map: { [key: string]: string } = {
      AGUA: '#1565c0',
      LUZ: '#f57f17',
      GAS: '#e65100',
      MUNICIPAL: '#424242',
      EXP_ORD: '#1b5e20',
      EXP_EXT_ORD: '#1b5e20',
      DEUDA_PENDIENTE: '#b71c1c',
    };
    return map[tipo.toUpperCase()] || '#424242';
  };

  const getTipoImpuestoIcon = (tipo: string) => {
    const map: { [key: string]: string } = {
      AGUA: 'water',
      LUZ: 'lightbulb',
      GAS: 'fire',
      MUNICIPAL: 'city',
    };
    return map[tipo.toUpperCase()] || 'cash';
  };

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_MARGIN * 2));
    setActiveIndex(index);
  };

  const calculateTotal = (recibo: Recibo) => {
    if (!recibo || !recibo.montoTotal) return 0;
    const impuestosTotal = (recibo.impuestos || []).reduce((acc, imp) => {
      const monto = parseFloat(String(imp?.montoAPagar || 0));
      const porcentaje = parseFloat(String(imp?.porcentaje || 0));
      const calculado = (porcentaje === 0 || porcentaje === 100) ? monto : monto * (porcentaje / 100);
      return acc + calculado;
    }, 0);
    return recibo.montoTotal + impuestosTotal;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1F2C61" />
          <Text style={styles.loadingText}>Cargando recibos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Recibos Generados</Text>
        </View>
        <FAB
          icon="plus"
          size="small"
          style={styles.fab}
          onPress={() => Alert.alert('Crear Recibo', 'Funcionalidad en desarrollo')}
        />
      </View>

      <View style={styles.filtersContainer}>
        <Button
          mode={filtro === 'todos' ? 'contained' : 'outlined'}
          onPress={() => setFiltro('todos')}
          style={styles.filterButton}
          buttonColor={filtro === 'todos' ? '#1F2C61' : 'transparent'}
          textColor={filtro === 'todos' ? 'white' : 'black'}
        >
          Todos
        </Button>
        <Button
          mode={filtro === 'pagados' ? 'contained' : 'outlined'}
          onPress={() => setFiltro('pagados')}
          style={styles.filterButton}
          buttonColor={filtro === 'pagados' ? '#1F2C61' : 'transparent'}
          textColor={filtro === 'pagados' ? 'white' : 'black'}
        >
          Pagados
        </Button>
        <Button
          mode={filtro === 'pendientes' ? 'contained' : 'outlined'}
          onPress={() => setFiltro('pendientes')}
          style={styles.filterButton}
          buttonColor={filtro === 'pendientes' ? '#1F2C61' : 'transparent'}
          textColor={filtro === 'pendientes' ? 'white' : 'black'}
        >
          Pendientes
        </Button>
      </View>

      {filteredRecibos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay recibos que coincidan con el filtro seleccionado
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredRecibos}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item: recibo, index }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleOpenReciboModal(recibo)}
            >
              <Card
                style={[
                  styles.card,
                  activeIndex === index && styles.activeCard,
                ]}
              >
              <View style={styles.cardHeader}>
                <Text style={styles.cardHeaderText}>Recibo N° {recibo.numeroRecibo}</Text>
                <View style={styles.cardHeaderActions}>
                  <IconButton
                    icon="share-variant"
                    size={20}
                    iconColor="white"
                    onPress={() => handleDownloadPDF(recibo)}
                  />
                  <Chip
                    icon={recibo.estado ? 'check-circle' : 'close-circle'}
                    mode="flat"
                    style={[
                      styles.estadoChip,
                      recibo.estado ? styles.estadoChipPagado : styles.estadoChipPendiente,
                    ]}
                    textStyle={styles.estadoChipText}
                    onPress={() => handleUpdateEstado(recibo)}
                  >
                    {updatingEstado[recibo.id] ? 'Actualizando...' : (recibo.estado ? 'Pagado' : 'Pendiente')}
                  </Chip>
                </View>
              </View>

              <Card.Content style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Periodo:</Text>
                  <Text style={styles.infoValue}>{recibo.periodo || 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fecha:</Text>
                  <Text style={styles.infoValue}>{formatFecha(recibo.fechaEmision)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Concepto:</Text>
                  <Text style={styles.infoValue}>{recibo.concepto || 'N/A'}</Text>
                </View>

                <View style={styles.montoRow}>
                  <Text style={styles.infoLabel}>Monto:</Text>
                  <Text style={styles.montoValue}>
                    ${recibo.montoTotal.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                {recibo.impuestos && recibo.impuestos.length > 0 && (
                  <View style={styles.impuestosContainer}>
                    {(recibo.impuestos || []).map((imp) => (
                      <Chip
                        key={imp.id}
                        icon={getTipoImpuestoIcon(imp.tipoImpuesto)}
                        mode="outlined"
                        style={[
                          styles.impuestoChip,
                          { borderColor: getTipoImpuestoColor(imp.tipoImpuesto) },
                        ]}
                        textStyle={{ color: getTipoImpuestoColor(imp.tipoImpuesto) }}
                      >
                        {imp.tipoImpuesto}
                      </Chip>
                    ))}
                  </View>
                )}

                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>
                    ${calculateTotal(recibo).toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal de detalle del recibo */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseReciboModal}
      >
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback onPress={handleCloseReciboModal}>
            <View style={styles.modalBackdropTouchable} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {/* Header fijo */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Detalle del Recibo N°{selectedRecibo?.numeroRecibo || ''}
              </Text>
              <IconButton
                icon="delete"
                size={24}
                iconColor="#D32F2F"
                onPress={handleDeleteRecibo}
                disabled={isDeleting}
              />
            </View>

            <Divider />

            {/* Contenido scrollable */}
            {selectedRecibo && (
              <ScrollView 
                style={styles.modalScrollContent} 
                contentContainerStyle={styles.modalScrollContentContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha Emisión</Text>
                  <Text style={styles.detailValue}>{formatFecha(selectedRecibo.fechaEmision)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Fecha Vencimiento</Text>
                  <Text style={styles.detailValue}>{formatFecha(selectedRecibo.fechaVencimiento)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Periodo</Text>
                  <Text style={styles.detailValue}>{selectedRecibo.periodo || 'N/A'}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Estado</Text>
                  <View style={styles.estadoChipContainer}>
                    <Chip
                      icon={selectedRecibo.estado ? 'check-circle' : 'close-circle'}
                      mode="flat"
                      style={[
                        styles.estadoChipModal,
                        selectedRecibo.estado ? styles.estadoChipPagado : styles.estadoChipPendiente,
                      ]}
                      textStyle={styles.estadoChipText}
                    >
                      {selectedRecibo.estado ? 'Pagado' : 'Pendiente'}
                    </Chip>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Concepto</Text>
                  <Text style={styles.detailValue}>{selectedRecibo.concepto || 'N/A'}</Text>
                </View>

                <Divider style={styles.modalDivider} />

                <Text style={styles.sectionTitle}>Impuestos</Text>
                {selectedRecibo.impuestos && selectedRecibo.impuestos.length > 0 ? (
                  <View style={styles.impuestosListContainer}>
                    {selectedRecibo.impuestos.map((imp) => (
                      <View key={imp.id} style={styles.impuestoRow}>
                        <View style={styles.impuestoInfoColumn}>
                          <View style={styles.impuestoChipRow}>
                            <Chip
                              icon={getTipoImpuestoIcon(imp.tipoImpuesto)}
                              mode="outlined"
                              style={[
                                styles.impuestoChipModal,
                                { borderColor: getTipoImpuestoColor(imp.tipoImpuesto) },
                              ]}
                              textStyle={{ 
                                color: getTipoImpuestoColor(imp.tipoImpuesto),
                                fontSize: 12,
                              }}
                            >
                              {imp.tipoImpuesto}
                            </Chip>
                            {imp.porcentaje > 0 && (
                              <Chip 
                                mode="flat"
                                style={styles.porcentajeChip}
                                textStyle={styles.porcentajeChipText}
                              >
                                {imp.porcentaje}%
                              </Chip>
                            )}
                          </View>
                        </View>
                        <Text style={styles.impuestoMonto}>
                          ${Number(imp.montoAPagar || 0).toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noImpuestosText}>Sin impuestos</Text>
                )}

                <Divider style={styles.modalDivider} />

                <View style={styles.totalRowModal}>
                  <Text style={styles.totalLabelModal}>Monto Total</Text>
                  <View>
                    <Text style={styles.totalValueModal}>
                      ${calculateTotal(selectedRecibo).toLocaleString('es-AR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                    {selectedRecibo.impuestos && selectedRecibo.impuestos.length > 0 && (
                      <Text style={styles.impuestosTotalText}>
                        Impuestos: $
                        {(selectedRecibo.impuestos || [])
                          .reduce((acc, imp) => acc + (imp?.montoAPagar || 0), 0)
                          .toLocaleString('es-AR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                      </Text>
                    )}
                  </View>
                </View>
              </ScrollView>
            )}

            {/* Botones fijos en el bottom */}
            <View style={styles.modalActions}>
              <Button
                mode="contained"
                onPress={() => selectedRecibo && handleDownloadPDF(selectedRecibo)}
                style={styles.modalButtonPrimary}
                buttonColor="#1F2C61"
              >
                COMPARTIR PDF
              </Button>
              <Button
                mode="outlined"
                onPress={() => selectedRecibo && handleDownloadPDF(selectedRecibo)}
                style={styles.modalButtonOutlined}
                textColor="#1F2C61"
              >
                DESCARGAR PDF
              </Button>
              <Button
                mode="outlined"
                onPress={handleCloseReciboModal}
                style={styles.modalButtonOutlined}
                textColor="#1F2C61"
              >
                CERRAR
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2C61',
  },
  fab: {
    backgroundColor: '#1F2C61',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flex: 1,
    borderRadius: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  scrollContent: {
    paddingHorizontal: CARD_MARGIN,
    paddingBottom: 32,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: 'white',
  },
  activeCard: {
    elevation: 8,
  },
  cardHeader: {
    backgroundColor: '#1F2C61',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardContent: {
    padding: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  montoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  montoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2C61',
  },
  impuestosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  impuestoChip: {
    height: 32,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2C61',
  },
  estadoChip: {
    height: 28,
  },
  estadoChipPagado: {
    backgroundColor: '#4caf50',
  },
  estadoChipPendiente: {
    backgroundColor: '#ff9800',
  },
  estadoChipText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '80%',
    height: '80%',
    flexDirection: 'column',
  },
  modalScrollContent: {
    flex: 1,
  },
  modalScrollContentContainer: {
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'white',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2C61',
    flex: 1,
  },
  modalDivider: {
    marginVertical: 8,
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 18,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  estadoChipContainer: {
    alignSelf: 'flex-start',
  },
  estadoChipModal: {
    height: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2C61',
    marginTop: 4,
    marginBottom: 16,
  },
  impuestosListContainer: {
    gap: 12,
  },
  impuestoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
  },
  impuestoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  impuestoInfoColumn: {
    flex: 1,
  },
  impuestoChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    overflow: 'visible',
  },
  impuestoChipModal: {
    height: 32,
  },
  porcentajeChip: {
    height: 32,
    backgroundColor: '#E3F2FD',
    minWidth: 60,
    paddingHorizontal: 12,
  },
  porcentajeChipText: {
    fontSize: 11,
    color: '#1565c0',
    fontWeight: '600',
  },
  impuestoMonto: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2C61',
  },
  noImpuestosText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  totalRowModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 20,
    paddingBottom: 8,
  },
  totalLabelModal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  totalValueModal: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1F2C61',
    textAlign: 'right',
  },
  impuestosTotalText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 25,
  },
  modalButtonOutlined: {
    flex: 1,
    borderRadius: 25,
    borderColor: '#1F2C61',
  },
});
