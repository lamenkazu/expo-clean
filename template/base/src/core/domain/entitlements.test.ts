import {
  EMPTY_ENTITLEMENTS,
  grantUnlock,
  hasAccess,
  pruneExpired,
  remainingMs,
  toPersisted,
} from '@core/domain/entitlements';

const NOW = new Date('2026-01-10T12:00:00.000Z');
const HOUR_MS = 60 * 60 * 1000;
const later = (hours: number) => new Date(NOW.getTime() + hours * HOUR_MS);

describe('entitlements', () => {
  it('libera tudo para quem tem o Pro', () => {
    expect(hasAccess({ isPro: true, unlocks: [] }, 'export', NOW)).toBe(true);
  });

  it('libera o recurso por 24 horas depois do anuncio', () => {
    const state = grantUnlock(EMPTY_ENTITLEMENTS, {
      featureId: 'export',
      duration: '24h',
      source: 'rewarded',
      now: NOW,
    });

    expect(hasAccess(state, 'export', later(23))).toBe(true);
    expect(hasAccess(state, 'export', later(25))).toBe(false);
    expect(hasAccess(state, 'advanced-tools', later(1))).toBe(false);
    expect(remainingMs(state, 'export', later(20))).toBe(4 * HOUR_MS);
  });

  it('substitui o desbloqueio anterior do mesmo recurso', () => {
    const first = grantUnlock(EMPTY_ENTITLEMENTS, {
      featureId: 'export',
      duration: '24h',
      source: 'rewarded',
      now: NOW,
    });
    const second = grantUnlock(first, {
      featureId: 'export',
      duration: '24h',
      source: 'rewarded',
      now: later(10),
    });

    expect(second.unlocks).toHaveLength(1);
    expect(hasAccess(second, 'export', later(30))).toBe(true);
  });

  it('nao grava os desbloqueios de sessao', () => {
    const state = grantUnlock(EMPTY_ENTITLEMENTS, {
      featureId: 'advanced-tools',
      duration: 'session',
      source: 'rewarded',
      now: NOW,
    });

    expect(hasAccess(state, 'advanced-tools', later(1000))).toBe(true);
    expect(toPersisted(state).unlocks).toHaveLength(0);
  });

  it('remove os desbloqueios vencidos', () => {
    const state = grantUnlock(EMPTY_ENTITLEMENTS, {
      featureId: 'export',
      duration: '24h',
      source: 'rewarded',
      now: NOW,
    });

    expect(pruneExpired(state, later(25)).unlocks).toHaveLength(0);
  });
});
