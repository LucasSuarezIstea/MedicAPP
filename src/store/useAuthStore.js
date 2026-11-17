import { create } from 'zustand';
import { obtenerSesion, guardarSesion, cerrarSesion } from '../storage/storage';
import { useMedicamentosStore } from './useMedicamentosStore';

/*
 * Estado global del usuario autenticado (Zustand).
 * Reemplaza al AuthContext + useState que había en App.js en el Parcial 1.
 */
export const useAuthStore = create((set) => ({
  usuario: null,
  restaurando: true,

  /** Al abrir la app, recupera la sesión guardada (si la hay). */
  restaurarSesion: async () => {
    try {
      const usuario = await obtenerSesion();
      set({ usuario });
    } finally {
      set({ restaurando: false });
    }
  },

  iniciarSesion: async (nombre) => {
    await guardarSesion(nombre);
    set({ usuario: nombre });
  },

  salir: async () => {
    await cerrarSesion();
    useMedicamentosStore.getState().limpiar();
    set({ usuario: null });
  },
}));
