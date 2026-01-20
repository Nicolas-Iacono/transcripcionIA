import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Surface,
  IconButton,
  Menu,
} from 'react-native-paper';

interface NotaContratoFormProps {
  idContrato: string;
  onSuccess?: (nota: any) => void;
}

const estados = [
  { value: 'EN_PROCESO', label: 'En proceso' },
  { value: 'PENDIENTE', label: 'Pendiente' },
  { value: 'RESUELTO', label: 'Resuelto' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

const prioridades = [
  { value: 'Alta', label: 'Alta' },
  { value: 'Media', label: 'Media' },
  { value: 'Baja', label: 'Baja' },
];

const tipos = [
  { value: 'reparacion', label: 'Reparación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otro', label: 'Otro' },
];

export default function NotaContratoForm({ idContrato, onSuccess }: NotaContratoFormProps) {
  const [expanded, setExpanded] = useState(false);
  const [contenido, setContenido] = useState('');
  const [motivo, setMotivo] = useState('');
  const [estado, setEstado] = useState('EN_PROCESO');
  const [prioridad, setPrioridad] = useState('Media');
  const [tipo, setTipo] = useState('reparacion');
  const [observaciones, setObservaciones] = useState('');
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [estadoMenuVisible, setEstadoMenuVisible] = useState(false);
  const [prioridadMenuVisible, setPrioridadMenuVisible] = useState(false);
  const [tipoMenuVisible, setTipoMenuVisible] = useState(false);

  const handleSelectImages = async () => {
    // Placeholder for image selection - integrate with expo-image-picker when needed
    Alert.alert(
      'Seleccionar imágenes',
      'Funcionalidad de selección de imágenes pendiente de integración con expo-image-picker',
      [{ text: 'OK' }]
    );
  };

  const handleSubmit = async () => {
    if (!contenido.trim() || !motivo.trim()) {
      setError('El título y contenido son obligatorios');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Simulated API call - replace with actual API when ready
      const notaPayload = {
        idContrato,
        contenido,
        motivo,
        estado,
        prioridad,
        tipo,
        observaciones,
        visibilidad: 'PUBLICA',
        fechaCreacion: new Date().toISOString(),
      };

      console.log('Guardando nota:', notaPayload);
      console.log('Imágenes:', imagenes.length);

      setSuccess(true);
      setContenido('');
      setMotivo('');
      setEstado('EN_PROCESO');
      setPrioridad('Media');
      setTipo('reparacion');
      setObservaciones('');
      setImagenes([]);

      if (onSuccess) {
        onSuccess(notaPayload);
      }

      setTimeout(() => {
        setSuccess(false);
        setExpanded(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar la nota');
    } finally {
      setLoading(false);
    }
  };

  const getEstadoLabel = () => estados.find((e) => e.value === estado)?.label || estado;
  const getPrioridadLabel = () => prioridades.find((p) => p.value === prioridad)?.label || prioridad;
  const getTipoLabel = () => tipos.find((t) => t.value === tipo)?.label || tipo;

  return (
    <Surface style={styles.container} elevation={1}>
      <View style={styles.header}>
        <Text style={styles.title}>Notas</Text>
        <IconButton
          icon={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          onPress={() => setExpanded(!expanded)}
        />
      </View>

      {expanded && (
        <View style={styles.form}>
          <TextInput
            label="Título"
            mode="outlined"
            value={motivo}
            onChangeText={setMotivo}
            style={styles.input}
            dense
          />

          <TextInput
            label="Contenido"
            mode="outlined"
            value={contenido}
            onChangeText={setContenido}
            multiline
            numberOfLines={3}
            style={styles.input}
            dense
          />

          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Menu
                visible={estadoMenuVisible}
                onDismiss={() => setEstadoMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setEstadoMenuVisible(true)}
                    style={styles.selectButton}
                    contentStyle={styles.selectButtonContent}
                  >
                    Estado: {getEstadoLabel()}
                  </Button>
                }
              >
                {estados.map((e) => (
                  <Menu.Item
                    key={e.value}
                    onPress={() => {
                      setEstado(e.value);
                      setEstadoMenuVisible(false);
                    }}
                    title={e.label}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.halfInput}>
              <Menu
                visible={prioridadMenuVisible}
                onDismiss={() => setPrioridadMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setPrioridadMenuVisible(true)}
                    style={styles.selectButton}
                    contentStyle={styles.selectButtonContent}
                  >
                    Prioridad: {getPrioridadLabel()}
                  </Button>
                }
              >
                {prioridades.map((p) => (
                  <Menu.Item
                    key={p.value}
                    onPress={() => {
                      setPrioridad(p.value);
                      setPrioridadMenuVisible(false);
                    }}
                    title={p.label}
                  />
                ))}
              </Menu>
            </View>
          </View>

          <Menu
            visible={tipoMenuVisible}
            onDismiss={() => setTipoMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setTipoMenuVisible(true)}
                style={styles.selectButton}
                contentStyle={styles.selectButtonContent}
              >
                Tipo: {getTipoLabel()}
              </Button>
            }
          >
            {tipos.map((t) => (
              <Menu.Item
                key={t.value}
                onPress={() => {
                  setTipo(t.value);
                  setTipoMenuVisible(false);
                }}
                title={t.label}
              />
            ))}
          </Menu>

          <TextInput
            label="Observaciones"
            mode="outlined"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            numberOfLines={2}
            style={styles.input}
            dense
          />

          <Button
            mode="outlined"
            onPress={handleSelectImages}
            icon="image"
            style={styles.imageButton}
          >
            Seleccionar imágenes
          </Button>
          <Text style={styles.imageCount}>
            {imagenes.length > 0 ? `${imagenes.length} imagen(es) seleccionada(s)` : 'Sin imágenes'}
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}
          {success && <Text style={styles.successText}>Nota guardada correctamente.</Text>}

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            icon="content-save"
            style={styles.submitButton}
            buttonColor="#1F2C61"
          >
            Guardar nota
          </Button>
        </View>
      )}
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2C61',
  },
  form: {
    marginTop: 16,
    gap: 12,
  },
  input: {
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  selectButton: {
    borderRadius: 24,
    borderColor: '#ccc',
  },
  selectButtonContent: {
    justifyContent: 'flex-start',
  },
  imageButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  imageCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginTop: 8,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 14,
    marginTop: 8,
  },
  submitButton: {
    marginTop: 16,
    borderRadius: 8,
  },
});
