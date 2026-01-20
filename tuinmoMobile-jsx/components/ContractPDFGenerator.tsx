import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Text, Button } from 'react-native-paper';
import ContractEditorModal from './ContractEditorModal';

interface Contract {
  id: string;
  nombreContrato: string;
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

interface ContractPDFGeneratorProps {
  visible: boolean;
  contract: Contract | null;
  onDismiss: () => void;
}

export default function ContractPDFGenerator({
  visible,
  contract,
  onDismiss,
}: ContractPDFGeneratorProps) {
  if (!contract) return null;

  return (
    <ContractEditorModal
      visible={visible}
      contract={contract}
      onDismiss={onDismiss}
    />
  );
}

const styles = StyleSheet.create({
  contractName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2C61',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#1F2C61',
  },
});
