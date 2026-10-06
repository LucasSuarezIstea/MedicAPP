// Lógica de negocio pura (sin React), fácil de testear con Jest.

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

/**
 * Valida los datos del formulario de registro.
 * Devuelve un string con el error, o null si todo está bien.
 */
export function validarRegistro(usuario, contrasena, confirmacion) {
  const u = (usuario || '').trim();
  if (!u) return 'Ingresá un nombre de usuario';
  if (u.length < 3) return 'El usuario debe tener al menos 3 caracteres';
  if (!contrasena) return 'Ingresá una contraseña';
  if (contrasena.length < 4) return 'La contraseña debe tener al menos 4 caracteres';
  if (contrasena !== confirmacion) return 'Las contraseñas no coinciden';
  return null;
}

/** Valida el formulario de login (solo que no estén vacíos). */
export function validarLogin(usuario, contrasena) {
  if (!(usuario || '').trim() || !contrasena) return 'Completá usuario y contraseña';
  return null;
}

/** true si el texto tiene formato de hora HH:MM válido (00:00 a 23:59). */
export function esHoraValida(texto) {
  return HORA_REGEX.test((texto || '').trim());
}

/**
 * Normaliza lo que escribe el usuario a formato HH:MM.
 * Ej: "8:5" -> "08:05", "8" -> "08:00", "0830" -> "08:30".
 * Devuelve null si no se puede interpretar como hora.
 */
export function formatearHora(texto) {
  const limpio = (texto || '').trim();
  let horas;
  let minutos;

  if (limpio.includes(':')) {
    [horas, minutos] = limpio.split(':');
  } else if (/^\d{3,4}$/.test(limpio)) {
    horas = limpio.slice(0, limpio.length - 2);
    minutos = limpio.slice(-2);
  } else {
    horas = limpio;
    minutos = '0';
  }

  if (!/^\d{1,2}$/.test(horas) || !/^\d{1,2}$/.test(minutos)) return null;
  const resultado = `${horas.padStart(2, '0')}:${minutos.padStart(2, '0')}`;
  return esHoraValida(resultado) ? resultado : null;
}

/** Valida el formulario de alta de medicamento. */
export function validarMedicamento(nombre, hora) {
  if (!(nombre || '').trim()) return 'Ingresá el nombre del medicamento';
  if (!formatearHora(hora)) return 'Ingresá una hora válida (ej: 08:30)';
  return null;
}

/** Ordena los medicamentos por hora de toma (sin modificar el array original). */
export function ordenarPorHora(medicamentos) {
  return [...medicamentos].sort((a, b) => a.hora.localeCompare(b.hora));
}
