import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colores } from '../theme';

/**
 * Botón reutilizable de la app.
 * variante: 'primario' (relleno) | 'secundario' (borde) | 'peligro' (rojo)
 */
export default function BotonPersonalizado({
  titulo,
  onPress,
  variante = 'primario',
  deshabilitado = false,
  cargando = false,
  testID,
}) {
  const inactivo = deshabilitado || cargando;

  return (
    <TouchableOpacity
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: inactivo }}
      onPress={onPress}
      disabled={inactivo}
      activeOpacity={0.7}
      style={[styles.boton, styles[variante], inactivo && styles.inactivo]}
    >
      {cargando ? (
        <ActivityIndicator color={variante === 'secundario' ? colores.primario : '#fff'} />
      ) : (
        <Text style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}>
          {titulo}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  primario: {
    backgroundColor: colores.primario,
  },
  secundario: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colores.primario,
  },
  peligro: {
    backgroundColor: colores.peligro,
  },
  inactivo: {
    opacity: 0.5,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textoSecundario: {
    color: colores.primario,
  },
});
