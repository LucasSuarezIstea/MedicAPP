import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registrarUsuario,
  validarCredenciales,
  guardarMedicamentos,
  obtenerMedicamentos,
} from '../src/storage/storage';

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe('storage (autenticación y datos)', () => {
  test('registra un usuario y valida sus credenciales', async () => {
    await registrarUsuario('lucas', '1234');

    expect(await validarCredenciales('lucas', '1234')).toBe(true);
    expect(await validarCredenciales('lucas', 'mala')).toBe(false);
    expect(await validarCredenciales('otro', '1234')).toBe(false);
  });

  test('no permite registrar dos veces el mismo usuario', async () => {
    await registrarUsuario('lucas', '1234');
    await expect(registrarUsuario('Lucas', '9999')).rejects.toThrow('Ese usuario ya está registrado');
  });

  test('guarda los medicamentos por separado para cada usuario', async () => {
    await guardarMedicamentos('lucas', [{ id: '1', nombre: 'Ibuprofeno', hora: '08:00' }]);

    expect(await obtenerMedicamentos('lucas')).toHaveLength(1);
    expect(await obtenerMedicamentos('ana')).toEqual([]);
  });
});
