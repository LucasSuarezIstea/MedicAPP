import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import BotonPersonalizado from './BotonPersonalizado';
import { obtenerContactos } from '../recursos/contactos';
import { colores, espacio } from '../theme';

/**
 * Modal que lista los contactos del teléfono para elegir al médico o familiar.
 * Se muestra solo después de que el usuario concedió el permiso de contactos.
 */
export default function SelectorContacto({ visible, onElegir, onCerrar }) {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) return;
    setBusqueda('');
    setCargando(true);
    setError('');
    obtenerContactos()
      .then(setContactos)
      .catch((e) => {
        setContactos([]);
        setError(e?.message || String(e));
      })
      .finally(() => setCargando(false));
  }, [visible]);

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return texto ? contactos.filter((c) => c.nombre.toLowerCase().includes(texto)) : contactos;
  }, [contactos, busqueda]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onCerrar}>
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>Elegí un contacto</Text>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={busqueda}
          onChangeText={setBusqueda}
        />

        {cargando ? (
          <ActivityIndicator size="large" color={colores.primario} style={styles.cargando} />
        ) : (
          <FlatList
            data={filtrados}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.fila} onPress={() => onElegir(item)}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                {item.telefono ? <Text style={styles.telefono}>{item.telefono}</Text> : null}
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.vacio}>
                {error ? `Error: ${error}` : 'No se encontraron contactos.'}
              </Text>
            }
          />
        )}

        <BotonPersonalizado titulo="Cancelar" variante="secundario" onPress={onCerrar} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: espacio.medio,
    paddingTop: espacio.grande * 2,
    backgroundColor: colores.fondo,
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: colores.texto,
    marginBottom: espacio.medio,
  },
  input: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: espacio.medio,
  },
  cargando: {
    flex: 1,
  },
  fila: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.borde,
  },
  nombre: {
    fontSize: 16,
    color: colores.texto,
    fontWeight: '600',
  },
  telefono: {
    color: colores.textoSuave,
    marginTop: 2,
  },
  vacio: {
    textAlign: 'center',
    color: colores.textoSuave,
    marginTop: espacio.grande,
  },
});