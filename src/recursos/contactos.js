import { Contact, ContactField } from 'expo-contacts';
import * as ContactsLegacy from 'expo-contacts/legacy';
import { pedirPermiso } from '../permisos/permisos';

/** Pide permiso para leer los contactos. Devuelve true si se concedió. */
export function pedirPermisoContactos() {
  return pedirPermiso({
    consultar: ContactsLegacy.getPermissionsAsync,
    solicitar: ContactsLegacy.requestPermissionsAsync,
    recurso: 'tus contactos',
  });
}

/** Deja los contactos con la forma { id, nombre, telefono }, sin vacíos y ordenados. */
function simplificar(lista) {
  return (lista || [])
    .map((c, i) => ({
      id: String(c.id ?? i),
      nombre: c.fullName || c.name || [c.givenName || c.firstName, c.familyName || c.lastName].filter(Boolean).join(' '),
      telefono: c.phones?.[0]?.number ?? c.phoneNumbers?.[0]?.number ?? '',
    }))
    .filter((c) => c.nombre)
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/**
 * Lee los contactos de la agenda del teléfono: [{ id, nombre, telefono }]
 * Usa la API nueva de expo-contacts y, si falla, la API legacy.
 */
export async function obtenerContactos() {
  try {
    const detalles = await Contact.getAllDetails([
      ContactField?.FULL_NAME ?? 'fullName',
      ContactField?.PHONES ?? 'phones',
    ]);
    const contactos = simplificar(detalles);
    if (contactos.length > 0) return contactos;
  } catch (e) {
    // Si la API nueva no está disponible, seguimos con la legacy
  }

  const { data } = await ContactsLegacy.getContactsAsync({
    fields: [ContactsLegacy.Fields?.PhoneNumbers ?? 'phoneNumbers'],
  });
  return simplificar(data);
}