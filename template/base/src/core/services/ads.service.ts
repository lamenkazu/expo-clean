// Lugares do app onde um anuncio recompensado pode ser oferecido.
export type RewardedPlacement = 'unlock-feature';

export type RewardedResult = 'rewarded' | 'dismissed' | 'unavailable';

// Anuncio recompensado: so libera algo opcional, nunca o uso basico do app.
export interface AdsService {
  isRewardedReady(placement: RewardedPlacement): Promise<boolean>;
  showRewarded(placement: RewardedPlacement): Promise<RewardedResult>;
}
