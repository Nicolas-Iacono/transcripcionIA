import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 🔹 Ajustá esto a tu tipo real de navegación
type RootStackParamList = {
  Propiedades: undefined;
  NuevaPropiedad: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Propiedades'>;

type UsuarioDtoSalida = {
  username: string;
};

type PropietarioSalidaDto = {
  nombre: string;
  apellido: string;
};

type Imagen = {
  idImage?: number;
  imageUrl?: string;
};

export type Propiedad = {
  id: number;
  direccion: string;
  localidad: string;
  partido: string;
  provincia: string;
  tipoPropiedad?: string;
  tipo?: string;
  disponibilidad?: boolean;
  inventario?: string;
  usuarioDtoSalida?: UsuarioDtoSalida;
  propietarioSalidaDto?: PropietarioSalidaDto;
  imagenes?: Imagen[];
};

const ITEMS_PER_PAGE = 6;

// Si tenés un wrapper http común, podés importarlo y usarlo en vez de axios
// import http from '../api/http';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

console.log('🔗 API_URL configurada:', API_URL);

const PropiedadesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [propiedades, setPropiedades] = useState<Propiedad[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const [selectedPropiedad, setSelectedPropiedad] = useState<Propiedad | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);

  // Estado para saber si se está eliminando
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchPropiedades = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = await AsyncStorage.getItem('authToken');
      
      const response = await fetch(`${API_URL}/propiedad/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      let propiedadesData: Propiedad[] = [];
      if (Array.isArray(result)) {
        propiedadesData = result;
      } else if (result && Array.isArray(result.data)) {
        propiedadesData = result.data;
      }

      setPropiedades(propiedadesData);
    } catch (e: any) {
      console.error('Error fetching propiedades:', e?.message || e);
      setError(e?.message || 'Error al cargar propiedades');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPropiedades();
  }, []);

  const propiedadesFiltradas = useMemo(() => {
    if (!propiedades || !Array.isArray(propiedades)) return [];

    if (!searchTerm) return propiedades;

    const searchTermLower = searchTerm.toLowerCase();

    return propiedades.filter((propiedad) => {
      if (!propiedad) return false;
      const {
        direccion = '',
        tipoPropiedad = '',
        localidad = '',
        propietarioSalidaDto,
      } = propiedad;

      const propietarioNombre = propietarioSalidaDto
        ? `${propietarioSalidaDto.nombre} ${propietarioSalidaDto.apellido}`
        : '';

      return (
        direccion.toLowerCase().includes(searchTermLower) ||
        tipoPropiedad.toLowerCase().includes(searchTermLower) ||
        localidad.toLowerCase().includes(searchTermLower) ||
        propietarioNombre.toLowerCase().includes(searchTermLower)
      );
    });
  }, [propiedades, searchTerm]);

  const totalPages = useMemo(() => {
    if (!propiedadesFiltradas.length) return 1;
    return Math.ceil(propiedadesFiltradas.length / ITEMS_PER_PAGE);
  }, [propiedadesFiltradas]);

  const propiedadesPaginadas = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return propiedadesFiltradas.slice(startIndex, endIndex);
  }, [page, propiedadesFiltradas]);

  const goPrevPage = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const goNextPage = () => {
    setPage((p) => Math.min(totalPages || 1, p + 1));
  };

  const eliminarPropiedad = (id: number) => {
    Alert.alert(
      '¿Estás seguro?',
      '¡No podrás revertir esto!',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(id);
              
              const token = await AsyncStorage.getItem('authToken');
              
              const response = await fetch(`${API_URL}/propiedad/delete/${id}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              setPropiedades((prev) => prev.filter((p) => p.id !== id));
            } catch (e) {
              console.error('Error al eliminar propiedad:', e);
              Alert.alert('Error', 'No se pudo eliminar la propiedad.');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSharePropiedad = async (propiedad: Propiedad) => {
    try {
      const propiedadInfo = `🏠 PROPIEDAD DISPONIBLE

📍 Dirección: ${propiedad.direccion}
🌆 Localidad: ${propiedad.localidad}
🗺️ Partido: ${propiedad.partido}, ${propiedad.provincia}
👤 Agente: ${
        propiedad.usuarioDtoSalida ? propiedad.usuarioDtoSalida.username : 'No asignado'
      }
🏷️ Tipo: ${propiedad.tipo || propiedad.tipoPropiedad || 'No especificado'}
✅ Estado: ${propiedad.disponibilidad ? 'Disponible' : 'Alquilado'}

${propiedad.inventario ? `📝 Inventario: ${propiedad.inventario}` : ''}`;

      await Share.share({ message: propiedadInfo });
    } catch (error) {
      console.error('Error al compartir propiedad:', error);
      Alert.alert('Error', 'No se pudo compartir la propiedad');
    }
  };

  const renderItem = ({ item }: { item: Propiedad }) => {
    const imagenPrincipal =
      Array.isArray(item.imagenes) &&
      item.imagenes.length > 0 &&
      item.imagenes[0]?.imageUrl
        ? item.imagenes[0].imageUrl
        : null;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => {
          setSelectedPropiedad(item);
          setDetailModalVisible(true);
        }}
      >
        {/* Barra de estado */}
        <View
          style={[
            styles.statusBar,
            { backgroundColor: item.disponibilidad ? '#22c55e' : '#f97316' },
          ]}
        />

        {/* Imagen */}
        <View style={styles.imageContainer}>
          {/* Botón eliminar */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => eliminarPropiedad(item.id)}
          >
            <Text style={styles.deleteButtonText}>🗑</Text>
          </TouchableOpacity>

          {/* Botón compartir */}
          <TouchableOpacity
            style={styles.shareButton}
            onPress={() => handleSharePropiedad(item)}
          >
            <Text style={styles.shareButtonText}>📤</Text>
          </TouchableOpacity>

          {deletingId === item.id && (
            <View style={styles.overlayLoading}>
              <ActivityIndicator size="small" color="#000" />
            </View>
          )}

          {imagenPrincipal ? (
            <Image
              source={{ uri: imagenPrincipal }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageIcon}>🏠</Text>
              <Text style={styles.noImageText}>Sin imagen</Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.propTypeText}>
              {item.tipoPropiedad || item.tipo || 'Propiedad'}
            </Text>
            <View
              style={[
                styles.badge,
                { backgroundColor: item.disponibilidad ? '#dcfce7' : '#ffedd5' },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: item.disponibilidad ? '#16a34a' : '#ea580c' },
                ]}
              >
                {item.disponibilidad ? 'Libre' : 'Alquilado'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Dirección: </Text>
            <Text style={styles.infoValue}>{item.direccion}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Localidad: </Text>
            <Text style={styles.infoValue}>{item.localidad}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Partido / Prov.: </Text>
            <Text style={styles.infoValue}>
              {item.partido}, {item.provincia}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Agente: </Text>
            <Text style={styles.infoValue}>
              {item.usuarioDtoSalida?.username || 'No asignado'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Propiedades</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('NuevaPropiedad')}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* Buscador */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por dirección, tipo, propietario..."
          placeholderTextColor="#9ca3af"
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>

      {/* Contenido */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>Cargando propiedades...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>Error al cargar las propiedades: {error}</Text>
        </View>
      ) : propiedadesFiltradas.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            No se encontraron propiedades con los criterios de búsqueda.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={propiedadesPaginadas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />

          {/* Paginación */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
              disabled={page === 1}
              onPress={goPrevPage}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page === 1 && styles.pageButtonTextDisabled,
                ]}
              >
                Anterior
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Página {page} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                page === totalPages && styles.pageButtonDisabled,
              ]}
              disabled={page === totalPages}
              onPress={goNextPage}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page === totalPages && styles.pageButtonTextDisabled,
                ]}
              >
                Siguiente
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal de detalle simple */}
      <Modal
        visible={detailModalVisible && !!selectedPropiedad}
        animationType="slide"
        transparent
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Detalle de propiedad</Text>
              {selectedPropiedad && (
                <>
                  <Text style={styles.modalLabel}>Dirección</Text>
                  <Text style={styles.modalValue}>{selectedPropiedad.direccion}</Text>

                  <Text style={styles.modalLabel}>Localidad</Text>
                  <Text style={styles.modalValue}>{selectedPropiedad.localidad}</Text>

                  <Text style={styles.modalLabel}>Partido / Provincia</Text>
                  <Text style={styles.modalValue}>
                    {selectedPropiedad.partido}, {selectedPropiedad.provincia}
                  </Text>

                  <Text style={styles.modalLabel}>Tipo</Text>
                  <Text style={styles.modalValue}>
                    {selectedPropiedad.tipoPropiedad || selectedPropiedad.tipo}
                  </Text>

                  <Text style={styles.modalLabel}>Estado</Text>
                  <Text style={styles.modalValue}>
                    {selectedPropiedad.disponibilidad ? 'Libre' : 'Alquilado'}
                  </Text>

                  {!!selectedPropiedad.inventario && (
                    <>
                      <Text style={styles.modalLabel}>Inventario</Text>
                      <Text style={styles.modalValue}>
                        {selectedPropiedad.inventario}
                      </Text>
                    </>
                  )}
                </>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setDetailModalVisible(false)}
            >
              <Text style={styles.modalCloseButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PropiedadesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a', // similar a background.default dark
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(148,163,184,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#e5e7eb',
    fontSize: 20,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInput: {
    backgroundColor: '#020617',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1e293b',
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#e5e7eb',
  },
  errorBox: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(248,113,113,0.2)',
  },
  errorText: {
    color: '#fecaca',
  },
  emptyBox: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#020617',
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#020617',
    marginBottom: 12,
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    zIndex: 2,
  },
  imageContainer: {
    height: 160,
    backgroundColor: '#020617',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15,23,42,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 3,
  },
  deleteButtonText: {
    color: '#f87171',
    fontSize: 12,
  },
  shareButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15,23,42,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 3,
  },
  shareButtonText: {
    color: '#22c55e',
    fontSize: 12,
  },
  overlayLoading: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(15,23,42,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noImageIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  noImageText: {
    color: '#9ca3af',
    fontWeight: '500',
  },
  infoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  propTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    flex: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 12,
    color: '#e5e7eb',
    flex: 1,
    flexWrap: 'wrap',
  },
  paginationContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#1d4ed8',
  },
  pageButtonDisabled: {
    backgroundColor: '#1e293b',
  },
  pageButtonText: {
    color: '#f9fafb',
    fontSize: 12,
    fontWeight: '500',
  },
  pageButtonTextDisabled: {
    color: '#6b7280',
  },
  pageInfo: {
    color: '#e5e7eb',
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    backgroundColor: '#020617',
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
  modalValue: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  modalCloseButton: {
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#6366f1',
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#f9fafb',
    fontWeight: '600',
  },
});
