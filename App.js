import { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import HomeScreen from './src/screens/HomeScreen';
import AgregarMedicamentoScreen from './src/screens/AgregarMedicamentoScreen';
import { AuthContext } from './src/context/AuthContext';
import { obtenerSesion, guardarSesion, cerrarSesion } from './src/storage/storage';
import { colores } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al abrir la app, recupera la sesión guardada (si la hay)
  useEffect(() => {
    obtenerSesion()
      .then(setUsuario)
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = useCallback(async (nombre) => {
    await guardarSesion(nombre);
    setUsuario(nombre);
  }, []);

  const salir = useCallback(async () => {
    await cerrarSesion();
    setUsuario(null);
  }, []);

  const auth = useMemo(() => ({ usuario, iniciarSesion, salir }), [usuario, iniciarSesion, salir]);

  if (cargando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthContext.Provider value={auth}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colores.primario },
              headerTintColor: '#fff',
              headerTitleStyle: { fontWeight: '700' },
            }}
          >
            {usuario ? (
              // Pantallas protegidas: solo existen si hay sesión iniciada
              <>
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{ title: 'Mis medicamentos' }}
                />
                <Stack.Screen
                  name="AgregarMedicamento"
                  component={AgregarMedicamentoScreen}
                  options={{ title: 'Nuevo medicamento' }}
                />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen
                  name="Registro"
                  component={RegistroScreen}
                  options={{ title: 'Registro' }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  cargando: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colores.fondo,
  },
});
