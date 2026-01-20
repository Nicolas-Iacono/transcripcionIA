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
import CreateTenantProfileModal, {
  type CreateTenantProfilePayload,
} from '@/components/CreateTenantProfileModal';
import DocumentManagerModal from '@/components/DocumentManagerModal';
import EditarInquilinoModal, {
  type EditarInquilinoForm,
} from '@/components/formularios/EditarInquilinoModal';
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

type Tenant = {
  id: string;
  nombre: string;
  apellido: string;
  email?: string;
  telefono?: string;
  dni?: string;
  cuit?: string;
  direccionResidencial?: string;
  usuario?: string;
  hasAccount?: boolean;
  creds?: { username: string; password: string } | null;
};

const ITEMS_PER_PAGE = 6;

const MOCK_TENANTS: Tenant[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@mail.com',
    telefono: '351-123-456',
    dni: '30111222',
    cuit: '20-30111222-3',
    direccionResidencial: 'Av. Colón 123',
    usuario: 'juan.perez@mail.com',
    hasAccount: true,
    creds: { username: 'juan.perez@mail.com', password: '123456' },
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'Gómez',
    email: 'maria.gomez@mail.com',
    telefono: '351-222-333',
    dni: '28999888',
    cuit: '27-28999888-9',
    direccionResidencial: 'Bv. San Juan 456',
    usuario: '',
    hasAccount: false,
    creds: null,
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Ruiz',
    email: 'carlos.ruiz@mail.com',
    telefono: '351-777-999',
    dni: '27123456',
    cuit: '20-27123456-1',
    direccionResidencial: 'Ituzaingó 789',
    usuario: 'carlos.ruiz@mail.com',
    hasAccount: true,
    creds: { username: 'carlos.ruiz@mail.com', password: 'abcd1234' },
  },
  {
    id: '4',
    nombre: 'Lucía',
    apellido: 'Fernández',
    email: 'lucia.fernandez@mail.com',
    telefono: '351-444-555',
    dni: '33444555',
    cuit: '27-33444555-2',
    direccionResidencial: '9 de Julio 100',
    usuario: '',
    hasAccount: false,
    creds: null,
  },
  {
    id: '5',
    nombre: 'Sofía',
    apellido: 'López',
    email: 'sofia.lopez@mail.com',
    telefono: '351-111-222',
    dni: '31222333',
    cuit: '27-31222333-4',
    direccionResidencial: 'Chacabuco 220',
    usuario: 'sofia.lopez@mail.com',
    hasAccount: true,
    creds: { username: 'sofia.lopez@mail.com', password: 'inqui2026' },
  },
  {
    id: '6',
    nombre: 'Miguel',
    apellido: 'Sosa',
    email: 'miguel.sosa@mail.com',
    telefono: '351-666-777',
    dni: '25666777',
    cuit: '20-25666777-8',
    direccionResidencial: 'Rondeau 14',
    usuario: '',
    hasAccount: false,
    creds: null,
  },
];

export default function InquilinosPage() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [deleteTenantId, setDeleteTenantId] = useState<string | null>(null);
  const [docsTenantId, setDocsTenantId] = useState<string | null>(null);
  const [editTenantId, setEditTenantId] = useState<string | null>(null);
  const [createProfileTenantId, setCreateProfileTenantId] = useState<string | null>(null);
  const [accountTenantId, setAccountTenantId] = useState<string | null>(null);

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return tenants;
    return tenants.filter((x) => {
      const full = `${x.nombre} ${x.apellido}`.toLowerCase();
      return (
        full.includes(t) ||
        (x.email ?? '').toLowerCase().includes(t) ||
        (x.telefono ?? '').toLowerCase().includes(t) ||
        (x.dni ?? '').toLowerCase().includes(t)
      );
    });
  }, [query, tenants]);

  const numberOfPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(page, numberOfPages - 1);
  const from = pageSafe * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, filtered.length);
  const pageItems = filtered.slice(from, to);

  const deleteTarget = useMemo(
    () => tenants.find((t) => t.id === deleteTenantId) ?? null,
    [deleteTenantId, tenants]
  );
  const editTarget = useMemo(
    () => tenants.find((t) => t.id === editTenantId) ?? null,
    [editTenantId, tenants]
  );
  const profileTarget = useMemo(
    () => tenants.find((t) => t.id === createProfileTenantId) ?? null,
    [createProfileTenantId, tenants]
  );
  const docsTarget = useMemo(
    () => tenants.find((t) => t.id === docsTenantId) ?? null,
    [docsTenantId, tenants]
  );
  const accountTarget = useMemo(
    () => tenants.find((t) => t.id === accountTenantId) ?? null,
    [accountTenantId, tenants]
  );

  const toggleExpanded = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const openWhatsApp = (telefono?: string, text?: string) => {
    if (!telefono) return;
    const digits = telefono.replace(/[^0-9]/g, '');
    if (!digits) return;
    const url = text
      ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
      : `https://wa.me/${digits}`;
    Linking.openURL(url).catch(() => {});
  };

  const openEmail = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`).catch(() => {});
  };

  const onConfirmDelete = () => {
    if (!deleteTenantId) return;
    setTenants((prev) => prev.filter((t) => t.id !== deleteTenantId));
    setDeleteTenantId(null);
    setExpandedId(null);
    setPage(0);
  };

  const onEditSubmit = async (payload: EditarInquilinoForm) => {
    setTenants((prev) =>
      prev.map((t) =>
        t.id === payload.id
          ? {
              ...t,
              nombre: payload.nombre,
              apellido: payload.apellido,
              email: payload.email,
              telefono: payload.telefono,
              dni: payload.dni,
              cuit: payload.cuit,
              direccionResidencial: payload.direccionResidencial,
            }
          : t
      )
    );
    setEditTenantId(null);
  };

  const onCreateProfileSubmit = (payload: CreateTenantProfilePayload) => {
    if (!createProfileTenantId) return;
    setTenants((prev) =>
      prev.map((t) =>
        t.id === createProfileTenantId
          ? {
              ...t,
              hasAccount: true,
              usuario: payload.email || t.usuario,
              creds: { username: payload.email, password: payload.password },
            }
          : t
      )
    );
    setCreateProfileTenantId(null);
  };

  const deleteTenantUser = () => {
    if (!accountTenantId) return;
    setTenants((prev) =>
      prev.map((t) =>
        t.id === accountTenantId
          ? {
              ...t,
              hasAccount: false,
              usuario: '',
              creds: null,
            }
          : t
      )
    );
  };

  const shareCredsWhatsApp = () => {
    if (!accountTarget?.creds) return;
    const username = accountTarget.creds.username;
    const password = accountTarget.creds.password;
    const texto = `\n*Descargate la app Tuinmo*\n\n_Desde Google Play buscá_ *Tuinmo*\n_y accedé con tus credenciales en la sección:_ _*Portal de alquileres*_\n\n\n*Usuario:* _${username}_\n*Contraseña:* _${password}_\n`;
    openWhatsApp(accountTarget.telefono, texto.trim());
  };

  return (
    <Surface style={styles.screen} elevation={0}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Inquilinos" />
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
            const isExpanded = expandedId === item.id;
            const fullName = `${item.nombre} ${item.apellido}`.trim();
            const hasAccount = !!item.hasAccount;

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
                      onPress={() => setDocsTenantId(item.id)}
                      style={styles.chip}
                    />
                    <IconButton
                      icon="pencil"
                      mode="contained"
                      size={18}
                      iconColor="#7C3AED"
                      containerColor="rgba(98, 9, 199, 0.2)"
                      onPress={() => setEditTenantId(item.id)}
                      style={styles.chip}
                    />

                    {hasAccount ? (
                      <IconButton
                        icon="vpn-key"
                        mode="contained"
                        size={18}
                        iconColor="#2E7D32"
                        containerColor="rgba(56, 142, 60, 0.2)"
                        onPress={() => setAccountTenantId(item.id)}
                        style={styles.chip}
                      />
                    ) : (
                      <IconButton
                        icon="account-plus"
                        mode="contained"
                        size={18}
                        iconColor="#2E7D32"
                        containerColor="rgba(67, 160, 71, 0.2)"
                        onPress={() => setCreateProfileTenantId(item.id)}
                        style={styles.chip}
                      />
                    )}

                    <IconButton
                      icon="trash-can-outline"
                      mode="contained"
                      size={18}
                      iconColor="#D32F2F"
                      containerColor="rgba(244, 67, 54, 0.2)"
                      onPress={() => setDeleteTenantId(item.id)}
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
                          <Text style={styles.detailLabel}>CUIT:</Text>
                          <Text style={styles.detailValue}>{item.cuit || '—'}</Text>
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
        <Dialog visible={deleteTenantId != null} onDismiss={() => setDeleteTenantId(null)}>
          <Dialog.Title>Eliminar inquilino</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Seguro que querés eliminar a{' '}
              <Text style={styles.bold}>
                {deleteTarget ? `${deleteTarget.nombre} ${deleteTarget.apellido}` : 'este inquilino'}
              </Text>
              ?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteTenantId(null)}>Cancelar</Button>
            <Button onPress={onConfirmDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={accountTenantId != null} onDismiss={() => setAccountTenantId(null)}>
          <Dialog.Title>Información</Dialog.Title>
          <Dialog.Content>
            <Text>
              El inquilino{' '}
              <Text style={styles.bold}>
                {accountTarget ? `${accountTarget.nombre} ${accountTarget.apellido}` : '—'}
              </Text>{' '}
              ya tiene una cuenta creada.
            </Text>

            <View style={styles.credsBox}>
              <Text>
                <Text style={styles.bold}>Usuario:</Text> {accountTarget?.creds?.username ?? '—'}
              </Text>
              <Text>
                <Text style={styles.bold}>Contraseña:</Text> {accountTarget?.creds?.password ?? '—'}
              </Text>
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                deleteTenantUser();
                setAccountTenantId(null);
              }}
            >
              Eliminar usuario
            </Button>
            <Button onPress={shareCredsWhatsApp} disabled={!accountTarget?.creds || !accountTarget?.telefono}>
              Compartir credenciales
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Portal>
        <CreateTenantProfileModal
          visible={createProfileTenantId != null}
          tenant={
            profileTarget
              ? {
                  nombre: profileTarget.nombre,
                  apellido: profileTarget.apellido,
                  dni: profileTarget.dni,
                  email: profileTarget.email,
                }
              : null
          }
          onDismiss={() => setCreateProfileTenantId(null)}
          onSubmit={onCreateProfileSubmit}
        />
      </Portal>

      <DocumentManagerModal
        visible={docsTenantId != null}
        onDismiss={() => setDocsTenantId(null)}
        entityType="inquilino"
        entityId={docsTenantId}
        entityName={docsTarget ? `${docsTarget.nombre} ${docsTarget.apellido}` : undefined}
      />

      <EditarInquilinoModal
        visible={editTenantId != null}
        onDismiss={() => setEditTenantId(null)}
        inquilino={
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
  credsBox: {
    marginTop: 12,
    gap: 6,
  },
  bold: {
    fontWeight: '700',
  },
});
