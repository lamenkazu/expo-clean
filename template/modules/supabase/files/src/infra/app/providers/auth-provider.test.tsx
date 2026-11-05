import { act, renderHook, waitFor } from '@testing-library/react-native';
import { createTestDependencies, mockDependencyInjection } from '@test/utils/create-test-dependencies';
import type { PropsWithChildren } from 'react';

const mockDeps = createTestDependencies();

jest.mock('@infra/app/di/dependency-injection.factory', () => mockDependencyInjection(mockDeps));

const { AuthProvider, useAuth } =
  require('@infra/app/providers/auth-provider') as typeof import('@infra/app/providers/auth-provider');

const wrapper = ({ children }: PropsWithChildren) => <AuthProvider>{children}</AuthProvider>;

describe('AuthProvider', () => {
  beforeEach(() => {
    mockDeps.authRepository.users = [{ id: 'u1', email: 'ana@exemplo.com', password: 'segredo' }];
    mockDeps.authRepository.session = null;
  });

  it('abre a sessao com as credenciais certas', async () => {
    const { result: sut } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(sut.current.isLoading).toBe(false));

    let response: { error: string | null } = { error: 'nao rodou' };
    await act(async () => {
      response = await sut.current.signIn('ana@exemplo.com', 'segredo');
    });

    expect(response.error).toBeNull();
    expect(sut.current.user?.email).toBe('ana@exemplo.com');
  });

  it('devolve a mensagem traduzida quando a senha esta errada', async () => {
    const { result: sut } = await renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(sut.current.isLoading).toBe(false));

    let response: { error: string | null } = { error: null };
    await act(async () => {
      response = await sut.current.signIn('ana@exemplo.com', 'errada');
    });

    expect(response.error).toBe('E-mail ou senha incorretos.');
    expect(sut.current.session).toBeNull();
  });
});
