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
import CreateOwnerProfileModal, {
  type CreateOwnerProfilePayload,
} from '@/components/CreateOwnerProfileModal';
import DocumentManagerModal from '@/components/DocumentManagerModal';
import EditarPropietarioModal, {
  type EditarPropietarioForm,
} from '@/components/formularios/EditarPropietarioModal';
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

type Owner = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
  direccion?: string;
  usuario?: string;
  hasAccount?: boolean;
};

const ITEMS_PER_PAGE = 6;

const MOCK_OWNERS: Owner[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@mail.com',
    telefono: '351-123-456',
    dni: '30111222',
    direccion: 'Av. Colón 123',
    usuario: 'Nicolas',
    hasAccount: true,
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'Gómez',
    email: 'maria.gomez@mail.com',
    telefono: '351-222-333',
    dni: '28999888',
    direccion: 'Bv. San Juan 456',
    usuario: 'Nicolas',
    hasAccount: false,
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Ruiz',
    email: 'carlos.ruiz@mail.com',
    telefono: '351-777-999',
    dni: '27123456',
    direccion: 'Ituzaingó 789',
    usuario: 'Nicolas',
    hasAccount: true,
  },
  {
    id: '4',
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'lucia.fernandez@mail.com',
    telefono: '351-444-555',
    dni: '33444555',
    direccion: '9 de Julio 100',
    usuario: 'Nicolas',
    hasAccount: false,
  },
  {
    id: '5',
    nombre: 'Sofía',
    apellido: 'López',
    email: 'sofia.lopez@mail.com',
    telefono: '351-111-222',
    dni: '31222333',
    direccion: 'Chacabuco 220',
    usuario: 'Nicolas',
    hasAccount: true,
  },
  {
    id: '6',
    nombre: 'Miguel',
    apellido: 'Sosa',
    email: 'miguel.sosa@mail.com',
    telefono: '351-666-777',
    dni: '25666777',
    direccion: 'Rondeau 14',
    usuario: 'Nicolas',
    hasAccount: false,
  },
  {
    id: '7',
    nombre: 'Valentina',
    apellido: 'Martínez',
    email: 'valentina.martinez@mail.com',
    telefono: '351-888-000',
    dni: '33999000',
    direccion: 'Vélez Sarsfield 301',
    usuario: 'Nicolas',
    hasAccount: true,
  },
];

export default function PropietariosPage() {
  const [owners, setOwners] = useState<Owner[]>(MOCK_OWNERS);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteOwnerId, setDeleteOwnerId] = useState<string | null>(null);
  const [createProfileOwnerId, setCreateProfileOwnerId] = useState<string | null>(null);
  const [docsOwnerId, setDocsOwnerId] = useState<string | null>(null);
  const [editOwnerId, setEditOwnerId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return owners;
    return owners.filter((o) => {
      const full = `${o.nombre} ${o.apellido}`.toLowerCase();
      return (
        full.includes(t) ||
        (o.email ?? '').toLowerCase().includes(t) ||
        (o.telefono ?? '').toLowerCase().includes(t) ||
        (o.dni ?? '').toLowerCase().includes(t)
      );
    });
  }, [owners, query]);

  const numberOfPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(page, numberOfPages - 1);
  const from = pageSafe * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, filtered.length);
  const pageItems = filtered.slice(from, to);

  const deleteTarget = useMemo(
    () => owners.find((o) => o.id === deleteOwnerId) ?? null,
    [deleteOwnerId, owners]
  );

  const createProfileTarget = useMemo(
    () => owners.find((o) => o.id === createProfileOwnerId) ?? null,
    [createProfileOwnerId, owners]
  );

  const docsTarget = useMemo(
    () => owners.find((o) => o.id === docsOwnerId) ?? null,
    [docsOwnerId, owners]
  );

  const editTarget = useMemo(
    () => owners.find((o) => o.id === editOwnerId) ?? null,
    [editOwnerId, owners]
  );

  const onConfirmDelete = () => {
    if (!deleteOwnerId) return;
    setOwners((prev) => prev.filter((o) => o.id !== deleteOwnerId));
    setDeleteOwnerId(null);
    setExpandedId(null);
    setPage(0);
  };

  const toggleAccount = (id: string) => {
    setOwners((prev) => prev.map((o) => (o.id === id ? { ...o, hasAccount: !o.hasAccount } : o)));
  };

  const onCreateProfileSubmit = (payload: CreateOwnerProfilePayload) => {
    if (!createProfileOwnerId) return;
    setOwners((prev) =>
      prev.map((o) =>
        o.id === createProfileOwnerId
          ? {
              ...o,
              hasAccount: true,
              usuario: payload.email || o.usuario,
            }
          : o
      )
    );
    setCreateProfileOwnerId(null);
  };

  const onEditSubmit = async (payload: EditarPropietarioForm) => {
    setOwners((prev) =>
      prev.map((o) =>
        o.id === payload.id
          ? {
              ...o,
              nombre: payload.nombre,
              apellido: payload.apellido,
              email: payload.email,
              telefono: payload.telefono,
              dni: payload.dni,
              direccion: payload.direccionResidencial,
            }
          : o
      )
    );
    setEditOwnerId(null);
  };

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

  return (
    <Surface style={styles.screen} elevation={0}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Propietarios" />
        <Appbar.Action icon="plus" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Buscar por nombre, apellido, email..."
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
            const fullName = `${item.nombre} ${item.apellido}`.trim();
            const isExpanded = expandedId === item.id;

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
                      onPress={() => setDocsOwnerId(item.id)}
                      style={styles.chip}
                    />
                    <IconButton
                      icon="pencil"
                      mode="contained"
                      size={18}
                      iconColor="#7C3AED"
                      containerColor="rgba(98, 9, 199, 0.2)"
                      onPress={() => setEditOwnerId(item.id)}
                      style={styles.chip}
                    />

                    {item.hasAccount ? (
                      <IconButton
                        icon="check-circle"
                        mode="contained"
                        size={18}
                        iconColor="#2E7D32"
                        containerColor="rgba(56, 142, 60, 0.2)"
                        onPress={() => toggleAccount(item.id)}
                        style={styles.chip}
                      />
                    ) : (
                      <IconButton
                        icon="account-plus"
                        mode="contained"
                        size={18}
                        iconColor="#2E7D32"
                        containerColor="rgba(67, 160, 71, 0.2)"
                        onPress={() => setCreateProfileOwnerId(item.id)}
                        style={styles.chip}
                      />
                    )}

                    <IconButton
                      icon="trash-can-outline"
                      mode="contained"
                      size={18}
                      iconColor="#D32F2F"
                      containerColor="rgba(244, 67, 54, 0.2)"
                      onPress={() => setDeleteOwnerId(item.id)}
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
                          {item.direccion || '—'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Usuario:</Text>
                        <Text style={styles.detailValue}>{item.usuario || '—'}</Text>
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
        <Dialog visible={deleteOwnerId != null} onDismiss={() => setDeleteOwnerId(null)}>
          <Dialog.Title>Eliminar propietario</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Seguro que querés eliminar a{' '}
              <Text style={styles.bold}>
                {deleteTarget ? `${deleteTarget.nombre} ${deleteTarget.apellido}` : 'este propietario'}
              </Text>
              ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteOwnerId(null)}>Cancelar</Button>
            <Button onPress={onConfirmDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <CreateOwnerProfileModal
          visible={createProfileOwnerId != null}
          owner={
            createProfileTarget
              ? {
                  nombre: createProfileTarget.nombre,
                  apellido: createProfileTarget.apellido,
                  dni: createProfileTarget.dni,
                  email: createProfileTarget.email,
                }
              : null
          }
          onDismiss={() => setCreateProfileOwnerId(null)}
          onSubmit={onCreateProfileSubmit}
        />
      </Portal>

      <DocumentManagerModal
        visible={docsOwnerId != null}
        onDismiss={() => setDocsOwnerId(null)}
        entityType="propietario"
        entityId={docsOwnerId}
        entityName={docsTarget ? `${docsTarget.nombre} ${docsTarget.apellido}` : undefined}
      />

      <EditarPropietarioModal
        visible={editOwnerId != null}
        onDismiss={() => setEditOwnerId(null)}
        propietario={
          editTarget
            ? {
                id: editTarget.id,
                nombre: editTarget.nombre,
                apellido: editTarget.apellido,
                telefono: editTarget.telefono,
                email: editTarget.email,
                dni: editTarget.dni,
                direccionResidencial: editTarget.direccion,
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
    marginTop: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#F5F6FA",
  },
  search: {
    borderRadius: 12,
    backgroundColor: "white",
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
    backgroundColor: "white"
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
