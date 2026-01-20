import React, { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, Pressable, Share, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Dialog,
  Divider,
  IconButton,
  Portal,
  Text,
  TextInput,
} from 'react-native-paper';

export type DocumentItem = {
  id: string;
  nombreArchivo?: string;
  nombre?: string;
  tipo?: string;
  urlArchivo?: string;
  url?: string;
  contentType?: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  entityType: 'inquilino' | 'propietario' | 'garante';
  entityId: string | null;
  entityName?: string;
  fetchList?: (id: string) => Promise<DocumentItem[]>;
  uploadFiles?: (id: string, files: { name: string; uri: string }[]) => Promise<void>;
  deleteDoc?: (docId: string) => Promise<void>;
};

const makeMimeFromName = (name: string) => {
  const ext = String(name || '')
    .split('.')
    .pop()
    ?.toLowerCase();
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  return 'application/octet-stream';
};

const getDisplayName = (doc: DocumentItem) => {
  const name = doc?.nombreArchivo || doc?.nombre || '';
  if (!name) return 'Documento';
  const parts = String(name).split('_');
  return parts.length > 1 ? parts.slice(1).join('_') : name;
};

export default function DocumentManagerModal({
  visible,
  onDismiss,
  entityType,
  entityId,
  entityName,
  fetchList,
  uploadFiles,
  deleteDoc,
}: Props) {
  const [docsList, setDocsList] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [uploadName, setUploadName] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const title = useMemo(() => {
    const base = entityType === 'propietario' ? 'Propietario' : entityType === 'garante' ? 'Garante' : 'Inquilino';
    return `Documentos de ${entityName || base}`;
  }, [entityName, entityType]);

  const refreshDocs = async () => {
    if (!visible || !entityId) return;
    try {
      setLoading(true);
      setError('');

      if (fetchList) {
        const arr = await fetchList(entityId);
        setDocsList(Array.isArray(arr) ? arr : []);
        return;
      }

      // Fallback mock list
      setDocsList([
        {
          id: 'mock-1',
          nombreArchivo: `${entityType}_${entityId}_Contrato.pdf`,
          tipo: 'pdf',
          urlArchivo: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        },
        {
          id: 'mock-2',
          nombreArchivo: `${entityType}_${entityId}_Foto.jpg`,
          tipo: 'jpg',
          urlArchivo: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg',
        },
      ]);
    } catch (e) {
      setError('No se pudieron cargar los documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, entityId]);

  const handleViewDoc = async (doc: DocumentItem) => {
    try {
      const directUrl = doc?.urlArchivo || doc?.url;
      if (!directUrl) throw new Error('no-url');
      await Linking.openURL(directUrl);
    } catch {
      // no-op
    }
  };

  const handleShareDoc = async (doc: DocumentItem) => {
    try {
      const directUrl = doc?.urlArchivo || doc?.url;
      if (!directUrl) return;

      if (Platform.OS === 'web') {
        await Linking.openURL(directUrl);
        return;
      }

      await Share.share({
        message: directUrl,
        url: directUrl,
        title: getDisplayName(doc),
      });
    } catch {
      // no-op
    }
  };

  const handleDeleteDoc = async (doc: DocumentItem) => {
    try {
      if (deleteDoc) {
        await deleteDoc(doc.id);
        refreshDocs();
        return;
      }

      setDocsList((prev) => prev.filter((d) => d.id !== doc.id));
    } catch {
      // no-op
    }
  };

  const handleAddMockDoc = async () => {
    if (!entityId) return;
    const name = uploadName.trim();
    const url = uploadUrl.trim();
    if (!name || !url) return;

    try {
      if (uploadFiles) {
        await uploadFiles(entityId, [{ name, uri: url }]);
        setUploadName('');
        setUploadUrl('');
        refreshDocs();
        return;
      }

      const mime = makeMimeFromName(name);
      setDocsList((prev) => [
        {
          id: `mock-${Date.now()}`,
          nombreArchivo: name,
          tipo: mime,
          urlArchivo: url,
        },
        ...prev,
      ]);
      setUploadName('');
      setUploadUrl('');
    } catch {
      // no-op
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <View style={styles.box}>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <Text>Cargando documentos...</Text>
              </View>
            ) : error ? (
              <Text>{error}</Text>
            ) : docsList.length === 0 ? (
              <Text>Sin documentos cargados.</Text>
            ) : (
              <View style={styles.list}>
                {docsList.map((doc) => (
                  <Pressable key={doc.id} onPress={() => handleViewDoc(doc)} style={styles.docRow}>
                    <View style={styles.docLeft}>
                      <IconButton icon="file-outline" size={18} iconColor="#fff" />
                      <View style={styles.docTextWrap}>
                        <Text numberOfLines={1} style={styles.docTitle}>
                          {getDisplayName(doc)}
                        </Text>
                        <Text numberOfLines={1} style={styles.docSub}>
                          {doc?.tipo || ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.docActions}>
                      <IconButton
                        icon="share-variant"
                        size={18}
                        iconColor="#fff"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleShareDoc(doc);
                        }}
                      />
                      <IconButton
                        icon="delete-outline"
                        size={18}
                        iconColor="#fff"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleDeleteDoc(doc);
                        }}
                      />
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Subir documentos</Text>
          <View style={styles.uploader}>
            <TextInput
              label="Nombre (ej: contrato.pdf)"
              mode="outlined"
              value={uploadName}
              onChangeText={setUploadName}
              style={styles.input}
            />
            <TextInput
              label="URL (por ahora simulado)"
              mode="outlined"
              value={uploadUrl}
              onChangeText={setUploadUrl}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleAddMockDoc} disabled={!entityId || !uploadName.trim() || !uploadUrl.trim()}>
              SUBIR DOCUMENTOS
            </Button>
          </View>
        </Dialog.Content>

        <Dialog.Actions>
          <Button onPress={onDismiss}>Cerrar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 18,
  },
  box: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  loadingRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  list: {
    gap: 10,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#6D28D9',
  },
  docLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    paddingRight: 10,
  },
  docTextWrap: {
    flex: 1,
  },
  docTitle: {
    color: '#fff',
    fontWeight: '700',
  },
  docSub: {
    color: 'rgba(255,255,255,0.85)',
  },
  docActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 10,
  },
  uploader: {
    gap: 10,
  },
  input: {
    backgroundColor: 'transparent',
  },
});
