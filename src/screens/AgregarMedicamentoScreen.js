import { useState } from 'react';
import { View, Text, TextInput, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import BotonPersonalizado from '../components/BotonPersonalizado';
import SeccionRecursos from '../components/SeccionRecursos';
import { validarMedicamento, formatearHora } from '../utils/validaciones';
import {
  pedirPermisos,
  programarRecordatorioDiario,
  programarRecordatorioEnSegundos,
} from '../notifications/notificaciones';
import { crearEventoToma } from '../recursos/calendario';
import { useMedicamentosStore } from '../store/useMedicamentosStore';
import { colores, espacio } from '../theme';

const SEGUNDOS_DEMO = 10;

export default function AgregarMedicamentoScreen({ navigation }) {
  const agregar = useMedicamentosStore((s) => s.agregar);
  const [nombre, setNombre] = useState('');
  const [dosis, setDosis] = useState('');
  const [hora, setHora] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);
  // Recursos del dispositivo asociados al medicamento
  const [recursos, setRecursos] = useState({ foto: null, ubicacion: null, contacto: null });
  const [agregarAlCalendario, setAgregarAlCalendario] = useState(true);

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
      foto: recursos.foto,
      ubicacion: recursos.ubicacion,
      contacto: recursos.contacto,
      eventoCalendarioId: null,
    };

    // 1) Notificaciones: si fallan, el medicamento se guarda igual
    let permiso = false;
    try {
      permiso = await pedirPermisos();
      if (permiso) {
        medicamento.notificacionId = await programarRecordatorioDiario(medicamento);
        await programarRecordatorioEnSegundos(medicamento, SEGUNDOS_DEMO);
      }
    } catch (e) {
      console.warn('Error en notificaciones:', e);
      permiso = false;
    }

    // 2) Calendario: si falla, el medicamento se guarda igual
    if (agregarAlCalendario) {
      try {
        medicamento.eventoCalendarioId = await crearEventoToma(medicamento);
      } catch (e) {
        console.warn('Error en calendario:', e);
        medicamento.eventoCalendarioId = null;
      }
    }

    // 3) Guardar en el store global (que también lo persiste en AsyncStorage)
    try {
      await agregar(medicamento);

      Alert.alert(
        'Medicamento guardado',
        (permiso
          ? `Te vamos a avisar todos los días a las ${medicamento.hora}. ` +
            `También vas a recibir un aviso de prueba en ${SEGUNDOS_DEMO} segundos.`
          : 'Se guardó, pero no hay permiso para enviar notificaciones.') +
          (medicamento.eventoCalendarioId ? ' Además se agregó a tu calendario.' : '')
      );
      navigation.goBack();
    } catch (e) {
      setError(`No se pudo guardar el medicamento: ${e?.message || e}`);
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

      <SeccionRecursos
        foto={recursos.foto}
        ubicacion={recursos.ubicacion}
        contacto={recursos.contacto}
        onCambio={(cambios) => setRecursos((prev) => ({ ...prev, ...cambios }))}
      />

      <View style={styles.calendario}>
        <View style={styles.calendarioTextos}>
          <Text style={styles.calendarioTitulo}>📅 Agregar al calendario</Text>
          <Text style={styles.ayudaCalendario}>Crea un evento diario a la hora de la toma</Text>
        </View>
        <Switch
          value={agregarAlCalendario}
          onValueChange={setAgregarAlCalendario}
          trackColor={{ true: colores.primario }}
        />
      </View>

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
  calendario: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 12,
    marginVertical: espacio.medio,
  },
  calendarioTextos: {
    flex: 1,
  },
  calendarioTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: colores.texto,
  },
  ayudaCalendario: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  error: {
    color: colores.peligro,
    marginBottom: 8,
  },
});
