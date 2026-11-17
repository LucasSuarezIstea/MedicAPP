import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import BotonPersonalizado from '../components/BotonPersonalizado';
import SeccionRecursos from '../components/SeccionRecursos';
import { crearEventoToma, eliminarEventoToma } from '../recursos/calendario';
import { cancelarNotificacion } from '../notifications/notificaciones';
import { useMedicamentosStore, selectMedicamento } from '../store/useMedicamentosStore';
import { colores, espacio } from '../theme';

/**
 * Detalle de un medicamento: muestra y permite cambiar la foto, la ubicación de la farmacia,
 * el contacto y el evento del calendario. Lee y modifica el medicamento a través del store.
 */
export default function DetalleMedicamentoScreen({ route, navigation }) {
  const { id } = route.params;
  const medicamento = useMedicamentosStore(selectMedicamento(id));
  const actualizar = useMedicamentosStore((s) => s.actualizar);
  const eliminar = useMedicamentosStore((s) => s.eliminar);
  const [trabajando, setTrabajando] = useState(false);

  // Puede pasar un instante después de eliminarlo
  if (!medicamento) return <View style={styles.contenedor} />;

  const alternarCalendario = async () => {
    setTrabajando(true);
    try {
      if (medicamento.eventoCalendarioId) {
        await eliminarEventoToma(medicamento.eventoCalendarioId);
        await actualizar(id, { eventoCalendarioId: null });
      } else {
        const eventoId = await crearEventoToma(medicamento);
        if (eventoId) {
          await actualizar(id, { eventoCalendarioId: eventoId });
          Alert.alert('Listo', `Se agregó un evento diario a las ${medicamento.hora} en tu calendario.`);
        }
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar el calendario.');
    } finally {
      setTrabajando(false);
    }
  };

  const borrar = () => {
    Alert.alert('Eliminar', `¿Eliminar ${medicamento.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await cancelarNotificacion(medicamento.notificacionId);
          await eliminarEventoToma(medicamento.eventoCalendarioId);
          navigation.goBack();
          await eliminar(id);
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor}>
      <Text style={styles.nombre}>{medicamento.nombre}</Text>
      <Text style={styles.subtitulo}>
        Todos los días a las {medicamento.hora}
        {medicamento.dosis ? ` · ${medicamento.dosis}` : ''}
      </Text>

      <SeccionRecursos
        foto={medicamento.foto}
        ubicacion={medicamento.ubicacion}
        contacto={medicamento.contacto}
        onCambio={(cambios) => actualizar(id, cambios)}
      />

      <Text style={styles.label}>📅 Calendario del teléfono</Text>
      <Text style={styles.estado}>
        {medicamento.eventoCalendarioId
          ? `Hay un evento diario a las ${medicamento.hora}.`
          : 'Todavía no está en tu calendario.'}
      </Text>
      <BotonPersonalizado
        titulo={medicamento.eventoCalendarioId ? 'Quitar del calendario' : 'Agregar al calendario'}
        variante="secundario"
        cargando={trabajando}
        onPress={alternarCalendario}
      />

      <View style={styles.separador} />
      <BotonPersonalizado titulo="Eliminar medicamento" variante="peligro" onPress={borrar} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    padding: espacio.grande,
    backgroundColor: colores.fondo,
  },
  nombre: {
    fontSize: 26,
    fontWeight: '700',
    color: colores.texto,
  },
  subtitulo: {
    color: colores.textoSuave,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: espacio.medio,
    marginBottom: 4,
  },
  estado: {
    color: colores.texto,
    marginBottom: 4,
  },
  separador: {
    height: espacio.grande,
  },
});
