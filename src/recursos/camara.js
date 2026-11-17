import * as ImagePicker from 'expo-image-picker';
import { pedirPermiso } from '../permisos/permisos';

const OPCIONES = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.6,
};

/** Abre la cámara y devuelve la URI de la foto, o null si se canceló / no hay permiso. */
export async function tomarFoto() {
  const permiso = await pedirPermiso({
    consultar: ImagePicker.getCameraPermissionsAsync,
    solicitar: ImagePicker.requestCameraPermissionsAsync,
    recurso: 'la cámara',
  });
  if (!permiso) return null;

  const resultado = await ImagePicker.launchCameraAsync(OPCIONES);
  return resultado.canceled ? null : resultado.assets[0].uri;
}

/** Abre la galería y devuelve la URI de la imagen elegida, o null. */
export async function elegirDeGaleria() {
  const permiso = await pedirPermiso({
    consultar: ImagePicker.getMediaLibraryPermissionsAsync,
    solicitar: ImagePicker.requestMediaLibraryPermissionsAsync,
    recurso: 'la galería de fotos',
  });
  if (!permiso) return null;

  const resultado = await ImagePicker.launchImageLibraryAsync(OPCIONES);
  return resultado.canceled ? null : resultado.assets[0].uri;
}
