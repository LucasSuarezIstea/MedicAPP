import { Platform } from 'react-native';

/*
 * Importamos solo las funciones de notificaciones LOCALES de expo-notifications.
 *
 * Si se importa el paquete completo (`import * as Notifications from 'expo-notifications'`),
 * también se carga la parte de notificaciones push (remotas), y en Expo Go para Android
 * eso tira un error porque Expo Go ya no incluye push desde el SDK 53.
 * Importando cada función por separado, las notificaciones locales funcionan
 * tanto en Expo Go como en la APK.
 */
import { scheduleNotificationAsync } from 'expo-notifications/build/scheduleNotificationAsync';
import { cancelScheduledNotificationAsync } from 'expo-notifications/build/cancelScheduledNotificationAsync';
import { setNotificationChannelAsync } from 'expo-notifications/build/setNotificationChannelAsync';
import { setNotificationHandler } from 'expo-notifications/build/NotificationsHandler';
import {
  getPermissionsAsync,
  requestPermissionsAsync,
} from 'expo-notifications/build/NotificationPermissions';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
import { AndroidImportance } from 'expo-notifications/build/NotificationChannelManager.types';

const CANAL = 'medicamentos';

// Cómo se muestra una notificación si llega con la app abierta.
setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/** Pide permiso para notificar y crea el canal en Android. Devuelve true si hay permiso. */
export async function pedirPermisos() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync(CANAL, {
      name: 'Recordatorios de medicación',
      importance: AndroidImportance.HIGH,
    });
  }

  const { status } = await getPermissionsAsync();
  if (status === 'granted') return true;

  const pedido = await requestPermissionsAsync();
  return pedido.status === 'granted';
}

/**
 * Programa el recordatorio diario a la hora del medicamento (HH:MM).
 * Devuelve el id de la notificación para poder cancelarla después.
 */
export async function programarRecordatorioDiario(medicamento) {
  const [hour, minute] = medicamento.hora.split(':').map(Number);
  return scheduleNotificationAsync({
    content: {
      title: '💊 Hora de tu medicación',
      body: `Tomá ${medicamento.nombre}${medicamento.dosis ? ` (${medicamento.dosis})` : ''}`,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CANAL,
    },
  });
}

/**
 * Notificación de prueba a los X segundos (para mostrar en el video
 * que las notificaciones funcionan sin esperar a la hora real).
 */
export async function programarRecordatorioEnSegundos(medicamento, segundos = 10) {
  return scheduleNotificationAsync({
    content: {
      title: '💊 Recordatorio de medicación',
      body: `No te olvides de tomar ${medicamento.nombre} a las ${medicamento.hora}`,
    },
    trigger: {
      type: SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: segundos,
      channelId: CANAL,
    },
  });
}

export async function cancelarNotificacion(id) {
  if (id) await cancelScheduledNotificationAsync(id);
}
