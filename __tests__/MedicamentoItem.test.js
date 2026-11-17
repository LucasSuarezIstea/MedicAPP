import { render, screen, fireEvent } from '@testing-library/react-native';
import MedicamentoItem from '../src/components/MedicamentoItem';

const medicamento = { id: 'abc', nombre: 'Ibuprofeno', dosis: '400 mg', hora: '08:30' };

describe('MedicamentoItem', () => {
  test('muestra nombre, dosis y hora del medicamento', async () => {
    await render(<MedicamentoItem medicamento={medicamento} onEliminar={() => {}} />);

    expect(screen.getByText('Ibuprofeno')).toBeOnTheScreen();
    expect(screen.getByText('400 mg')).toBeOnTheScreen();
    expect(screen.getByText('08:30')).toBeOnTheScreen();
  });

  test('al tocar "Eliminar" avisa con el id del medicamento', async () => {
    const onEliminar = jest.fn();
    await render(<MedicamentoItem medicamento={medicamento} onEliminar={onEliminar} />);

    await fireEvent.press(screen.getByLabelText('Eliminar Ibuprofeno'));

    expect(onEliminar).toHaveBeenCalledWith('abc');
  });
});

describe('MedicamentoItem con recursos del dispositivo', () => {
  const completo = {
    ...medicamento,
    foto: 'file:///foto.jpg',
    ubicacion: { latitud: -34.6, longitud: -58.4, direccion: 'Farmacia Centro' },
    contacto: { nombre: 'Dra. Pérez', telefono: '1122334455' },
    eventoCalendarioId: 'evento-1',
  };

  test('muestra la foto, la farmacia, el contacto y el calendario', async () => {
    await render(<MedicamentoItem medicamento={completo} onEliminar={() => {}} />);

    expect(screen.getByTestId('miniatura')).toBeOnTheScreen();
    expect(screen.getByText(/Farmacia Centro/)).toBeOnTheScreen();
    expect(screen.getByText(/Dra. Pérez/)).toBeOnTheScreen();
    expect(screen.getByText(/En el calendario/)).toBeOnTheScreen();
  });

  test('sin recursos asociados no muestra la foto', async () => {
    await render(<MedicamentoItem medicamento={medicamento} onEliminar={() => {}} />);
    expect(screen.queryByTestId('miniatura')).toBeNull();
  });

  test('al tocar la tarjeta abre el detalle', async () => {
    const onPress = jest.fn();
    await render(<MedicamentoItem medicamento={completo} onEliminar={() => {}} onPress={onPress} />);

    await fireEvent.press(screen.getByText('Ibuprofeno'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
