import { useCallback, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MedicamentoItem from '../components/MedicamentoItem';
import BotonPersonalizado from '../components/BotonPersonalizado';
import { obtenerMedicamentos, guardarMedicamentos } from '../storage/storage';
import { cancelarNotificacion } from '../notifications/notificaciones';
import { ordenarPorHora } from '../utils/validaciones';
import { useAuth } from '../context/AuthContext';
import { colores, espacio } from '../theme';

export default function HomeScreen({ navigation }) {
  const { usuario, salir } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);

  // Botón "Salir" en la barra superior
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Salir" color={colores.peligro} onPress={salir} />,
    });
  }, [navigation, salir]);

  // Recarga la lista cada vez que la pantalla vuelve a estar visible
  useFocusEffect(
    useCallback(() => {
      obtenerMedicamentos(usuario).then((lista) => setMedicamentos(ordenarPorHora(lista)));
    }, [usuario])
  );

  const eliminar = (id) => {
    const med = medicamentos.find((m) => m.id === id);
    Alert.alert('Eliminar', `¿Eliminar ${med?.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await cancelarNotificacion(med?.notificacionId);
          const nueva = medicamentos.filter((m) => m.id !== id);
          setMedicamentos(nueva);
          await guardarMedicamentos(usuario, nueva);
        },
      },
    ]);
  };

  return (
    <View style={styles.contenedor}>
      <Text style={styles.saludo}>Hola, {usuario} 👋</Text>
      <Text style={styles.subtitulo}>
        {medicamentos.length === 0
          ? 'Todavía no cargaste medicamentos'
          : `Tenés ${medicamentos.length} medicamento${medicamentos.length > 1 ? 's' : ''} con recordatorio`}
      </Text>

      <FlatList
        data={medicamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MedicamentoItem medicamento={item} onEliminar={eliminar} />}
        contentContainerStyle={medicamentos.length === 0 && styles.listaVacia}
        ListEmptyComponent={
          <Text style={styles.vacio}>
            Tocá "Agregar medicamento" para crear tu primer recordatorio.
          </Text>
        }
      />

      <BotonPersonalizado
        titulo="+ Agregar medicamento"
        onPress={() => navigation.navigate('AgregarMedicamento')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: espacio.medio,
    backgroundColor: colores.fondo,
  },
  saludo: {
    fontSize: 24,
    fontWeight: '700',
    color: colores.texto,
  },
  subtitulo: {
    color: colores.textoSuave,
    marginBottom: espacio.medio,
  },
  listaVacia: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  vacio: {
    textAlign: 'center',
    color: colores.textoSuave,
    fontSize: 16,
    paddingHorizontal: espacio.grande,
  },
});
