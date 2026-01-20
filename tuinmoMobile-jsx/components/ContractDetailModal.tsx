import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Pressable,
} from 'react-native';
import {
  Portal,
  Text,
  IconButton,
  Button,
  TextInput,
  Divider,
  Chip,
  Surface,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PutMontoForm from './PutMontoForm';
import NotaContratoForm from './NotaContratoForm';
import NotasContratoList from './NotasContratoList';

type EstadoContrato = 'ACTIVO' | 'RENOVADO' | 'FINALIZADO' | 'ARCHIVADO';

type Garante = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
};

type Propietario = {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
};

type Inquilino = {
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
};

type Propiedad = {
  direccion: string;
};

type Contract = {
  id: string;
  nombreContrato: string;
  estados: EstadoContrato[];
  montoAlquiler?: number;
  propiedadDireccion?: string;
  propietarioNombre?: string;
  inquilinoNombre?: string;
  destino?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  comisionContratoMonto?: number;
  comisionMensualMonto?: number;
  porcentajeContrato?: number;
  porcentajeMensual?: number;
  propietario?: Propietario;
  inquilino?: Inquilino;
  propiedad?: Propiedad;
  garantes?: Garante[];
};

interface ContractDetailModalProps {
  visible: boolean;
  contract: Contract | null;
  onDismiss: () => void;
  onNavigateToReceipts?: (contractId: string) => void;
}

export default function ContractDetailModal({
  visible,
  contract,
  onDismiss,
  onNavigateToReceipts,
}: ContractDetailModalProps) {
  const insets = useSafeAreaInsets();
  const [note, setNote] = useState('');
  const [showPercentageEdit, setShowPercentageEdit] = useState(false);
  const [porcentajeContrato, setPorcentajeContrato] = useState('');
  const [porcentajeMensual, setPorcentajeMensual] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  if (!visible || !contract) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No especificada';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleWhatsApp = (phone?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`whatsapp://send?phone=${cleanPhone}`);
  };

  const handleEmail = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  };

  const handleSavePercentages = () => {
    console.log('Guardar porcentajes:', { porcentajeContrato, porcentajeMensual });
    setPorcentajeContrato('');
    setPorcentajeMensual('');
    setShowPercentageEdit(false);
  };

  const handleSaveNote = () => {
    console.log('Guardar nota:', note);
    setNote('');
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onDismiss} />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={[styles.sheetContainer, { marginBottom: keyboardHeight }]}
        >
          <Surface style={styles.sheet} elevation={5}>
            <View style={styles.header}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {contract.nombreContrato}
              </Text>
              <IconButton icon="close" size={24} onPress={onDismiss} iconColor="#fff" />
            </View>

            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={[
                styles.scrollContentContainer,
                { paddingBottom: Math.max(insets.bottom, 16) + keyboardHeight },
              ]}
              keyboardShouldPersistTaps="handled"
            >
              {/* Información del contrato */}
              <Surface style={styles.section} elevation={1}>
                <Text style={styles.sectionTitle}>Información del contrato</Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Dirección:</Text>
                  <Text style={styles.infoValue}>
                    {contract.propiedad?.direccion || contract.propiedadDireccion || 'Sin dirección'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Destino:</Text>
                  <Text style={styles.infoValue}>{contract.destino || 'No especificado'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Inicio:</Text>
                  <Text style={styles.infoValue}>{formatDate(contract.fecha_inicio)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Fin:</Text>
                  <Text style={styles.infoValue}>{formatDate(contract.fecha_fin)}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Estado:</Text>
                  <View style={styles.chipRow}>
                    {contract.estados.map((estado) => (
                      <Chip 
                        key={estado} 
                        compact 
                        style={styles.estadoChip}
                        textStyle={styles.estadoChipText}
                      >
                        {estado}
                      </Chip>
                    ))}
                  </View>
                </View>

                <Divider style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Monto:</Text>
                  <Text style={styles.infoValueBold}>
                    ${contract.montoAlquiler?.toLocaleString() || 'No especificado'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hon. contrato:</Text>
                  <Text style={styles.infoValueBold}>
                    ${contract.comisionContratoMonto?.toLocaleString() || 'No especificado'}
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hon. mensual:</Text>
                  <Text style={styles.infoValueBold}>
                    ${contract.comisionMensualMonto?.toLocaleString() || 'No especificado'}
                  </Text>
                </View>

                <Divider style={styles.divider} />

                {/* Actualizar Monto */}
                <PutMontoForm
                  selectedContract={contract}
                  setSelectedContract={(updatedContract) => {
                    console.log('Contract updated:', updatedContract);
                  }}
                />

                {/* Editar porcentajes */}
                <Button
                  mode="outlined"
                  onPress={() => setShowPercentageEdit(!showPercentageEdit)}
                  icon={showPercentageEdit ? 'chevron-up' : 'chevron-down'}
                  style={styles.editButton}
                >
                  {showPercentageEdit ? 'Ocultar' : 'Editar'} Porcentajes
                </Button>

                {showPercentageEdit && (
                  <View style={styles.editSection}>
                    <TextInput
                      label="% Contrato"
                      mode="outlined"
                      value={porcentajeContrato}
                      onChangeText={setPorcentajeContrato}
                      keyboardType="numeric"
                      placeholder={`${contract.porcentajeContrato || 0}%`}
                      style={styles.percentInput}
                      dense
                    />
                    <TextInput
                      label="% Mensual"
                      mode="outlined"
                      value={porcentajeMensual}
                      onChangeText={setPorcentajeMensual}
                      keyboardType="numeric"
                      placeholder={`${contract.porcentajeMensual || 0}%`}
                      style={styles.percentInput}
                      dense
                    />
                    <View style={styles.editActions}>
                      <Button
                        mode="text"
                        onPress={() => {
                          setPorcentajeContrato('');
                          setPorcentajeMensual('');
                        }}
                      >
                        Limpiar
                      </Button>
                      <Button
                        mode="contained"
                        onPress={handleSavePercentages}
                        disabled={!porcentajeContrato && !porcentajeMensual}
                      >
                        Guardar
                      </Button>
                    </View>
                  </View>
                )}
              </Surface>

              {/* Propietario */}
              <Surface style={styles.section} elevation={1}>
                <Text style={styles.sectionTitle}>Propietario</Text>
                
                <Text style={styles.personName}>
                  {contract.propietario?.nombre} {contract.propietario?.apellido}
                </Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{contract.propietario?.email || 'No disponible'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Teléfono:</Text>
                  <Text style={styles.infoValue}>{contract.propietario?.telefono || 'No disponible'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DNI:</Text>
                  <Text style={styles.infoValue}>{contract.propietario?.dni || 'No disponible'}</Text>
                </View>

                <View style={styles.contactButtons}>
                  <IconButton
                    icon="whatsapp"
                    mode="contained"
                    iconColor="#25D366"
                    containerColor="rgba(37, 211, 102, 0.1)"
                    onPress={() => handleWhatsApp(contract.propietario?.telefono)}
                    size={20}
                  />
                  <IconButton
                    icon="email"
                    mode="contained"
                    iconColor="#1976D2"
                    containerColor="rgba(25, 118, 210, 0.1)"
                    onPress={() => handleEmail(contract.propietario?.email)}
                    size={20}
                  />
                </View>
              </Surface>

              {/* Inquilino */}
              <Surface style={styles.section} elevation={1}>
                <Text style={styles.sectionTitle}>Inquilino</Text>
                
                <Text style={styles.personName}>
                  {contract.inquilino?.nombre} {contract.inquilino?.apellido}
                </Text>
                
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email:</Text>
                  <Text style={styles.infoValue}>{contract.inquilino?.email || 'No disponible'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Teléfono:</Text>
                  <Text style={styles.infoValue}>{contract.inquilino?.telefono || 'No disponible'}</Text>
                </View>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DNI:</Text>
                  <Text style={styles.infoValue}>{contract.inquilino?.dni || 'No disponible'}</Text>
                </View>

                <View style={styles.contactButtons}>
                  <IconButton
                    icon="whatsapp"
                    mode="contained"
                    iconColor="#25D366"
                    containerColor="rgba(37, 211, 102, 0.1)"
                    onPress={() => handleWhatsApp(contract.inquilino?.telefono)}
                    size={20}
                  />
                  <IconButton
                    icon="email"
                    mode="contained"
                    iconColor="#1976D2"
                    containerColor="rgba(25, 118, 210, 0.1)"
                    onPress={() => handleEmail(contract.inquilino?.email)}
                    size={20}
                  />
                </View>
              </Surface>

              {/* Garantes */}
              <Surface style={styles.section} elevation={1}>
                <Text style={styles.sectionTitle}>
                  Garantes ({contract.garantes?.length || 0})
                </Text>
                
                {contract.garantes && contract.garantes.length > 0 ? (
                  contract.garantes.map((garante, index) => (
                    <View key={garante.id || index} style={styles.garanteItem}>
                      <Text style={styles.personName}>
                        {garante.nombre} {garante.apellido}
                      </Text>
                      
                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email:</Text>
                        <Text style={styles.infoValue}>{garante.email || 'No disponible'}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Teléfono:</Text>
                        <Text style={styles.infoValue}>{garante.telefono || 'No disponible'}</Text>
                      </View>

                      <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>DNI:</Text>
                        <Text style={styles.infoValue}>{garante.dni || 'No disponible'}</Text>
                      </View>

                      <View style={styles.contactButtons}>
                        <IconButton
                          icon="whatsapp"
                          mode="contained"
                          iconColor="#25D366"
                          containerColor="rgba(37, 211, 102, 0.1)"
                          onPress={() => handleWhatsApp(garante.telefono)}
                          size={20}
                        />
                        <IconButton
                          icon="email"
                          mode="contained"
                          iconColor="#1976D2"
                          containerColor="rgba(25, 118, 210, 0.1)"
                          onPress={() => handleEmail(garante.email)}
                          size={20}
                        />
                      </View>

                      {index < contract.garantes!.length - 1 && <Divider style={styles.divider} />}
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No hay garantes asociados</Text>
                )}
              </Surface>

              {/* Notas */}
              <NotaContratoForm
                idContrato={contract.id}
                onSuccess={(nota) => {
                  console.log('Nota creada:', nota);
                }}
              />

              <NotasContratoList idContrato={contract.id} contrato={contract} />
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
              <Button
                mode="contained"
                onPress={() => onNavigateToReceipts?.(contract.id)}
                icon="receipt"
                style={styles.receiptsButton}
                buttonColor="#C22961"
              >
                Ver recibos
              </Button>
              
              <Button
                mode="outlined"
                onPress={onDismiss}
                style={styles.closeButton}
              >
                Cerrar
              </Button>
            </View>

            <View style={{ height: insets.bottom, backgroundColor: '#fff' }} />
          </Surface>
        </KeyboardAvoidingView>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '90%',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    flex: 1,
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 8,
    paddingVertical: 12,
    backgroundColor: '#1F2C61',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    paddingRight: 8,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2C61',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoLabel: {
    width: 100,
    fontWeight: '600',
    color: '#666',
    fontSize: 14,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  infoValueBold: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  chipRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  estadoChip: {
    height: 28,
  },
  estadoChipText: {
    fontSize: 11,
    lineHeight: 14,
  },
  divider: {
    marginVertical: 12,
  },
  editButton: {
    marginTop: 12,
    borderColor: '#1F2C61',
  },
  editSection: {
    marginTop: 12,
    gap: 12,
  },
  percentInput: {
    backgroundColor: '#fff',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  garanteItem: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  noteInput: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  saveNoteButton: {
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  receiptsButton: {
    flex: 1,
  },
  closeButton: {
    flex: 1,
    borderColor: '#1F2C61',
  },
});
