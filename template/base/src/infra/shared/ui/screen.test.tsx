import { TestProviders } from '@test/utils/providers';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { UIScreen } from './screen';

// O react-native-css so processa className dos componentes do react-native: o SafeAreaView do
// safe-area-context ignora a prop, e a tela encolhia para a altura do recuo do topo no aparelho.
describe('UIScreen', () => {
  it('ocupa a altura toda pelo style do SafeAreaView, sem depender de className', async () => {
    await render(
      <TestProviders>
        <UIScreen testID="tela">
          <Text>conteudo</Text>
        </UIScreen>
      </TestProviders>
    );

    const safeArea = screen.getByTestId('tela').parent;
    expect(safeArea?.props.className).toBeUndefined();
    expect(safeArea?.props.style).toMatchObject({ flex: 1 });
  });

  it('passa centered, padded e className para a View interna', async () => {
    await render(
      <TestProviders>
        <UIScreen centered className="gap-2" testID="tela">
          <Text>conteudo</Text>
        </UIScreen>
      </TestProviders>
    );

    const content = screen.getByTestId('tela');
    expect(content.props.className).toContain('flex-1');
    expect(content.props.className).toContain('items-center justify-center');
    expect(content.props.className).toContain('px-4');
    expect(content.props.className).toContain('gap-2');
  });
});
