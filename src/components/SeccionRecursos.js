import { useState } from 'react';
import { View, Text, Image, StyleSheet, Alert, Linking, Platform } from 'react-native';
import BotonPersonalizado from './BotonPersonalizado';
import SelectorContacto from './SelectorContacto';
import { tomarFoto, elegirDeGaleria } from '../recursos/camara';
import { obtenerUbicacionActual } from '../recursos/ubicacion';
import { pedirPermisoContactos } from '../recursos/contactos';
import { textoUbicacion } from '../utils/validaciones';
import { colores, espacio } from '../theme';

/** Abre la ubicación en la app de mapas del teléfono. */
export function abrirEnMapa(ubicacion) {
  const { latitud, longitud } = ubicacion;
  const url =
    Platform.OS === 'ios'
      ? `http://maps.apple.com/?ll=${latitud},${longitud}&q=Farmacia`
      : `geo:${latitud},${longitud}?q=${latitud},${longitud}(Farmacia)`;
  Linking.openURL(url).catch(() =>
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitud},${longitud}`)
  );
}

/**
 * Sección reutilizable con los recursos del dispositivo asociados a un medicamento:
 * foto (cámara/galería), ubicación de la farmacia y contacto (médico/familiar).
 * Recibe los valores actuales y avisa los cambios con onCambio({ campo: valor }).
 */
export default function SeccionRecursos({ foto, ubicacion, contacto, onCambio }) {
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);

  const ejecutar = async (accion) => {
    try {
      await accion();
    } catch (e) {
      Alert.alert('Error', 'No se pudo completar la acción. Probá de nuevo.');
    }
  };

  const conFoto = (obtener) =>
    ejecutar(async () => {
      const uri = await obtener();
      if (uri) onCambio({ foto: uri });
    });

  const usarUbicacion = () =>
    ejecutar(async () => {
      setBuscandoUbicacion(true);
      try {
        const nueva = await obtenerUbicacionActual();
        if (nueva) onCambio({ ubicacion: nueva });
      } finally {
        setBuscandoUbicacion(false);
      }
    });

  const elegirContacto = () =>
    ejecutar(async () => {
      const permiso = await pedirPermisoContactos();
      if (permiso) setSelectorVisible(true);
    });

  return (
    <View>
      {/* ---------- Foto ---------- */}
      <Text style={styles.label}>📷 Foto del medicamento</Text>
      {foto ? (
        <Image source={{ uri: foto }} style={styles.foto} testID="foto-medicamento" />
      ) : (
        <Text style={styles.vacio}>Sin foto</Text>
      )}
      <View style={styles.fila}>
        <View style={styles.mitad}>
          <BotonPersonalizado
            titulo="Tomar foto"
            variante="secundario"
            onPress={() => conFoto(tomarFoto)}
          />
        </View>
        <View style={styles.mitad}>
          <BotonPersonalizado
            titulo="Galería"
            variante="secundario"
            onPress={() => conFoto(elegirDeGaleria)}
          />
        </View>
      </View>
      {foto ? (
        <Text style={styles.quitar} onPress={() => onCambio({ foto: null })}>
          Quitar foto
        </Text>
      ) : null}

      {/* ---------- Ubicación ---------- */}
      <Text style={styles.label}>📍 Farmacia donde lo comprás</Text>
      {ubicacion ? (
        <View style={styles.dato}>
          <Text style={styles.datoTexto}>{textoUbicacion(ubicacion)}</Text>
          <Text style={styles.coordenadas}>
            {ubicacion.latitud.toFixed(5)}, {ubicacion.longitud.toFixed(5)}
          </Text>
          <Text style={styles.link} onPress={() => abrirEnMapa(ubicacion)}>
            Ver en el mapa
          </Text>
        </View>
      ) : (
        <Text style={styles.vacio}>Sin ubicación</Text>
      )}
      <BotonPersonalizado
        titulo={ubicacion ? 'Actualizar con mi ubicación' : 'Usar mi ubicación actual'}
        variante="secundario"
        cargando={buscandoUbicacion}
        onPress={usarUbicacion}
      />

      {/* ---------- Contacto ---------- */}
      <Text style={styles.label}>👤 Contacto (médico / familiar)</Text>
      {contacto ? (
        <View style={styles.dato}>
          <Text style={styles.datoTexto}>{contacto.nombre}</Text>
          {contacto.telefono ? (
            <Text style={styles.link} onPress={() => Linking.openURL(`tel:${contacto.telefono}`)}>
              Llamar al {contacto.telefono}
            </Text>
          ) : null}
        </View>
      ) : (
        <Text style={styles.vacio}>Sin contacto</Text>
      )}
      <BotonPersonalizado
        titulo={contacto ? 'Cambiar contacto' : 'Elegir de mis contactos'}
        variante="secundario"
        onPress={elegirContacto}
      />

      <SelectorContacto
        visible={selectorVisible}
        onCerrar={() => setSelectorVisible(false)}
        onElegir={(elegido) => {
          setSelectorVisible(false);
          onCambio({ contacto: { nombre: elegido.nombre, telefono: elegido.telefono } });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colores.textoSuave,
    marginTop: espacio.medio,
    marginBottom: 4,
  },
  foto: {
    width: 140,
    height: 140,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 6,
    backgroundColor: colores.borde,
  },
  fila: {
    flexDirection: 'row',
    gap: 10,
  },
  mitad: {
    flex: 1,
  },
  vacio: {
    color: colores.textoSuave,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  quitar: {
    color: colores.peligro,
    textAlign: 'center',
    marginBottom: 4,
  },
  dato: {
    backgroundColor: colores.tarjeta,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: 10,
    padding: 12,
    marginBottom: 4,
  },
  datoTexto: {
    fontSize: 16,
    color: colores.texto,
  },
  coordenadas: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: 2,
  },
  link: {
    color: colores.primario,
    fontWeight: '600',
    marginTop: 6,
  },
});
