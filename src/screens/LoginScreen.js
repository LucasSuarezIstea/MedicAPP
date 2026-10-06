import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import BotonPersonalizado from '../components/BotonPersonalizado';
import { validarLogin } from '../utils/validaciones';
import { validarCredenciales } from '../storage/storage';
import { useAuth } from '../context/AuthContext';
import { colores, espacio } from '../theme';

export default function LoginScreen({ navigation }) {
  const { iniciarSesion } = useAuth();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const ingresar = async () => {
    const errorValidacion = validarLogin(usuario, contrasena);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setCargando(true);
    const ok = await validarCredenciales(usuario, contrasena);
    setCargando(false);

    if (!ok) {
      setError('Usuario o contraseña incorrectos');
      return;
    }
    setError('');
    await iniciarSesion(usuario.trim());
  };

  return (
    <KeyboardAvoidingView
      style={styles.contenedor}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.logo}>💊</Text>
      <Text style={styles.titulo}>MedicApp</Text>
      <Text style={styles.subtitulo}>Tus recordatorios de medicación</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        autoCapitalize="none"
        value={usuario}
        onChangeText={setUsuario}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <BotonPersonalizado titulo="Ingresar" onPress={ingresar} cargando={cargando} />
      <BotonPersonalizado
        titulo="Crear una cuenta"
        variante="secundario"
        onPress={() => navigation.navigate('Registro')}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: espacio.grande,
    backgroundColor: colores.fondo,
  },
  logo: {
    fontSize: 56,
    textAlign: 'center',
  },
  titulo: {
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    color: colores.primario,
  },
  subtitulo: {
    textAlign: 'center',
    color: colores.textoSuave,
    marginBottom: espacio.grande,
  },
  input: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  error: {
    color: colores.peligro,
    marginBottom: 8,
    textAlign: 'center',
  },
});
