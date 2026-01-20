import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {
  Portal,
  Appbar,
  Surface,
  Button,
  ActivityIndicator,
  Text,
} from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import RichTextWebEditor from './RichTextWebEditor';

interface Contract {
  id: string;
  nombreContrato: string;
  contenidoEditado?: string;
  montoAlquiler?: number;
  montoAlquilerLetras?: string;
  destino?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  duracion?: number;
  actualizacion?: number;
  indiceAjuste?: string;
  multaXDia?: number;
  aguaPorcentaje?: number;
  aguaEmpresa?: string;
  luzPorcentaje?: number;
  luzEmpresa?: string;
  gasPorcentaje?: number;
  gasEmpresa?: string;
  municipalPorcentaje?: number;
  municipalEmpresa?: string;
  propiedad?: {
    direccion?: string;
    localidad?: string;
    partido?: string;
    provincia?: string;
    tipo?: string;
    inventario?: string;
  };
  propietario?: {
    nombre?: string;
    apellido?: string;
    pronombre?: string;
    nacionalidad?: string;
    dni?: string;
    cuit?: string;
  };
  inquilino?: {
    nombre?: string;
    apellido?: string;
    pronombre?: string;
    nacionalidad?: string;
    dni?: string;
    cuit?: string;
  };
  garantes?: Array<{
    nombre?: string;
    apellido?: string;
    pronombre?: string;
    nacionalidad?: string;
    dni?: string;
    cuit?: string;
    direccionResidencial?: string;
  }>;
  usuarioDtoSalida?: {
    nombreNegocio?: string;
    razonSocial?: string;
    localidad?: string;
    partido?: string;
  };
}

interface ContractEditorModalProps {
  visible: boolean;
  contract: Contract | null;
  onDismiss: () => void;
}

export default function ContractEditorModal({
  visible,
  contract,
  onDismiss,
}: ContractEditorModalProps) {
  const insets = useSafeAreaInsets();
  const [contractText, setContractText] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (val?: string) => {
    if (!val) return '';
    const s = String(val).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
    const base = s.split('T')[0].replaceAll('.', '-');
    if (/^\d{4}-\d{2}-\d{2}$/.test(base)) {
      const [y, m, d] = base.split('-');
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yy = String(d.getFullYear());
      return `${dd}/${mm}/${yy}`;
    }
    return s;
  };

  const formatMoney = (val?: number) => {
    if (val === null || val === undefined) return '';
    const raw = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9,.-]/g, '').replace(',', '.'));
    if (isNaN(raw)) return String(val);
    const fixed = raw.toFixed(2);
    let [int, dec] = fixed.split('.');
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const withDecimals = dec && dec !== '00' ? `${int},${dec}` : int;
    return `$${withDecimals}`;
  };

  const formatDni = (val?: string | number) => {
    if (val === null || val === undefined || val === '') return '';
    const raw = typeof val === 'number' ? val : Number(String(val).replace(/[^0-9]/g, ''));
    if (isNaN(raw)) return String(val);
    return raw.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const formatCuil = (val?: string) => {
    if (val === null || val === undefined || val === '') return '';
    const digits = String(val).replace(/\D/g, '');
    const a = digits.slice(0, 2);
    const b = digits.slice(2, 10);
    const c = digits.slice(10, 11);
    return [a, b, c].filter(Boolean).join('-');
  };

  const indexacion = (actualizacion?: number) => {
    const mapa: Record<number, string> = {
      1: 'mensuales',
      2: 'bimestrales',
      3: 'trimestrales',
      4: 'cuatrimestrales',
      5: 'quintumestrales',
      6: 'semestrales',
      12: 'anuales',
    };
    return mapa[actualizacion || 6] || 'semestrales';
  };

  const generateContractText = (contract: Contract) => {
    const prop = contract.propiedad || {};
    const owner = contract.propietario || {};
    const tenant = contract.inquilino || {};
    const garantes = contract.garantes || [];
    const empresa = contract.usuarioDtoSalida || {};

    return `**Contrato de Alquiler**

En la Ciudad de ${empresa.partido || 'Buenos Aires'}, en el día de hoy ${formatDate(contract.fecha_inicio)}, ${owner.pronombre || 'el Sr./Sra.'} ${owner.nombre || ''} ${owner.apellido || ''} de nacionalidad ${owner.nacionalidad || 'Argentina'}, DNI N° ${formatDni(owner.dni)}, CUIL ${formatCuil(owner.cuit)} en adelante denominada la "parte LOCADORA", y por la otra parte ${tenant.pronombre || 'el Sr./Sra.'} ${tenant.nombre || ''} ${tenant.apellido || ''} de nacionalidad ${tenant.nacionalidad || 'Argentina'} con DNI N° ${formatDni(tenant.dni)}, CUIL ${formatCuil(tenant.cuit)} con domicilio en la calle ${prop.direccion || ''} de la ciudad de ${prop.localidad || ''}, partido de ${prop.partido || ''} Provincia de ${prop.provincia || ''}, en adelante llamado la "parte LOCATARIA", convienen en celebrar el presente Contrato de Locación.

PRIMERA: OBJETO
La parte Locadora da en locación a la parte Locataria, quien acepta de plena conformidad y a entera satisfacción, ${prop.tipo || 'inmueble'} del que es propietaria, ubicado sobre la calle ${prop.direccion || ''} de la ciudad de ${prop.localidad || ''}, partido de ${prop.partido || ''}, Provincia de ${prop.provincia || ''}, que consta del siguiente INVENTARIO: ${prop.inventario || 'Sin inventario especificado'}.

SEGUNDA: PLAZO
El plazo de vigencia del presente contrato es pactado entre las partes en ${contract.duracion || 24} meses. Dicho plazo será contado a partir del ${formatDate(contract.fecha_inicio)}, por lo que operará su vencimiento de pleno derecho el ${formatDate(contract.fecha_fin)}. En caso que La Locataria no haga entrega del inmueble el día del vencimiento del contrato, se obliga a pagar una multa de pesos ${formatMoney(contract.multaXDia)} por cada día que pase de la fecha convenida de finalización.

TERCERA: PRECIO
Las partes de común acuerdo pactan que el canon locativo MENSUAL inicial será de PESOS ${contract.montoAlquilerLetras || ''} (${formatMoney(contract.montoAlquiler)}). El índice de ajuste para este contrato será el ${contract.indiceAjuste || 'ICL'} publicado por el Banco Central de la República Argentina. Los ajustes se pactan por períodos ${indexacion(contract.actualizacion)}.

CUARTA: FORMA DE PAGO
La parte Locataria abonará el alquiler del mes en curso del 1 al 10 de cada mes, en la inmobiliaria ${empresa.nombreNegocio || ''}, sito en la calle ${empresa.razonSocial || ''}, Localidad de ${empresa.localidad || ''}, Partido de ${empresa.partido || ''}.

QUINTA: SERVICIOS E IMPUESTOS
Las partes convienen que será a cargo de la Parte Locataria: El pago del ${contract.aguaPorcentaje || 0}% del servicio provisto por ${contract.aguaEmpresa || 'la empresa de agua'}, además también deberá abonar el ${contract.luzPorcentaje || 0}% del servicio provisto por ${contract.luzEmpresa || 'la empresa de luz'} y el ${contract.gasPorcentaje || 0}% del servicio provisto por ${contract.gasEmpresa || 'la empresa de gas'}. Asimismo le corresponderá a la parte locataria, abonar el ${contract.municipalPorcentaje || 0}% del servicio provisto por ${contract.municipalEmpresa || 'el municipio'}.

SEXTA: ESTADO DEL BIEN LOCADO
La Locataria recibe el inmueble en muy buen estado de conservación, situación que manifiesta conocer, comprometiéndose a reintegrar el inmueble en las mismas condiciones que lo recibe al momento de la finalización del presente contrato.

SÉPTIMA: DESTINO DE LA LOCACIÓN
La Locataria destinará el inmueble para uso ${contract.destino || 'habitacional'}, el cual será ocupado únicamente por La Locataria, no pudiéndose dar otro destino por causa alguna.

${garantes.length > 0 ? `FIANZA
${garantes.map((g, i) => `${g.pronombre || 'El Sr./Sra.'} ${g.nombre || ''} ${g.apellido || ''} de nacionalidad ${g.nacionalidad || 'Argentina'}, con DNI N° ${formatDni(g.dni)}; CUIL ${formatCuil(g.cuit)}, con domicilio en ${g.direccionResidencial || ''}${i < garantes.length - 1 ? ', ' : ''}`).join('')} se constituye${garantes.length > 1 ? 'n' : ''} en FIADOR${garantes.length > 1 ? 'ES LISOS LLANOS' : ' LISO LLANO'} y principal${garantes.length > 1 ? 'es pagadores' : ' pagador'} con todo su patrimonio presente y futuro de todos los gastos que devengue este contrato.` : ''}

FIRMAS

LOCADORA
${owner.nombre || ''} ${owner.apellido || ''}
DNI: ${formatDni(owner.dni)}

LOCATARIA
${tenant.nombre || ''} ${tenant.apellido || ''}
DNI: ${formatDni(tenant.dni)}`;
  };

  useEffect(() => {
    if (visible && contract) {
      setLoading(true);
      // Si hay contenido editado guardado, usarlo; sino generar el texto por defecto
      const text = contract.contenidoEditado || generateContractText(contract);
      setContractText(text);
      setLoading(false);
    }
  }, [visible, contract]);

  const generatePDFHTML = () => {
    const htmlContent = contractText;
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contrato - ${contract?.nombreContrato}</title>
  <style>
    body {
      font-family: 'Times New Roman', serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #000;
      padding: 40px;
      margin: 0;
    }
    .contrato-content {
      max-width: 800px;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div class="contrato-content">
    ${htmlContent}
  </div>
</body>
</html>
    `;
  };

  const handleGeneratePDF = async () => {
    if (!contract) return;

    setSaving(true);
    try {
      const html = generatePDFHTML();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Compartir Contrato',
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'PDF Generado',
          'El contrato se generó exitosamente.',
          [{ text: 'OK' }]
        );
      }

      onDismiss();
    } catch (error) {
      console.error('Error generando PDF:', error);
      Alert.alert(
        'Error',
        'No se pudo generar el PDF del contrato.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!contract) return;

    setSaving(true);
    try {
      // TODO: Aquí se integrará la API para persistir el contenido editado
      // Por ahora, solo guardamos localmente en el objeto contract
      // await api.updateContract(contract.id, { contenidoEditado: contractText });
      
      // Simulación de guardado exitoso
      contract.contenidoEditado = contractText;
      
      Alert.alert(
        'Cambios Guardados',
        'El contenido del contrato se guardó correctamente. La próxima vez que abras el editor verás estos cambios.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error guardando cambios:', error);
      Alert.alert(
        'Error',
        'No se pudieron guardar los cambios del contrato.',
        [{ text: 'OK' }]
      );
    } finally {
      setSaving(false);
    }
  };

  if (!visible || !contract) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        <Surface style={[styles.surface, { paddingBottom: insets.bottom }]} elevation={5}>
          <Appbar.Header style={styles.header}>
            <Appbar.Content title={`Editor. ${contract.nombreContrato}`} titleStyle={styles.headerTitle} />
            <Appbar.Action icon="close" onPress={onDismiss} />
          </Appbar.Header>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1F2C61" />
              <Text style={styles.loadingText}>Cargando contrato...</Text>
            </View>
          ) : (
            <>
              <RichTextWebEditor
                value={contractText}
                onChangeText={setContractText}
              />

              <View style={styles.footer}>
                <Button
                  mode="outlined"
                  onPress={onDismiss}
                  style={styles.cancelButton}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveChanges}
                  loading={saving}
                  disabled={saving}
                  buttonColor="#1F2C61"
                  style={styles.actionButton}
                  icon="content-save"
                >
                  Guardar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleGeneratePDF}
                  loading={saving}
                  disabled={saving}
                  buttonColor="#C22961"
                  style={styles.actionButton}
                  icon="file-pdf-box"
                >
                  Generar PDF
                </Button>
              </View>
            </>
          )}
        </Surface>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    flex: 1,
    
  },
  surface: {
    flex: 1,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#1F2C61',
    elevation: 0,
    height: 35,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F5F6FA',
  },
  cancelButton: {
    flex: 1,
    borderColor: '#1F2C61',
  },
  actionButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});
