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
