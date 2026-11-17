import { Platform } from 'react-native';
import * as Calendar from 'expo-calendar/legacy';
import { pedirPermiso } from '../permisos/permisos';
import { proximaFecha } from '../utils/validaciones';

const NOMBRE_CALENDARIO = 'MedicApp';
const DURACION_MINUTOS = 15;

/** Pide permiso para usar el calendario. Devuelve true si se concedió. */
export function pedirPermisoCalendario() {
  return pedirPermiso({
    consultar: Calendar.getCalendarPermissionsAsync,
    solicitar: Calendar.requestCalendarPermissionsAsync,
    recurso: 'tu calendario',
  });
}

/**
 * Busca un calendario donde se puedan crear eventos.
 * - iOS: el calendario por defecto del teléfono.
 * - Android: el calendario principal (cuenta de Google) o, si no hay, uno local "MedicApp".
 */
async function obtenerCalendarioId() {
  if (Platform.OS === 'ios') {
    const porDefecto = await Calendar.getDefaultCalendarAsync();
    return porDefecto.id;
  }

  const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const editables = calendarios.filter((c) => c.allowsModifications);
  const elegido =
    editables.find((c) => c.isPrimary) ||
    editables.find((c) => c.title === NOMBRE_CALENDARIO) ||
    null;
  if (elegido) return elegido.id;

  return Calendar.createCalendarAsync({
    title: NOMBRE_CALENDARIO,
    color: '#2E7D6B',
    entityType: Calendar.EntityTypes.EVENT,
    source: { isLocalAccount: true, name: NOMBRE_CALENDARIO },
    name: NOMBRE_CALENDARIO,
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
}

/**
 * Crea un evento diario en el calendario del teléfono para la toma del medicamento.
 * Devuelve el id del evento (para poder borrarlo después) o null si no hay permiso.
 */
export async function crearEventoToma(medicamento) {
  const permiso = await pedirPermisoCalendario();
  if (!permiso) return null;

  const calendarioId = await obtenerCalendarioId();
  const inicio = proximaFecha(medicamento.hora);
  const fin = new Date(inicio.getTime() + DURACION_MINUTOS * 60 * 1000);

  return Calendar.createEventAsync(calendarioId, {
    title: `💊 Tomar ${medicamento.nombre}`,
    notes: medicamento.dosis ? `Dosis: ${medicamento.dosis}` : 'Recordatorio de MedicApp',
    startDate: inicio,
    endDate: fin,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    alarms: [{ relativeOffset: 0 }],
    recurrenceRule: { frequency: Calendar.Frequency.DAILY },
  });
}

/** Borra el evento del calendario (si existe). Nunca tira error. */
export async function eliminarEventoToma(eventoId) {
  if (!eventoId) return;
  try {
    await Calendar.deleteEventAsync(eventoId);
  } catch (e) {
    // El usuario pudo haberlo borrado a mano desde el calendario
  }
}
