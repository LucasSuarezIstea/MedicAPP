import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colores } from '../theme';

/** Ítem reutilizable de la lista de medicamentos. */
export default function MedicamentoItem({ medicamento, onEliminar }) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.hora}>
        <Text style={styles.horaTexto}>{medicamento.hora}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.nombre}>{medicamento.nombre}</Text>
        {medicamento.dosis ? <Text style={styles.dosis}>{medicamento.dosis}</Text> : null}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Eliminar ${medicamento.nombre}`}
        onPress={() => onEliminar(medicamento.id)}
        style={styles.eliminar}
      >
        <Text style={styles.eliminarTexto}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colores.tarjeta,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  hora: {
    backgroundColor: colores.primarioClaro,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginRight: 12,
  },
  horaTexto: {
    color: colores.primario,
    fontWeight: '700',
    fontSize: 16,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '600',
    color: colores.texto,
  },
  dosis: {
    fontSize: 14,
    color: colores.textoSuave,
    marginTop: 2,
  },
  eliminar: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  eliminarTexto: {
    color: colores.peligro,
    fontWeight: '600',
  },
});
