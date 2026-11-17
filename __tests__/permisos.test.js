import { Alert } from 'react-native';
import {
  estadoPermiso,
  pedirPermiso,
  mensajePermisoDenegado,
  ESTADOS,
} from '../src/permisos/permisos';

const concedido = { status: 'granted', granted: true, canAskAgain: true };
const pendiente = { status: 'undetermined', granted: false, canAskAgain: true };
const denegado = { status: 'denied', granted: false, canAskAgain: true };
const bloqueado = { status: 'denied', granted: false, canAskAgain: false };

beforeEach(() => {
  jest.spyOn(Alert, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('estadoPermiso', () => {
  test('traduce las respuestas de Expo a concedido / denegado / pendiente', () => {
    expect(estadoPermiso(concedido)).toBe(ESTADOS.CONCEDIDO);
    expect(estadoPermiso(denegado)).toBe(ESTADOS.DENEGADO);
    expect(estadoPermiso(pendiente)).toBe(ESTADOS.PENDIENTE);
    expect(estadoPermiso(null)).toBe(ESTADOS.PENDIENTE);
  });
});

describe('pedirPermiso', () => {
  test('si ya está concedido no vuelve a preguntar', async () => {
    const solicitar = jest.fn();
    const ok = await pedirPermiso({
      consultar: async () => concedido,
      solicitar,
      recurso: 'la cámara',
    });

    expect(ok).toBe(true);
    expect(solicitar).not.toHaveBeenCalled();
    expect(Alert.alert).not.toHaveBeenCalled();
  });

  test('si está pendiente pide el permiso y devuelve true si lo acepta', async () => {
    const solicitar = jest.fn(async () => concedido);
    const ok = await pedirPermiso({
      consultar: async () => pendiente,
      solicitar,
      recurso: 'la cámara',
    });

    expect(solicitar).toHaveBeenCalledTimes(1);
    expect(ok).toBe(true);
  });

  test('si lo rechaza devuelve false y muestra un mensaje claro', async () => {
    const ok = await pedirPermiso({
      consultar: async () => pendiente,
      solicitar: async () => denegado,
      recurso: 'tu ubicación',
    });

    expect(ok).toBe(false);
    expect(Alert.alert).toHaveBeenCalledWith(
      'Permiso denegado',
      mensajePermisoDenegado('tu ubicación', true),
      expect.any(Array)
    );
  });

  test('si está bloqueado no vuelve a preguntar y ofrece abrir la configuración', async () => {
    const solicitar = jest.fn();
    const ok = await pedirPermiso({
      consultar: async () => bloqueado,
      solicitar,
      recurso: 'tus contactos',
    });

    expect(ok).toBe(false);
    expect(solicitar).not.toHaveBeenCalled();
    const botones = Alert.alert.mock.calls[0][2];
    expect(botones.map((b) => b.text)).toContain('Abrir configuración');
  });
});
