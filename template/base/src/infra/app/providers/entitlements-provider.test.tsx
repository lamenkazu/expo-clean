import {
  createTestDependencies,
  mockDependencyInjection,
} from '@test/utils/create-test-dependencies';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

const mockDeps = createTestDependencies();

jest.mock('@infra/app/di/dependency-injection.factory', () => mockDependencyInjection(mockDeps));

const { EntitlementsProvider, useEntitlements } =
  require('@infra/app/providers/entitlements-provider') as typeof import('@infra/app/providers/entitlements-provider');

const wrapper = ({ children }: PropsWithChildren) => (
  <EntitlementsProvider>{children}</EntitlementsProvider>
);

describe('EntitlementsProvider', () => {
  beforeEach(() => {
    mockDeps.analytics.events = [];
    mockDeps.entitlementsRepository.state = { isPro: false, unlocks: [] };
  });

  it('libera o recurso depois do anuncio recompensado e registra o funil', async () => {
    const { result: sut } = await renderHook(() => useEntitlements(), { wrapper });
    await waitFor(() => expect(sut.current.isHydrated).toBe(true));

    expect(sut.current.hasAccess('export')).toBe(false);

    await act(async () => {
      await sut.current.unlockWithRewarded('export');
    });

    expect(sut.current.hasAccess('export')).toBe(true);
    expect(mockDeps.entitlementsRepository.state.unlocks).toHaveLength(1);
    expect(mockDeps.analytics.events.map(event => event.name)).toEqual([
      'rewarded_started',
      'rewarded_completed',
    ]);
  });

  it('libera tudo depois da compra do Pro', async () => {
    const { result: sut } = await renderHook(() => useEntitlements(), { wrapper });
    await waitFor(() => expect(sut.current.isHydrated).toBe(true));

    await act(async () => {
      await sut.current.purchasePro();
    });

    expect(sut.current.isPro).toBe(true);
    expect(sut.current.hasAccess('advanced-tools')).toBe(true);
    expect(mockDeps.entitlementsRepository.state.isPro).toBe(true);
  });
});
