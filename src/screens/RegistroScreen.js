import { useState } from 'react';
import { Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import BotonPersonalizado from '../components/BotonPersonalizado';
import { validarRegistro } from '../utils/validaciones';
import { registrarUsuario } from '../storage/storage';
import { colores, espacio } from '../theme';

export default function RegistroScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');

  const registrar = async () => {
    const errorValidacion = validarRegistro(usuario, contrasena, confirmacion);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      await registrarUsuario(usuario, contrasena);
      setError('');
      Alert.alert('Cuenta creada', 'Ya podés iniciar sesión.');
      navigation.goBack();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
      <Text style={styles.titulo}>Crear cuenta</Text>

      <Text style={styles.label}>Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: lucas"
        autoCapitalize="none"
        value={usuario}
        onChangeText={setUsuario}
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 4 caracteres"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
      />

      <Text style={styles.label}>Repetir contraseña</Text>
      <TextInput
        style={styles.input}
        placeholder="Repetí la contraseña"
        secureTextEntry
        value={confirmacion}
        onChangeText={setConfirmacion}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <BotonPersonalizado titulo="Registrarme" onPress={registrar} />
      <BotonPersonalizado
        titulo="Ya tengo cuenta"
        variante="secundario"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: espacio.grande,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontSize: 26,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: espacio.grande,
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
  error: {
    color: colores.peligro,
    marginBottom: 8,
  },
});
