import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Chip,
  Dialog,
  IconButton,
  Portal,
  Searchbar,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import ContractDetailModal from '@/components/ContractDetailModal';
import ContractPDFGenerator from '../components/ContractPDFGenerator';

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

const ITEMS_PER_PAGE = 4;

const MOCK_CONTRATOS: Contract[] = [
  {
    id: '1',
    nombreContrato: 'Contrato Depto Centro',
    estados: ['ACTIVO'],
    montoAlquiler: 250000,
    propiedadDireccion: 'Av. Colón 123',
    propietarioNombre: 'Juan Pérez',
    inquilinoNombre: 'María Gómez',
    destino: 'Vivienda',
    fecha_inicio: '2024-01-15',
    fecha_fin: '2026-01-15',
    comisionContratoMonto: 250000,
    comisionMensualMonto: 12500,
    porcentajeContrato: 100,
    porcentajeMensual: 5,
    propiedad: { direccion: 'Av. Colón 123' },
    propietario: {
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan.perez@email.com',
      telefono: '+5493512345678',
      dni: '30123456',
    },
    inquilino: {
      nombre: 'María',
      apellido: 'Gómez',
      email: 'maria.gomez@email.com',
      telefono: '+5493517654321',
      dni: '32654321',
    },
    garantes: [
      {
        id: 'g1',
        nombre: 'Roberto',
        apellido: 'Gómez',
        email: 'roberto.gomez@email.com',
        telefono: '+5493519876543',
        dni: '28987654',
      },
    ],
  },
  {
    id: '2',
    nombreContrato: 'Contrato Casa Norte',
    estados: ['RENOVADO'],
    montoAlquiler: 320000,
    propiedadDireccion: 'Bv. San Juan 456',
    propietarioNombre: 'Carlos Ruiz',
    inquilinoNombre: 'Sofía López',
    destino: 'Vivienda',
    fecha_inicio: '2023-06-01',
    fecha_fin: '2025-06-01',
    comisionContratoMonto: 320000,
    comisionMensualMonto: 16000,
    porcentajeContrato: 100,
    porcentajeMensual: 5,
    propiedad: { direccion: 'Bv. San Juan 456' },
    propietario: {
      nombre: 'Carlos',
      apellido: 'Ruiz',
      email: 'carlos.ruiz@email.com',
      telefono: '+5493511122334',
      dni: '29112233',
    },
    inquilino: {
      nombre: 'Sofía',
      apellido: 'López',
      email: 'sofia.lopez@email.com',
      telefono: '+5493514455667',
      dni: '33445566',
    },
    garantes: [],
  },
  {
    id: '3',
    nombreContrato: 'Contrato Local Comercial',
    estados: ['FINALIZADO'],
    montoAlquiler: 480000,
    propiedadDireccion: 'Ituzaingó 789',
    propietarioNombre: 'Lucía Fernández',
    inquilinoNombre: 'Miguel Sosa',
    destino: 'Comercial',
    fecha_inicio: '2022-03-10',
    fecha_fin: '2024-03-10',
    comisionContratoMonto: 480000,
    comisionMensualMonto: 24000,
    porcentajeContrato: 100,
    porcentajeMensual: 5,
    propiedad: { direccion: 'Ituzaingó 789' },
    propietario: {
      nombre: 'Lucía',
      apellido: 'Fernández',
      email: 'lucia.fernandez@email.com',
      telefono: '+5493517788990',
      dni: '31778899',
    },
    inquilino: {
      nombre: 'Miguel',
      apellido: 'Sosa',
      email: 'miguel.sosa@email.com',
      telefono: '+5493516677889',
      dni: '34667788',
    },
    garantes: [],
  },
  {
    id: '4',
    nombreContrato: 'Contrato Monoambiente',
    estados: ['ARCHIVADO'],
    montoAlquiler: 185000,
    propiedadDireccion: '9 de Julio 100',
    propietarioNombre: 'Valentina Martínez',
    inquilinoNombre: 'Alberto Torres',
    destino: 'Vivienda',
    fecha_inicio: '2021-09-01',
    fecha_fin: '2023-09-01',
    comisionContratoMonto: 185000,
    comisionMensualMonto: 9250,
    porcentajeContrato: 100,
    porcentajeMensual: 5,
    propiedad: { direccion: '9 de Julio 100' },
    propietario: {
      nombre: 'Valentina',
      apellido: 'Martínez',
      email: 'valentina.martinez@email.com',
      telefono: '+5493513344556',
      dni: '27334455',
    },
    inquilino: {
      nombre: 'Alberto',
      apellido: 'Torres',
      email: 'alberto.torres@email.com',
      telefono: '+5493515566778',
      dni: '35556677',
    },
    garantes: [],
  },
  {
    id: '5',
    nombreContrato: 'Contrato Depto Sur',
    estados: ['ACTIVO', 'RENOVADO'],
    montoAlquiler: 290000,
    propiedadDireccion: 'Chacabuco 220',
    propietarioNombre: 'Rubén Cabrera',
    inquilinoNombre: 'José Trofa',
    destino: 'Vivienda',
    fecha_inicio: '2023-11-20',
    fecha_fin: '2025-11-20',
    comisionContratoMonto: 290000,
    comisionMensualMonto: 14500,
    porcentajeContrato: 100,
    porcentajeMensual: 5,
    propiedad: { direccion: 'Chacabuco 220' },
    propietario: {
      nombre: 'Rubén',
      apellido: 'Cabrera',
      email: 'ruben.cabrera@email.com',
      telefono: '+5493518899001',
      dni: '26889900',
    },
    inquilino: {
      nombre: 'José',
      apellido: 'Trofa',
      email: 'jose.trofa@email.com',
      telefono: '+5493512233445',
      dni: '36223344',
    },
    garantes: [
      {
        id: 'g2',
        nombre: 'Ana',
        apellido: 'Trofa',
        email: 'ana.trofa@email.com',
        telefono: '+5493514455778',
        dni: '29445577',
      },
      {
        id: 'g3',
        nombre: 'Pedro',
        apellido: 'Morales',
        email: 'pedro.morales@email.com',
        telefono: '+5493516688990',
        dni: '28668899',
      },
    ],
  },
];

const estadoColor = (estado: EstadoContrato) => {
  const colors: Record<EstadoContrato, string> = {
    ACTIVO: '#5E5CE6',
    RENOVADO: '#F7C931',
    ARCHIVADO: '#2FD5C7',
    FINALIZADO: '#F44336',
  };
  return colors[estado];
};

const ESTADO_ORDER: EstadoContrato[] = ['ACTIVO', 'RENOVADO', 'FINALIZADO', 'ARCHIVADO'];

const uniqueEstadosSorted = (estados: EstadoContrato[]) => {
  const set = new Set(estados);
  const unique = Array.from(set);
  const sorted: EstadoContrato[] = [
    ...ESTADO_ORDER.filter((s) => unique.includes(s)),
    ...unique.filter((s) => !ESTADO_ORDER.includes(s)),
  ];
  return sorted;
};

export default function ContratosPage() {
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRATOS);
  const [query, setQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState<EstadoContrato | null>(null);
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [pdfId, setPdfId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental?.(true);
    }
  }, []);

  useEffect(() => {
    setPage(0);
  }, [query, estadoFilter]);

  const searched = useMemo(() => {
    const t = query.trim().toLowerCase();
    if (!t) return contracts;
    return contracts.filter((c) => {
      const haystack = [
        c.nombreContrato,
        c.propiedadDireccion ?? '',
        c.propietarioNombre ?? '',
        c.inquilinoNombre ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(t);
    });
  }, [contracts, query]);

  const filtered = useMemo(() => {
    if (!estadoFilter) return searched;
    return searched.filter((c) => c.estados.includes(estadoFilter));
  }, [estadoFilter, searched]);

  const counts = useMemo(() => {
    const initial: Record<EstadoContrato, number> = {
      ACTIVO: 0,
      RENOVADO: 0,
      FINALIZADO: 0,
      ARCHIVADO: 0,
    };

    for (const c of searched) {
      for (const e of ESTADO_ORDER) {
        if (c.estados.includes(e)) initial[e] += 1;
      }
    }

    return initial;
  }, [searched]);

  const numberOfPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageSafe = Math.min(page, numberOfPages - 1);
  const from = pageSafe * ITEMS_PER_PAGE;
  const to = Math.min(from + ITEMS_PER_PAGE, filtered.length);
  const pageItems = filtered.slice(from, to);

  const deleteTarget = useMemo(
    () => contracts.find((c) => c.id === deleteId) ?? null,
    [contracts, deleteId]
  );

  const editTarget = useMemo(
    () => contracts.find((c) => c.id === editId) ?? null,
    [contracts, editId]
  );

  const detailTarget = useMemo(
    () => contracts.find((c) => c.id === detailId) ?? null,
    [contracts, detailId]
  );

  useEffect(() => {
    if (detailId && notes[detailId]) setNoteDraft(notes[detailId]);
    else if (detailId) setNoteDraft('');
  }, [detailId, notes]);

  const toggleExpanded = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const toggleEstado = (contratoId: string, estado: EstadoContrato) => {
    setContracts((prev) =>
      prev.map((c) => {
        if (c.id !== contratoId) return c;
        const current = Array.isArray(c.estados) ? c.estados : [];
        const next = current.includes(estado)
          ? current.filter((x) => x !== estado)
          : [...current, estado];
        return { ...c, estados: next };
      })
    );
  };

  const onConfirmDelete = () => {
    if (!deleteId) return;
    setContracts((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setExpandedId(null);
    setPage(0);
  };

  const onSaveNote = () => {
    if (!detailId) return;
    setNotes((prev) => ({ ...prev, [detailId]: noteDraft }));
  };

  return (
    <Surface style={styles.screen} elevation={0}>
      <Appbar.Header mode="small" style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Contratos" />
        <Appbar.Action icon="plus" onPress={() => {}} />
      </Appbar.Header>

      <View style={styles.content}>
        <Searchbar
          placeholder="Buscar contrato, propietario, inquilino..."
          value={query}
          onChangeText={setQuery}
          style={styles.search}
        />

        <View style={styles.filterRow}>
          {ESTADO_ORDER.map((estado) => {
            const selected = estadoFilter === estado;
            const base = estadoColor(estado);
            return (
              <Chip
                key={estado}
                compact
                mode={selected ? 'flat' : 'outlined'}
                selected={selected}
                onPress={() => setEstadoFilter((prev) => (prev === estado ? null : estado))}
                style={[
                  styles.chip,
                  selected ? { backgroundColor: base, borderColor: base } : { borderColor: base },
                ]}
                textStyle={selected ? styles.chipTextSelected : { color: base, fontWeight: '700',fontSize: 8.5 }}
              >
                {`${estado} (${counts[estado]})`}
              </Chip>
            );
          })}

          <Text style={styles.totalText}>Total: {filtered.length}</Text>
        </View>

        <FlatList
          data={pageItems}
          extraData={expandedId}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const isExpanded = expandedId === item.id;
            const estados = uniqueEstadosSorted(item.estados);

            return (
              <Card mode="elevated" style={styles.card}>
                <View style={styles.estadoBar}>
                  {estados.length === 0 ? (
                    <View style={[styles.estadoSegment, { flex: 1, backgroundColor: 'transparent' }]} />
                  ) : (
                    estados.map((e) => (
                      <View
                        key={e}
                        style={[styles.estadoSegment, { flex: 1, backgroundColor: estadoColor(e) }]}
                      />
                    ))
                  )}
                </View>

                <Card.Content style={styles.cardContent}>
                  <View style={styles.headerTopRow}>
                    <View style={styles.headerLeft}>
                      <IconButton icon="home" size={22} iconColor="#1F2C61" style={styles.homeIcon} />
                      <Text style={styles.cardTitle} numberOfLines={2}>
                        {item.nombreContrato}
                      </Text>
                    </View>

                    <View style={styles.headerRight}>
                      <IconButton
                        icon="pencil"
                        size={15}
                        iconColor="#1F2C61"
                        containerColor="#ECEEF5"
                        onPress={() => setEditId(item.id)}
                        style={styles.headerCircleBtn}
                      />
                     
                    </View>
                  </View>

                  <TouchableRipple onPress={() => toggleExpanded(item.id)} borderless style={styles.detailsTapArea}>
                    <View style={styles.detailBlock}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Dirección:</Text>
                        <Text style={[styles.detailValue, styles.flex1]} numberOfLines={2}>
                          {item.propiedadDireccion || '—'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Propietario:</Text>
                        <Text style={[styles.detailValue, styles.flex1]} numberOfLines={2}>
                          {item.propietarioNombre || '—'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Inquilino:</Text>
                        <Text style={[styles.detailValue, styles.flex1]} numberOfLines={2}>
                          {item.inquilinoNombre || '—'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Monto:</Text>
                        <Text style={styles.detailValue}>
                          ${item.montoAlquiler ? item.montoAlquiler.toLocaleString() : '—'}
                        </Text>
                      </View>
                    </View>
                  </TouchableRipple>

                  {isExpanded && (
                    <View style={styles.estadoToggleRow}>
                      {ESTADO_ORDER.map((estado) => {
                        const active = item.estados.includes(estado);
                        const color = estadoColor(estado);
                        return (
                          <Pressable
                            key={estado}
                            onPress={() => toggleEstado(item.id, estado)}
                            style={[
                              styles.estadoToggle,
                              active ? { backgroundColor: color } : { borderColor: color },
                            ]}
                          >
                            <Text style={active ? styles.estadoToggleTextActive : { color, fontWeight: '800' }}>
                              {estado.slice(0, 1)}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}

                  <View style={styles.actionsBottomRow}>
                    <IconButton
                      icon="eye-outline"
                      size={21}
                      iconColor="#1F2C61"
                      containerColor="#D6DAE6"
                      onPress={() => setDetailId(item.id)}
                      style={styles.actionCircle}
                    />
                    <IconButton
                      icon="file-pdf-box"
                      size={21}
                      iconColor="#C22961"
                      containerColor="#F5C5D3"
                      onPress={() => setPdfId(item.id)}
                      style={styles.actionCircle}
                    />
                    <IconButton
                      icon="receipt"
                      size={21}
                      iconColor="#2E7D32"
                      containerColor="#C7F1D4"
                      onPress={() => router.push(`/RecibosGeneradosPage?contratoId=${item.id}`)}
                      style={styles.actionCircle}
                    />
                    <IconButton
                      icon="trash-can-outline"
                      size={21}
                      iconColor="#D32F2F"
                      containerColor="#F6B1B1"
                      onPress={() => setDeleteId(item.id)}
                      style={styles.actionCircle}
                    />
                  </View>
                </Card.Content>
              </Card>
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
                  <Text style={[styles.pageText, active ? styles.pageTextActive : undefined]}>{i + 1}</Text>
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

      <ContractDetailModal
        visible={detailId != null}
        contract={detailTarget}
        onDismiss={() => setDetailId(null)}
        onNavigateToReceipts={(contractId) => {
          console.log('Navigate to receipts:', contractId);
          setDetailId(null);
        }}
      />

      <Portal>
        <Dialog visible={deleteId != null} onDismiss={() => setDeleteId(null)}>
          <Dialog.Title>Eliminar contrato</Dialog.Title>
          <Dialog.Content>
            <Text>
              ¿Seguro que querés eliminar{' '}
              <Text style={styles.bold}>{deleteTarget?.nombreContrato ?? 'este contrato'}</Text>?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDeleteId(null)}>Cancelar</Button>
            <Button onPress={onConfirmDelete}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={editId != null} onDismiss={() => setEditId(null)}>
          <Dialog.Title>Editar contrato</Dialog.Title>
          <Dialog.Content>
            <Text>
              Editar: <Text style={styles.bold}>{editTarget?.nombreContrato ?? 'Contrato'}</Text>
            </Text>
            <Text style={styles.emptySub}>Este modal queda como placeholder para conectar el editor real.</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setEditId(null)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>

      </Portal>

      <ContractPDFGenerator
        visible={pdfId != null}
        contract={contracts.find((c) => c.id === pdfId) || null}
        onDismiss={() => setPdfId(null)}
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
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  chip: {
    borderWidth: 1,
    fontSize: 11,
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '800',
  },
  totalText: {
    marginLeft: 'auto',
    opacity: 0.7,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  estadoBar: {
    flexDirection: 'row',
    height: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  estadoSegment: {
    height: 10,
  },
  cardContent: {
    position:'relative',
    paddingTop: 14,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 6,
  },
  homeIcon: {
    margin: 0,
  },
  headerRight: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    position: 'absolute',
    right: 0,
  },
  headerCircleBtn: {
    width: 34,
    height: 34,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    textTransform: 'uppercase',

  },
  detailsTapArea: {
    borderRadius: 14,
    paddingTop: 8,
  },
  detailBlock: {
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  detailLabel: {
    width: 96,
    fontWeight: '800',
  },
  detailValue: {
    flexShrink: 1,
  },
  flex1: {
    flex: 1,
  },
  estadoToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingBottom: 6,
  },
  estadoToggle: {
    width: 34,
    height: 34,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  estadoToggleTextActive: {
    color: '#fff',
    fontWeight: '900',
  },
  actionsBottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 14,
  },
  actionCircle: {
    width: 45,
    height: 45,
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
  detailTitle: {
    marginBottom: 8,
    fontWeight: '900',
  },
  note: {
    marginTop: 12,
  },
});
