import AsyncStorage from '@react-native-async-storage/async-storage';

// Claves usadas en AsyncStorage
const CLAVE_USUARIOS = '@medicapp/usuarios';
const CLAVE_SESION = '@medicapp/sesion';
const claveMedicamentos = (usuario) => `@medicapp/medicamentos/${usuario}`;

// ---------- Usuarios ----------

export async function obtenerUsuarios() {
  const json = await AsyncStorage.getItem(CLAVE_USUARIOS);
  return json ? JSON.parse(json) : [];
}

/** Registra un usuario nuevo. Lanza un Error si ya existe. */
export async function registrarUsuario(usuario, contrasena) {
  const usuarios = await obtenerUsuarios();
  const nombre = usuario.trim();
  const existe = usuarios.some((u) => u.usuario.toLowerCase() === nombre.toLowerCase());
  if (existe) throw new Error('Ese usuario ya está registrado');

  usuarios.push({ usuario: nombre, contrasena });
  await AsyncStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
}

/** Devuelve true si usuario y contraseña coinciden con uno guardado. */
export async function validarCredenciales(usuario, contrasena) {
  const usuarios = await obtenerUsuarios();
  return usuarios.some(
    (u) => u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.contrasena === contrasena
  );
}

// ---------- Sesión ----------

export async function guardarSesion(usuario) {
  await AsyncStorage.setItem(CLAVE_SESION, usuario);
}

export async function obtenerSesion() {
  return AsyncStorage.getItem(CLAVE_SESION);
}

export async function cerrarSesion() {
  await AsyncStorage.removeItem(CLAVE_SESION);
}

// ---------- Medicamentos (uno por usuario) ----------

export async function obtenerMedicamentos(usuario) {
  const json = await AsyncStorage.getItem(claveMedicamentos(usuario));
  return json ? JSON.parse(json) : [];
}

export async function guardarMedicamentos(usuario, medicamentos) {
  await AsyncStorage.setItem(claveMedicamentos(usuario), JSON.stringify(medicamentos));
}
