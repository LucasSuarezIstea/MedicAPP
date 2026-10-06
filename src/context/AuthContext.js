import { createContext, useContext } from 'react';

// Comparte el usuario logueado y las funciones de login/logout entre pantallas.
export const AuthContext = createContext({
  usuario: null,
  iniciarSesion: async () => {},
  salir: async () => {},
});

export const useAuth = () => useContext(AuthContext);
