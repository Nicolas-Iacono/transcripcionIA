import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';

interface Contract {
  id: string;
  montoAlquiler?: number;
  comisionContratoPorc?: number;
  comisionMensualPorc?: number;
  comisionContratoMonto?: number;
  comisionMensualMonto?: number;
  duracion?: number;
}

interface PutMontoFormProps {
  selectedContract: Contract | null;
  setSelectedContract: (contract: Contract) => void;
  setContratos?: (updater: (prev: Contract[]) => Contract[]) => void;
}

export default function PutMontoForm({
  selectedContract,
  setSelectedContract,
  setContratos,
}: PutMontoFormProps) {
  const [actualizarMonto, setActualizarMonto] = useState({
    idContrato: '',
    montoAlquiler: 0,
  });
  const [displayValue, setDisplayValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatNumber = (num: number) => {
    if (!num) return '';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const parseNumber = (str: string) => {
    if (!str) return 0;
    return parseInt(str.replace(/\./g, '')) || 0;
  };

  useEffect(() => {
    if (selectedContract?.id) {
      setActualizarMonto((prev) => ({
        ...prev,
        idContrato: selectedContract.id,
      }));
    }
  }, [selectedContract]);

  const handleMontoAlquiler = async () => {
    if (!selectedContract) return;

    setIsLoading(true);
    try {
      // Simulated API call - replace with actual API when ready
      const response = {
        data: {
          idContrato: selectedContract.id,
          montoAlquiler: actualizarMonto.montoAlquiler,
        },
      };

      const newComisionContrato = selectedContract.comisionContratoPorc
        ? (response.data.montoAlquiler *
            (selectedContract.duracion || 24) *
            selectedContract.comisionContratoPorc) /
          100
        : selectedContract.comisionContratoMonto;

      const newComisionMensual = selectedContract.comisionMensualPorc
        ? (response.data.montoAlquiler * selectedContract.comisionMensualPorc) / 100
        : selectedContract.comisionMensualMonto;

      const updatedContract = {
        ...selectedContract,
        montoAlquiler: response.data.montoAlquiler,
        comisionContratoMonto: newComisionContrato,
        comisionMensualMonto: newComisionMensual,
      };

      setSelectedContract(updatedContract);

      if (typeof setContratos === 'function') {
        setContratos((prev) =>
          Array.isArray(prev)
            ? prev.map((contrato) =>
                contrato.id === selectedContract.id ? updatedContract : contrato
              )
            : prev
        );
      }

      setActualizarMonto({
        idContrato: response.data.idContrato,
        montoAlquiler: 0,
      });
      setDisplayValue('');
    } catch (error) {
      console.error('Error actualizando monto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Monto</Text>

      <View style={styles.inputRow}>
        <TextInput
          label="Nuevo monto"
          mode="outlined"
          value={displayValue}
          onChangeText={(inputValue) => {
            const numericValue = inputValue.replace(/[^\d]/g, '');

            if (numericValue) {
              const parsedValue = parseInt(numericValue);
              setActualizarMonto({ ...actualizarMonto, montoAlquiler: parsedValue });
              setDisplayValue(formatNumber(parsedValue));
            } else {
              setActualizarMonto({ ...actualizarMonto, montoAlquiler: 0 });
              setDisplayValue('');
            }
          }}
          disabled={isLoading}
          keyboardType="numeric"
          style={styles.input}
          dense
        />

        <Button
          mode="contained"
          onPress={handleMontoAlquiler}
          disabled={!actualizarMonto.montoAlquiler || isLoading}
          loading={isLoading}
          style={styles.button}
          buttonColor="#4CAF50"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2C61',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 12,
  },
});
