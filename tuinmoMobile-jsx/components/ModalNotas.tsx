import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import {
  Portal,
  Text,
  IconButton,
  Chip,
  Surface,
  Button,
  ActivityIndicator,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Nota {
  id: number;
  motivo: string;
  contenido: string;
  estado: string;
  prioridad: string;
  tipo: string;
  observaciones?: string;
  fechaCreacion: string;
  autor?: string;
  imagenes?: any[];
}

interface ModalNotasProps {
  visible: boolean;
  onClose: () => void;
  nota: Nota | null;
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

const preposicion = (autor?: string) => {
  if (autor === 'INQUILINO' || autor === 'PROPIETARIO') {
    return 'el';
  } else {
    return 'la';
  }
};

export default function ModalNotas({ visible, onClose, nota, contrato }: ModalNotasProps) {
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!visible || !nota) return null;

  const handleUploadImage = () => {
    Alert.alert(
      'Adjuntar imagen',
      'Funcionalidad de carga de imágenes pendiente de integración',
      [{ text: 'OK' }]
    );
  };

  const handleDeleteImage = (imgId: any) => {
    Alert.alert(
      'Eliminar imagen',
      '¿Estás seguro de eliminar esta imagen?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => console.log('Eliminar imagen:', imgId),
        },
      ]
    );
  };

  return (
    <Portal>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={[styles.sheetContainer, { paddingBottom: insets.bottom }]}>
          <Surface style={styles.sheet} elevation={5}>
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <IconButton icon="message-text-outline" size={24} iconColor="#1F2C61" />
                <Text style={styles.headerTitle} numberOfLines={2}>
                  {nota.motivo}
                </Text>
              </View>
              <IconButton icon="close" size={24} onPress={onClose} iconColor="#1F2C61" />
            </View>

            <ScrollView
              style={styles.scrollContent}
              contentContainerStyle={styles.scrollContentContainer}
            >
              <View style={styles.chipsRow}>
                <Chip
                  style={[styles.chip, { backgroundColor: estadoColor[nota.estado] || '#999' }]}
                  textStyle={styles.chipText}
                >
                  {nota.estado}
                </Chip>
                <Chip style={styles.chipOutlined} textStyle={styles.chipTextSmall}>
                  {nota.prioridad}
                </Chip>
                <Chip style={styles.chipOutlined} textStyle={styles.chipTextSmall}>
                  {nota.tipo}
                </Chip>
              </View>

              <Text style={styles.contenido}>{nota.contenido}</Text>

              {nota.observaciones && (
                <Text style={styles.observaciones}>Observaciones: {nota.observaciones}</Text>
              )}

              {nota.autor && (
                <Text style={styles.autor}>
                  Reporte emitido por {preposicion(nota.autor)} {nota.autor}
                </Text>
              )}

              <Text style={styles.fecha}>{formatFecha(nota.fechaCreacion)}</Text>

              {/* Galería de imágenes */}
              <View style={styles.imageSection}>
                <Text style={styles.imageSectionTitle}>Imágenes adjuntas</Text>

                <Button
                  mode="outlined"
                  onPress={handleUploadImage}
                  icon="image-plus"
                  disabled={uploading}
                  style={styles.uploadButton}
                >
                  {uploading ? 'Subiendo...' : 'Adjuntar imagen'}
                </Button>

                {nota.imagenes && nota.imagenes.length > 0 ? (
                  <View style={styles.imageGrid}>
                    {nota.imagenes.map((img, idx) => (
                      <View key={img.id || idx} style={styles.imageContainer}>
                        <Pressable onPress={() => setSelectedImage(img.url || img.imageUrl)}>
                          <Image
                            source={{ uri: img.url || img.imageUrl }}
                            style={styles.image}
                            resizeMode="cover"
                          />
                        </Pressable>
                        <IconButton
                          icon="delete"
                          size={18}
                          iconColor="#fff"
                          containerColor="rgba(211, 47, 47, 0.8)"
                          onPress={() => handleDeleteImage(img.idImage || img.id)}
                          style={styles.deleteButton}
                        />
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.noImages}>No hay imágenes adjuntas.</Text>
                )}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Button mode="outlined" onPress={onClose} style={styles.closeButton}>
                Cerrar
              </Button>
            </View>
          </Surface>
        </View>
      </View>

      {/* Modal de imagen en pantalla completa */}
      {selectedImage && (
        <Portal>
          <View style={styles.imageFullOverlay}>
            <Pressable style={styles.imageFullBackdrop} onPress={() => setSelectedImage(null)} />
            <Image
              source={{ uri: selectedImage }}
              style={styles.imageFullScreen}
              resizeMode="contain"
            />
            <IconButton
              icon="close"
              size={32}
              iconColor="#fff"
              onPress={() => setSelectedImage(null)}
              style={styles.imageFullClose}
            />
          </View>
        </Portal>
      )}
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
    backgroundColor: 'rgba(31, 44, 97, 0.22)',
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
    maxHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2C61',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
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
  contenido: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 22,
  },
  observaciones: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  autor: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 12,
    color: '#999',
    marginBottom: 16,
  },
  imageSection: {
    marginTop: 8,
  },
  imageSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2C61',
    marginBottom: 12,
  },
  uploadButton: {
    marginBottom: 12,
    borderColor: '#1F2C61',
  },
  noImages: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  imageContainer: {
    width: '48%',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  closeButton: {
    borderColor: '#1F2C61',
  },
  imageFullOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 2000,
  },
  imageFullBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  imageFullScreen: {
    width: '100%',
    height: '100%',
  },
  imageFullClose: {
    position: 'absolute',
    top: 40,
    right: 16,
  },
});
