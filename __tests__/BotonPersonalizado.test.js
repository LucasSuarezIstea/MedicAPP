import { render, screen, fireEvent } from '@testing-library/react-native';
import BotonPersonalizado from '../src/components/BotonPersonalizado';

describe('BotonPersonalizado', () => {
  test('muestra el título recibido', async () => {
    await render(<BotonPersonalizado titulo="Guardar" onPress={() => {}} />);
    expect(screen.getByText('Guardar')).toBeOnTheScreen();
  });

  test('llama a onPress al tocarlo', async () => {
    const onPress = jest.fn();
    await render(<BotonPersonalizado titulo="Guardar" onPress={onPress} />);

    await fireEvent.press(screen.getByText('Guardar'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('no llama a onPress si está deshabilitado', async () => {
    const onPress = jest.fn();
    await render(<BotonPersonalizado titulo="Guardar" onPress={onPress} deshabilitado />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
