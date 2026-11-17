import * as Location from 'expo-location';
import { pedirPermiso } from '../permisos/permisos';
import { formatearDireccion } from '../utils/validaciones';

/**
 * Obtiene la ubicación actual (pensada para guardar la farmacia donde se compra el medicamento).
 * Devuelve { latitud, longitud, direccion } o null si no hay permiso.
 */
export async function obtenerUbicacionActual() {
  const permiso = await pedirPermiso({
    consultar: Location.getForegroundPermissionsAsync,
    solicitar: Location.requestForegroundPermissionsAsync,
    recurso: 'tu ubicación',
  });
  if (!permiso) return null;

  const posicion = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  const { latitude, longitude } = posicion.coords;

  // La dirección aproximada es un extra: si falla, igual guardamos las coordenadas
  let direccion = '';
  try {
    const [lugar] = await Location.reverseGeocodeAsync({ latitude, longitude });
    direccion = formatearDireccion(lugar);
  } catch (e) {
    direccion = '';
  }

  return { latitud: latitude, longitud: longitude, direccion };
}
