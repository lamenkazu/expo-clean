// Recursos que podem ser liberados pelo Pro ou por um desbloqueio temporario (anuncio recompensado).
// Cada app troca esta lista pelos recursos dele.
export type PremiumFeatureId = 'export' | 'advanced-tools';

export type UnlockSource = 'rewarded' | 'dev';

// "24h" vale por um dia a partir da liberacao. "session" vale ate o app fechar e nao e gravado.
export type UnlockDuration = '24h' | 'session';

export type TemporaryUnlockDTO = {
  featureId: PremiumFeatureId;
  source: UnlockSource;
  grantedAt: string;
  expiresAt: string | null;
};

export type EntitlementsStateDTO = {
  isPro: boolean;
  unlocks: TemporaryUnlockDTO[];
};

export type ProProductDTO = {
  id: string;
  title: string;
  priceLabel: string;
};

export type PurchaseResult = 'purchased' | 'cancelled' | 'pending';
