// Mock oficial de AsyncStorage para que los tests no dependan del dispositivo.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
