import { TestProviders } from '@test/utils/providers';
import { render, screen } from '@testing-library/react-native';
import { createRef } from 'react';
import { Text } from 'react-native';
import { UIInput, type UIInputHandle } from './input';

const noop = () => undefined;

describe('UIInput', () => {
  it('repassa a ref para o TextInput, para a tela focar o campo', async () => {
    const ref = createRef<UIInputHandle>();

    await render(
      <TestProviders>
        <UIInput ref={ref} label="Nome" value="" onChangeText={noop} />
      </TestProviders>
    );

    expect(typeof ref.current?.focus).toBe('function');
  });

  it('aceita ref por funcao', async () => {
    const ref = jest.fn();

    await render(
      <TestProviders>
        <UIInput ref={ref} label="Nome" value="" onChangeText={noop} />
      </TestProviders>
    );

    expect(ref).toHaveBeenCalledWith(expect.objectContaining({ focus: expect.any(Function) }));
  });

  it('mostra a ajuda quando nao ha erro', async () => {
    await render(
      <TestProviders>
        <UIInput label="Nome" help="Aparece na lista" value="" onChangeText={noop} />
      </TestProviders>
    );

    expect(screen.getByText('Aparece na lista')).toBeTruthy();
  });

  it('troca a ajuda pelo erro', async () => {
    await render(
      <TestProviders>
        <UIInput
          label="Nome"
          help="Aparece na lista"
          errorMessage="Preencha o nome"
          value=""
          onChangeText={noop}
        />
      </TestProviders>
    );

    expect(screen.getByText('Preencha o nome')).toBeTruthy();
    expect(screen.queryByText('Aparece na lista')).toBeNull();
  });

  it('alinha o texto no topo quando tem varias linhas', async () => {
    await render(
      <TestProviders>
        <UIInput label="Texto" multiline value="" onChangeText={noop} />
      </TestProviders>
    );

    expect(screen.getByLabelText('Texto').props.textAlignVertical).toBe('top');
  });
});

// O px-4 vira padding-inline, que o TextInput do Android ignora: o texto encostava na borda.
describe('UIInput recuo horizontal', () => {
  it('aplica o recuo pelo style', async () => {
    await render(
      <TestProviders>
        <UIInput label="Nome" value="" onChangeText={noop} />
      </TestProviders>
    );

    expect(screen.getByLabelText('Nome').props.style).toMatchObject({
      paddingLeft: 16,
      paddingRight: 16,
    });
  });

  it('abre espaco para o acessorio a direita', async () => {
    await render(
      <TestProviders>
        <UIInput label="Senha" value="" onChangeText={noop} rightAccessory={<Text>olho</Text>} />
      </TestProviders>
    );

    expect(screen.getByLabelText('Senha').props.style).toMatchObject({ paddingRight: 48 });
  });
});
