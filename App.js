import { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import HomeScreen from './src/screens/HomeScreen';
import AgregarMedicamentoScreen from './src/screens/AgregarMedicamentoScreen';
import DetalleMedicamentoScreen from './src/screens/DetalleMedicamentoScreen';
import { useAuthStore } from './src/store/useAuthStore';
import { colores } from './src/theme';

const Stack = createNativeStackNavigator();

export default function App() {
  // Estado global (Zustand): ya no hace falta useState ni Context para la sesión
  const usuario = useAuthStore((s) => s.usuario);
  const restaurando = useAuthStore((s) => s.restaurando);
  const restaurarSesion = useAuthStore((s) => s.restaurarSesion);

  // Al abrir la app, recupera la sesión guardada (si la hay)
  useEffect(() => {
    restaurarSesion();
  }, [restaurarSesion]);

  if (restaurando) {
    return (
      <View style={styles.cargando}>
        <ActivityIndicator size="large" color={colores.primario} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
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
                name="Detalle"
                component={DetalleMedicamentoScreen}
                options={{ title: 'Detalle' }}
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
