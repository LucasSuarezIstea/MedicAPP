import { useEffect, useLayoutEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MedicamentoItem from '../components/MedicamentoItem';
import BotonPersonalizado from '../components/BotonPersonalizado';
import { cancelarNotificacion } from '../notifications/notificaciones';
import { eliminarEventoToma } from '../recursos/calendario';
import { useAuthStore } from '../store/useAuthStore';
import { useMedicamentosStore } from '../store/useMedicamentosStore';
import { colores, espacio } from '../theme';

export default function HomeScreen({ navigation }) {
  // Todo el estado sale de los stores globales (Zustand)
  const usuario = useAuthStore((s) => s.usuario);
  const salir = useAuthStore((s) => s.salir);
  const medicamentos = useMedicamentosStore((s) => s.medicamentos);
  const cargando = useMedicamentosStore((s) => s.cargando);
  const cargar = useMedicamentosStore((s) => s.cargar);
  const eliminarDelStore = useMedicamentosStore((s) => s.eliminar);

  // Botón "Salir" en la barra superior
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button title="Salir" color={colores.peligro} onPress={salir} />,
    });
  }, [navigation, salir]);

  // Carga los medicamentos del usuario una vez; después el store se mantiene actualizado solo
  useEffect(() => {
    cargar(usuario);
  }, [usuario, cargar]);

  const eliminar = (id) => {
    const med = medicamentos.find((m) => m.id === id);
    Alert.alert('Eliminar', `¿Eliminar ${med?.nombre}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await cancelarNotificacion(med?.notificacionId);
          await eliminarEventoToma(med?.eventoCalendarioId);
          await eliminarDelStore(id);
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

      {cargando ? (
        <ActivityIndicator size="large" color={colores.primario} style={styles.listaVacia} />
      ) : (
        <FlatList
          data={medicamentos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MedicamentoItem
              medicamento={item}
              onEliminar={eliminar}
              onPress={() => navigation.navigate('Detalle', { id: item.id })}
            />
          )}
          contentContainerStyle={medicamentos.length === 0 && styles.listaVacia}
          ListEmptyComponent={
            <Text style={styles.vacio}>
              Tocá "Agregar medicamento" para crear tu primer recordatorio.
            </Text>
          }
        />
      )}

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
