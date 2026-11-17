import { Alert, Linking } from 'react-native';

/*
 * Manejo genérico de permisos.
 *
 * Todos los módulos de Expo (cámara, galería, ubicación, contactos, calendario)
 * devuelven la misma forma de respuesta: { status, granted, canAskAgain }.
 * status puede ser 'granted', 'denied' o 'undetermined'.
 */

export const ESTADOS = {
  CONCEDIDO: 'concedido',
  DENEGADO: 'denegado',
  PENDIENTE: 'pendiente',
};

/** Traduce la respuesta de Expo a uno de nuestros 3 estados. */
export function estadoPermiso(respuesta) {
  if (!respuesta) return ESTADOS.PENDIENTE;
  if (respuesta.granted || respuesta.status === 'granted') return ESTADOS.CONCEDIDO;
  if (respuesta.status === 'denied') return ESTADOS.DENEGADO;
  return ESTADOS.PENDIENTE;
}

/** Mensaje claro para el usuario cuando el permiso fue rechazado. */
export function mensajePermisoDenegado(recurso, puedePreguntarDeNuevo = true) {
  return puedePreguntarDeNuevo
    ? `No diste permiso para acceder a ${recurso}. Podés volver a intentarlo cuando quieras.`
    : `El permiso para acceder a ${recurso} está bloqueado. Activalo desde la configuración del teléfono.`;
}

/**
 * Pide un permiso siguiendo los 3 estados:
 *  - concedido  -> devuelve true sin volver a preguntar
 *  - pendiente  -> muestra el diálogo del sistema
 *  - denegado   -> avisa al usuario (y ofrece abrir la configuración si ya no se puede preguntar)
 *
 * consultar: función que devuelve el estado actual (ej: getCameraPermissionsAsync)
 * solicitar: función que muestra el diálogo (ej: requestCameraPermissionsAsync)
 * recurso:   texto para los mensajes (ej: "la cámara")
 */
export async function pedirPermiso({ consultar, solicitar, recurso, avisar = true }) {
  const actual = await consultar();
  if (estadoPermiso(actual) === ESTADOS.CONCEDIDO) return true;

  // Si ya fue denegado y el sistema no deja volver a preguntar, no tiene sentido pedirlo
  let respuesta = actual;
  if (actual?.canAskAgain !== false) {
    respuesta = await solicitar();
  }

  if (estadoPermiso(respuesta) === ESTADOS.CONCEDIDO) return true;

  if (avisar) {
    const puedePreguntar = respuesta?.canAskAgain !== false;
    const botones = puedePreguntar
      ? [{ text: 'Entendido' }]
      : [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Abrir configuración', onPress: () => Linking.openSettings() },
        ];
    Alert.alert('Permiso denegado', mensajePermisoDenegado(recurso, puedePreguntar), botones);
  }
  return false;
}
