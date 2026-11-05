import type { AdsService, RewardedPlacement, RewardedResult } from '@core/services/ads.service';

const FAKE_AD_DURATION_MS = 800;

// Simula um anuncio recompensado que sempre termina. Troque pelo SDK de anuncios (AdMob)
// implementando AdsService e registrando a classe no DI.
export class FakeAdsService implements AdsService {
  async isRewardedReady(_placement: RewardedPlacement): Promise<boolean> {
    return true;
  }

  async showRewarded(_placement: RewardedPlacement): Promise<RewardedResult> {
    await new Promise(resolve => setTimeout(resolve, FAKE_AD_DURATION_MS));
    return 'rewarded';
  }
}
