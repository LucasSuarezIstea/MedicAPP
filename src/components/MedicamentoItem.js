import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colores } from '../theme';
import { textoUbicacion } from '../utils/validaciones';

/**
 * Ítem reutilizable de la lista de medicamentos.
 * Muestra la foto asociada (si tiene) y un resumen de ubicación, contacto y calendario.
 */
export default function MedicamentoItem({ medicamento, onEliminar, onPress }) {
  return (
    <TouchableOpacity
      style={styles.tarjeta}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={`Ver ${medicamento.nombre}`}
    >
      {medicamento.foto ? (
        <Image source={{ uri: medicamento.foto }} style={styles.foto} testID="miniatura" />
      ) : null}

      <View style={styles.info}>
        <View style={styles.encabezado}>
          <View style={styles.hora}>
            <Text style={styles.horaTexto}>{medicamento.hora}</Text>
          </View>
          <Text style={styles.nombre} numberOfLines={1}>
            {medicamento.nombre}
          </Text>
        </View>
        {medicamento.dosis ? <Text style={styles.dosis}>{medicamento.dosis}</Text> : null}
        {medicamento.ubicacion ? (
          <Text style={styles.extra} numberOfLines={1}>
            📍 {textoUbicacion(medicamento.ubicacion)}
          </Text>
        ) : null}
        {medicamento.contacto ? (
          <Text style={styles.extra} numberOfLines={1}>
            👤 {medicamento.contacto.nombre}
          </Text>
        ) : null}
        {medicamento.eventoCalendarioId ? <Text style={styles.extra}>📅 En el calendario</Text> : null}
      </View>

      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={`Eliminar ${medicamento.nombre}`}
        onPress={() => onEliminar(medicamento.id)}
        style={styles.eliminar}
      >
        <Text style={styles.eliminarTexto}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
  foto: {
    width: 56,
    height: 56,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: colores.borde,
  },
  encabezado: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hora: {
    backgroundColor: colores.primarioClaro,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  horaTexto: {
    color: colores.primario,
    fontWeight: '700',
    fontSize: 15,
  },
  extra: {
    fontSize: 13,
    color: colores.textoSuave,
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  nombre: {
    flex: 1,
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
