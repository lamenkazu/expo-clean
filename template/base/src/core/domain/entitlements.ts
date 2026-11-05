import type {
  EntitlementsStateDTO,
  PremiumFeatureId,
  TemporaryUnlockDTO,
  UnlockDuration,
  UnlockSource,
} from '@core/dto/entitlement.dto';

const DAY_MS = 24 * 60 * 60 * 1000;

export const EMPTY_ENTITLEMENTS: EntitlementsStateDTO = { isPro: false, unlocks: [] };

const isActive = (unlock: TemporaryUnlockDTO, now: Date): boolean =>
  unlock.expiresAt === null || new Date(unlock.expiresAt).getTime() > now.getTime();

export const hasAccess = (
  state: EntitlementsStateDTO,
  featureId: PremiumFeatureId,
  now: Date
): boolean =>
  state.isPro ||
  state.unlocks.some(unlock => unlock.featureId === featureId && isActive(unlock, now));

export const grantUnlock = (
  state: EntitlementsStateDTO,
  {
    featureId,
    duration,
    source,
    now,
  }: { featureId: PremiumFeatureId; duration: UnlockDuration; source: UnlockSource; now: Date }
): EntitlementsStateDTO => {
  const unlock: TemporaryUnlockDTO = {
    featureId,
    source,
    grantedAt: now.toISOString(),
    expiresAt: duration === 'session' ? null : new Date(now.getTime() + DAY_MS).toISOString(),
  };
  // Um novo desbloqueio substitui o anterior do mesmo recurso, em vez de somar o tempo.
  const others = state.unlocks.filter(current => current.featureId !== featureId);

  return { ...state, unlocks: [...others, unlock] };
};

export const pruneExpired = (state: EntitlementsStateDTO, now: Date): EntitlementsStateDTO => ({
  ...state,
  unlocks: state.unlocks.filter(unlock => isActive(unlock, now)),
});

// Desbloqueios de sessao nao sobrevivem ao fechamento do app.
export const toPersisted = (state: EntitlementsStateDTO): EntitlementsStateDTO => ({
  ...state,
  unlocks: state.unlocks.filter(unlock => unlock.expiresAt !== null),
});

export const remainingMs = (
  state: EntitlementsStateDTO,
  featureId: PremiumFeatureId,
  now: Date
): number | null => {
  const unlock = state.unlocks.find(current => current.featureId === featureId);

  if (!unlock || unlock.expiresAt === null) {
    return null;
  }

  return Math.max(0, new Date(unlock.expiresAt).getTime() - now.getTime());
};
