import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMedicamentosStore, selectMedicamento } from '../src/store/useMedicamentosStore';
import { useAuthStore } from '../src/store/useAuthStore';
import { obtenerMedicamentos } from '../src/storage/storage';

const ibuprofeno = { id: '1', nombre: 'Ibuprofeno', dosis: '400 mg', hora: '20:00' };
const enalapril = { id: '2', nombre: 'Enalapril', dosis: '10 mg', hora: '08:00' };

beforeEach(async () => {
  await AsyncStorage.clear();
  useMedicamentosStore.getState().limpiar();
  await useMedicamentosStore.getState().cargar('lucas');
});

describe('store global de medicamentos (Zustand)', () => {
  test('agregar suma el medicamento ordenado por hora y lo persiste', async () => {
    await useMedicamentosStore.getState().agregar(ibuprofeno);
    await useMedicamentosStore.getState().agregar(enalapril);

    const { medicamentos } = useMedicamentosStore.getState();
    expect(medicamentos.map((m) => m.nombre)).toEqual(['Enalapril', 'Ibuprofeno']);
    expect(await obtenerMedicamentos('lucas')).toHaveLength(2);
  });

  test('actualizar asocia foto, ubicación y contacto a un medicamento', async () => {
    await useMedicamentosStore.getState().agregar(ibuprofeno);

    await useMedicamentosStore.getState().actualizar('1', {
      foto: 'file:///foto.jpg',
      ubicacion: { latitud: -34.6, longitud: -58.4, direccion: 'Av. Corrientes 1234' },
      contacto: { nombre: 'Dra. Pérez', telefono: '1122334455' },
    });

    const med = selectMedicamento('1')(useMedicamentosStore.getState());
    expect(med.foto).toBe('file:///foto.jpg');
    expect(med.ubicacion.direccion).toBe('Av. Corrientes 1234');
    expect(med.contacto.nombre).toBe('Dra. Pérez');
    expect(med.nombre).toBe('Ibuprofeno'); // no pisa los demás campos

    const [guardado] = await obtenerMedicamentos('lucas');
    expect(guardado.contacto.nombre).toBe('Dra. Pérez');
  });

  test('eliminar lo saca del estado y del almacenamiento', async () => {
    await useMedicamentosStore.getState().agregar(ibuprofeno);
    await useMedicamentosStore.getState().agregar(enalapril);

    await useMedicamentosStore.getState().eliminar('1');

    expect(useMedicamentosStore.getState().medicamentos).toEqual([enalapril]);
    expect(await obtenerMedicamentos('lucas')).toEqual([enalapril]);
  });

  test('cargar trae solo los medicamentos del usuario indicado', async () => {
    await useMedicamentosStore.getState().agregar(ibuprofeno);

    await useMedicamentosStore.getState().cargar('ana');
    expect(useMedicamentosStore.getState().medicamentos).toEqual([]);

    await useMedicamentosStore.getState().cargar('lucas');
    expect(useMedicamentosStore.getState().medicamentos).toHaveLength(1);
  });
});

describe('store global de sesión (Zustand)', () => {
  test('iniciarSesion guarda el usuario y salir limpia todo', async () => {
    await useAuthStore.getState().iniciarSesion('lucas');
    expect(useAuthStore.getState().usuario).toBe('lucas');
    expect(await AsyncStorage.getItem('@medicapp/sesion')).toBe('lucas');

    await useMedicamentosStore.getState().agregar(ibuprofeno);
    await useAuthStore.getState().salir();

    expect(useAuthStore.getState().usuario).toBeNull();
    expect(useMedicamentosStore.getState().medicamentos).toEqual([]);
  });
});
