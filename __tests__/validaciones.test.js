import {
  validarRegistro,
  validarLogin,
  esHoraValida,
  formatearHora,
  validarMedicamento,
  ordenarPorHora,
} from '../src/utils/validaciones';

describe('validarRegistro', () => {
  test('acepta datos correctos', () => {
    expect(validarRegistro('lucas', '1234', '1234')).toBeNull();
  });

  test('rechaza usuario vacío o muy corto', () => {
    expect(validarRegistro('', '1234', '1234')).toBe('Ingresá un nombre de usuario');
    expect(validarRegistro('ab', '1234', '1234')).toBe(
      'El usuario debe tener al menos 3 caracteres'
    );
  });

  test('rechaza contraseñas cortas o que no coinciden', () => {
    expect(validarRegistro('lucas', '12', '12')).toBe(
      'La contraseña debe tener al menos 4 caracteres'
    );
    expect(validarRegistro('lucas', '1234', '4321')).toBe('Las contraseñas no coinciden');
  });
});

describe('validarLogin', () => {
  test('pide completar ambos campos', () => {
    expect(validarLogin('', '')).toBe('Completá usuario y contraseña');
    expect(validarLogin('lucas', '1234')).toBeNull();
  });
});

describe('horas', () => {
  test('esHoraValida reconoce el formato HH:MM', () => {
    expect(esHoraValida('08:30')).toBe(true);
    expect(esHoraValida('23:59')).toBe(true);
    expect(esHoraValida('24:00')).toBe(false);
    expect(esHoraValida('8:30')).toBe(false);
    expect(esHoraValida('hola')).toBe(false);
  });

  test('formatearHora normaliza lo que escribe el usuario', () => {
    expect(formatearHora('8:5')).toBe('08:05');
    expect(formatearHora('8')).toBe('08:00');
    expect(formatearHora('0830')).toBe('08:30');
    expect(formatearHora('25:00')).toBeNull();
    expect(formatearHora('abc')).toBeNull();
  });
});

describe('validarMedicamento', () => {
  test('exige nombre y hora válida', () => {
    expect(validarMedicamento('', '08:00')).toBe('Ingresá el nombre del medicamento');
    expect(validarMedicamento('Ibuprofeno', '99:99')).toBe('Ingresá una hora válida (ej: 08:30)');
    expect(validarMedicamento('Ibuprofeno', '8:00')).toBeNull();
  });
});

describe('ordenarPorHora', () => {
  test('ordena de más temprano a más tarde sin modificar el original', () => {
    const lista = [
      { id: '1', hora: '20:00' },
      { id: '2', hora: '08:00' },
      { id: '3', hora: '13:30' },
    ];
    expect(ordenarPorHora(lista).map((m) => m.id)).toEqual(['2', '3', '1']);
    expect(lista[0].id).toBe('1');
  });
});
