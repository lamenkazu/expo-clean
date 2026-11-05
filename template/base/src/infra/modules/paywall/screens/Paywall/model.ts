import type { PremiumFeatureId } from '@core/dto/entitlement.dto';

const PREMIUM_FEATURES: readonly PremiumFeatureId[] = ['export', 'advanced-tools'];

// O recurso chega como parametro da rota. Um valor desconhecido abre o paywall sem o anuncio.
export const toFeatureId = (value: string | string[] | undefined): PremiumFeatureId | null => {
  const raw = Array.isArray(value) ? value[0] : value;
  return PREMIUM_FEATURES.find(feature => feature === raw) ?? null;
};
