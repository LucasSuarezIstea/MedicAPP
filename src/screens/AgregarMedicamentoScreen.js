import { useState } from 'react';
import { Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import BotonPersonalizado from '../components/BotonPersonalizado';
import { validarMedicamento, formatearHora } from '../utils/validaciones';
import { obtenerMedicamentos, guardarMedicamentos } from '../storage/storage';
import {
  pedirPermisos,
  programarRecordatorioDiario,
  programarRecordatorioEnSegundos,
} from '../notifications/notificaciones';
import { useAuth } from '../context/AuthContext';
import { colores, espacio } from '../theme';

const SEGUNDOS_DEMO = 10;

export default function AgregarMedicamentoScreen({ navigation }) {
  const { usuario } = useAuth();
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    const errorValidacion = validarMedicamento(nombre, hora);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }
    setError('');
    setGuardando(true);

    const medicamento = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      dosis: dosis.trim(),
      hora: formatearHora(hora),
      notificacionId: null,
    };

    try {
      const permiso = await pedirPermisos();
      if (permiso) {
        // Recordatorio real: todos los días a la hora elegida
        medicamento.notificacionId = await programarRecordatorioDiario(medicamento);
        // Recordatorio de prueba a los pocos segundos (para la demo)
        await programarRecordatorioEnSegundos(medicamento, SEGUNDOS_DEMO);
      }

      const lista = await obtenerMedicamentos(usuario);
      await guardarMedicamentos(usuario, [...lista, medicamento]);

      Alert.alert(
        'Medicamento guardado',
        permiso
          ? `Te vamos a avisar todos los días a las ${medicamento.hora}. ` +
              `También vas a recibir un aviso de prueba en ${SEGUNDOS_DEMO} segundos.`
          : 'Se guardó, pero no hay permiso para enviar notificaciones.'
      );
      navigation.goBack();
    } catch (e) {
      setError('No se pudo guardar el medicamento');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Nombre del medicamento *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: Ibuprofeno"
        value={nombre}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Dosis (opcional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: 1 comprimido de 400 mg"
        value={dosis}
        onChangeText={setDosis}
      />

      <Text style={styles.label}>Hora del recordatorio *</Text>
      <TextInput
        style={styles.input}
        placeholder="HH:MM (ej: 08:30)"
        keyboardType="numbers-and-punctuation"
        maxLength={5}
        value={hora}
        onChangeText={setHora}
      />
      <Text style={styles.ayuda}>Formato 24 horas. Te va a llegar un aviso todos los días.</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <BotonPersonalizado titulo="Guardar" onPress={guardar} cargando={guardando} />
      <BotonPersonalizado
        titulo="Cancelar"
        variante="secundario"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    padding: espacio.grande,
    backgroundColor: colores.fondo,
    flexGrow: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.textoSuave,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 14,
  },
  ayuda: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: -8,
    marginBottom: espacio.medio,
  },
  error: {
    color: colores.peligro,
    marginBottom: 8,
  },
});
