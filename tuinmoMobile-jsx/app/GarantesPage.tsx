import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import DocumentManagerModal from '@/components/DocumentManagerModal';
import EditarGaranteModal, {
  type EditarGaranteForm,
} from '@/components/formularios/EditarGaranteModal';
import {
  Appbar,
  Button,
  Card,
  Dialog,
  IconButton,
  Portal,
  Searchbar,
  Surface,
  Text,
  TouchableRipple,
} from 'react-native-paper';

type Garante = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
  cuit?: string;
  direccionResidencial?: string;
};

const ITEMS_PER_PAGE = 6;

const MOCK_GARANTES: Garante[] = [
  {
    id: '1',
    nombre: 'Rubén',
    apellido: 'Cabrera',
    dni: '18551489',
    email: 'ruben.cabrera@mail.com',
    telefono: '54911-4094-0130',
    cuit: '20-18551489-1',
    direccionResidencial: 'Av. Mitre',
  },
  {
    id: '2',
    nombre: 'José',
    apellido: 'Trofa',
    dni: '22333444',
    email: 'jose.trofa@mail.com',
    telefono: '351-777-111',
    cuit: '20-22333444-2',
    direccionResidencial: 'San Martín 100',
  },
  {
    id: '3',
    nombre: 'Miguel',
    apellido: 'Iacono',
    dni: '30111222',
    email: 'miguel.iacono@mail.com',
    telefono: '351-222-999',
    cuit: '20-30111222-3',
    direccionResidencial: 'Rondeau 14',
  },
  {
    id: '4',
    nombre: 'Alberto',
    apellido: 'Torres',
    dni: '27999888',
    email: 'alberto.torres@mail.com',
    telefono: '351-333-444',
    cuit: '20-27999888-4',
    direccionResidencial: '9 de Julio 200',
  },
  {
    id: '5',
    nombre: 'Laura',
    apellido: 'Ezquivel',
    dni: '31222333',
    email: 'laura.ezquivel@mail.com',
    telefono: '351-555-666',
    cuit: '27-31222333-4',
    direccionResidencial: 'Chacabuco 220',
  },
];

export default function GarantesPage() {
  const [garantes, setGarantes] = useState<Garante[]>(MOCK_GARANTES);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [docsId, setDocsId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return garantes;
    return garantes.filter((g) => {
      const full = `${g.nombre} ${g.apellido}`.toLowerCase();
      return (
        full.includes(t) ||
        (g.email ?? '').toLowerCase().includes(t) ||
        (g.telefono ?? '').toLowerCase().includes(t) ||
        (g.dni ?? '').toLowerCase().includes(t)
      );
    });
  }, [garantes, query]);

  const numberOfPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(page, numberOfPages - 1);
  const from = pageSafe * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, filtered.length);
  const pageItems = filtered.slice(from, to);

  const deleteTarget = useMemo(
    () => garantes.find((g) => g.id === deleteId) ?? null,
    [deleteId, garantes]
  );
  const docsTarget = useMemo(
    () => garantes.find((g) => g.id === docsId) ?? null,
    [docsId, garantes]
  );
  const editTarget = useMemo(
    () => garantes.find((g) => g.id === editId) ?? null,
    [editId, garantes]
  );

  const toggleExpanded = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openWhatsApp = (telefono?: string) => {
    if (!telefono) return;
    const digits = telefono.replace(/[^0-9]/g, '');
    if (!digits) return;
    Linking.openURL(`https://wa.me/${digits}`).catch(() => {});
  };

  const openEmail = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const onConfirmDelete = () => {
    if (!deleteId) return;
    setGarantes((prev) => prev.filter((g) => g.id !== deleteId));
    setDeleteId(null);
    setExpandedId(null);
    setPage(0);
  };

  const onEditSubmit = async (payload: EditarGaranteForm) => {
    setGarantes((prev) =>
      prev.map((g) =>
        g.id === payload.id
          ? {
              ...g,
              nombre: payload.nombre,
              apellido: payload.apellido,
              email: payload.email,
              telefono: payload.telefono,
              dni: payload.dni,
              cuit: payload.cuit,
              direccionResidencial: payload.direccionResidencial,
            }
          : g
      )
    );
    setEditId(null);
  };

  return (
    <Surface style={styles.screen} elevation={0}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Garantes" />
        <Appbar.Action icon="plus" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Buscar por nombre, apellido, email, teléfono o DNI..."
          value={query}
          onChangeText={(t) => {
            setQuery(t);
            setPage(0);
          }}
          style={styles.search}
        />

        <FlatList
          data={pageItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isExpanded = expandedId === item.id;
            const fullName = `${item.nombre} ${item.apellido}`.trim();

            return (
              <View style={styles.cardWrap}>
                {isExpanded && (
                  <View style={styles.topChips}>
                    <IconButton
                      icon="file-document-outline"
                      mode="contained"
                      size={18}
                      iconColor="#0B1B5E"
                      containerColor="rgba(63, 81, 181, 0.2)"
                      onPress={() => setDocsId(item.id)}
                      style={styles.chip}
                    />
                    <IconButton
                      icon="pencil"
                      mode="contained"
                      size={18}
                      iconColor="#7C3AED"
                      containerColor="rgba(98, 9, 199, 0.2)"
                      onPress={() => setEditId(item.id)}
                      style={styles.chip}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      mode="contained"
                      size={18}
                      iconColor="#D32F2F"
                      containerColor="rgba(244, 67, 54, 0.2)"
                      onPress={() => setDeleteId(item.id)}
                      style={styles.chip}
                    />
                  </View>
                )}

                <Card mode="elevated" style={styles.card}>
                  <TouchableRipple
                    onPress={() => toggleExpanded(item.id)}
                    borderless
                    style={styles.cardHeader}
                  >
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {fullName}
                      </Text>
                      <IconButton
                        icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={22}
                        onPress={() => toggleExpanded(item.id)}
                      />
                    </View>
                  </TouchableRipple>

                  {isExpanded && (
                    <Card.Content style={styles.cardContent}>
                      <View style={styles.detailBlock}>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>DNI:</Text>
                          <Text style={styles.detailValue}>{item.dni || '—'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Email:</Text>
                          <Text style={styles.detailValue}>{item.email || '—'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Teléfono:</Text>
                          <Text style={styles.detailValue}>{item.telefono || '—'}</Text>
                        </View>
                        <View style={styles.detailRow}>
                          <Text style={styles.detailLabel}>Dirección:</Text>
                          <Text style={[styles.detailValue, styles.flex1]} numberOfLines={2}>
                            {item.direccionResidencial || '—'}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.ctaRow}>
                        <Pressable
                          onPress={() => openWhatsApp(item.telefono)}
                          disabled={!item.telefono}
                          style={({ pressed }) => [
                            styles.cta,
                            styles.ctaLeft,
                            !item.telefono ? styles.ctaDisabled : undefined,
                            pressed ? styles.ctaPressed : undefined,
                          ]}
                        >
                          <IconButton icon="whatsapp" iconColor="#fff" size={40} />
                        </Pressable>

                        <Pressable
                          onPress={() => openEmail(item.email)}
                          disabled={!item.email}
                          style={({ pressed }) => [
                            styles.cta,
                            styles.ctaRight,
                            !item.email ? styles.ctaDisabled : undefined,
                            pressed ? styles.ctaPressed : undefined,
                          ]}
                        >
                          <IconButton icon="email-outline" iconColor="#fff" size={40} />
                        </Pressable>
                      </View>
                    </Card.Content>
                  )}
                </Card>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text variant="titleMedium">Sin resultados</Text>
              <Text style={styles.emptySub}>Probá con otro criterio de búsqueda.</Text>
            </View>
          }
        />

        <View style={styles.pagination}>
          <IconButton
            icon="chevron-left"
            disabled={pageSafe <= 0}
            onPress={() => setPage((p) => Math.max(0, p - 1))}
          />

          <View style={styles.pages}>
            {Array.from({ length: numberOfPages }).slice(0, 7).map((_, i) => {
              const active = i === pageSafe;
              return (
                <Pressable
                  key={i}
                  onPress={() => setPage(i)}
                  style={[styles.pageDot, active ? styles.pageDotActive : undefined]}
                >
                  <Text style={[styles.pageText, active ? styles.pageTextActive : undefined]}>
                    {i + 1}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <IconButton
            icon="chevron-right"
            disabled={pageSafe >= numberOfPages - 1}
            onPress={() => setPage((p) => Math.min(numberOfPages - 1, p + 1))}
          />
        </View>
      </View>

      <Portal>
        <Dialog visible={deleteId != null} onDismiss={() => setDeleteId(null)}>
          <Dialog.Title>Eliminar garante</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Seguro que querés eliminar a{' '}
              <Text style={styles.bold}>
                {deleteTarget ? `${deleteTarget.nombre} ${deleteTarget.apellido}` : 'este garante'}
              </Text>
              ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteId(null)}>Cancelar</Button>
            <Button onPress={onConfirmDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <DocumentManagerModal
        visible={docsId != null}
        onDismiss={() => setDocsId(null)}
        entityType="garante"
        entityId={docsId}
        entityName={docsTarget ? `${docsTarget.nombre} ${docsTarget.apellido}` : undefined}
      />

      <EditarGaranteModal
        visible={editId != null}
        onDismiss={() => setEditId(null)}
        garante={
          editTarget
            ? {
                id: editTarget.id,
                nombre: editTarget.nombre,
                apellido: editTarget.apellido,
                telefono: editTarget.telefono,
                email: editTarget.email,
                dni: editTarget.dni,
                cuit: editTarget.cuit,
                direccionResidencial: editTarget.direccionResidencial,
              }
            : null
        }
        onSubmit={onEditSubmit}
      />
    </Surface>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  appbar: {
    backgroundColor: '#F5F6FA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F5F6FA',
  },
  search: {
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  card: {
    borderRadius: 14,
    backgroundColor: '#fff',
  },
  cardWrap: {
    position: 'relative',
  },
  topChips: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#F5F6FA',
  },
  chip: {
    width: 50,
    height: 32,
  },
  cardHeader: {
    borderRadius: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 14,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',
    paddingRight: 8,
  },
  cardContent: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  detailBlock: {
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailLabel: {
    width: 86,
    fontWeight: '800',
  },
  detailValue: {
    flexShrink: 1,
  },
  flex1: {
    flex: 1,
  },
  ctaRow: {
    flexDirection: 'row',
    marginTop: 14,
    marginHorizontal: -16,
  },
  cta: {
    flex: 1,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLeft: {
    backgroundColor: '#166534',
    borderBottomLeftRadius: 14,
  },
  ctaRight: {
    backgroundColor: '#0B1B5E',
    borderBottomRightRadius: 14,
  },
  ctaDisabled: {
    opacity: 0.55,
  },
  ctaPressed: {
    opacity: 0.9,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptySub: {
    marginTop: 6,
    opacity: 0.7,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  pages: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageDot: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageDotActive: {
    backgroundColor: '#0B1B5E',
  },
  pageText: {
    fontWeight: '700',
    color: '#111827',
  },
  pageTextActive: {
    color: '#fff',
  },
  bold: {
    fontWeight: '700',
  },
});
