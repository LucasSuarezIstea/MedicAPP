import { create } from 'zustand';
import { obtenerMedicamentos, guardarMedicamentos } from '../storage/storage';
import { ordenarPorHora } from '../utils/validaciones';

/*
 * Estado global de los medicamentos (Zustand).
 *
 * Reemplaza al useState que antes tenía HomeScreen y a la lectura/escritura
 * directa de AsyncStorage desde cada pantalla. Cualquier pantalla lee la lista
 * con useMedicamentosStore((s) => s.medicamentos) y la modifica con las acciones.
 * Cada acción, además de actualizar el estado, lo persiste en AsyncStorage.
 */
export const useMedicamentosStore = create((set, get) => ({
  usuario: null,
  medicamentos: [],
  cargando: false,

  /** Carga los medicamentos guardados del usuario logueado. */
  cargar: async (usuario) => {
    set({ usuario, cargando: true });
    const lista = await obtenerMedicamentos(usuario);
    set({ medicamentos: ordenarPorHora(lista), cargando: false });
  },

  agregar: async (medicamento) => {
    const nueva = ordenarPorHora([...get().medicamentos, medicamento]);
    set({ medicamentos: nueva });
    await guardarMedicamentos(get().usuario, nueva);
  },

  eliminar: async (id) => {
    const nueva = get().medicamentos.filter((m) => m.id !== id);
    set({ medicamentos: nueva });
    await guardarMedicamentos(get().usuario, nueva);
  },

  /** Actualiza solo los campos recibidos (ej: { foto }, { contacto }). */
  actualizar: async (id, cambios) => {
    const nueva = ordenarPorHora(
      get().medicamentos.map((m) => (m.id === id ? { ...m, ...cambios } : m))
    );
    set({ medicamentos: nueva });
    await guardarMedicamentos(get().usuario, nueva);
  },

  /** Vacía el estado al cerrar sesión. */
  limpiar: () => set({ usuario: null, medicamentos: [], cargando: false }),
}));

/** Selector: un medicamento por id. */
export const selectMedicamento = (id) => (state) =>
  state.medicamentos.find((m) => m.id === id);
