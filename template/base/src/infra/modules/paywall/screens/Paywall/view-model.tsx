import type { ProProductDTO } from '@core/dto/entitlement.dto';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { useEntitlements } from '@infra/app/providers/entitlements-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { toUserMessage } from '@infra/shared/error/to-app-error';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toFeatureId } from './model';

const di = DependencyInjectionFactory.getInstance();
const purchasesService = di.getPurchasesService();
const adsService = di.getAdsService();
const analytics = di.getAnalyticsService();
const remoteConfig = di.getRemoteConfigService();

export const usePaywallViewModel = () => {
  const { t } = useTranslation('paywall');
  const router = useRouter();
  const params = useLocalSearchParams<{ feature?: string }>();
  const featureId = toFeatureId(params.feature);
  const { isPro, purchasePro, unlockWithRewarded } = useEntitlements();
  const { showToast } = useToast();
  const [product, setProduct] = useState<ProProductDTO | null>(null);
  const [isRewardedReady, setIsRewardedReady] = useState(false);
  const [busy, setBusy] = useState<'purchase' | 'rewarded' | null>(null);

  const canOfferRewarded = featureId !== null && remoteConfig.get('rewarded_enabled');

  useEffect(() => {
    let isMounted = true;
    analytics.track({ name: 'paywall_view', source: featureId ?? 'settings' });

    purchasesService
      .getProProduct()
      .then(result => isMounted && setProduct(result))
      .catch(() => isMounted && setProduct(null));

    if (canOfferRewarded) {
      adsService.isRewardedReady('unlock-feature').then(ready => {
        if (isMounted) {
          setIsRewardedReady(ready);

          if (ready) {
            analytics.track({ name: 'rewarded_offered', placement: 'unlock-feature' });
          }
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, [canOfferRewarded, featureId]);

  const buy = useCallback(async () => {
    setBusy('purchase');

    try {
      const result = await purchasePro();
      showToast(t(result), result === 'purchased' ? 'success' : 'info');

      if (result === 'purchased') {
        router.back();
      }
    } catch (error) {
      showToast(toUserMessage(error), 'error');
    } finally {
      setBusy(null);
    }
  }, [purchasePro, router, showToast, t]);

  const watchRewarded = useCallback(async () => {
    if (!featureId) {
      return;
    }

    setBusy('rewarded');

    try {
      const result = await unlockWithRewarded(featureId);

      if (result === 'rewarded') {
        showToast(t('rewarded.granted'), 'success');
        router.back();
      } else {
        showToast(result === 'dismissed' ? t('rewarded.dismissed') : toUserMessage(null), 'info');
      }
    } finally {
      setBusy(null);
    }
  }, [featureId, router, showToast, t, unlockWithRewarded]);

  const actions = useMemo(
    () => ({ buy, watchRewarded, close: router.back }),
    [buy, router.back, watchRewarded]
  );

  return {
    isPro,
    product,
    showRewarded: canOfferRewarded && isRewardedReady && !isPro,
    busy,
    actions,
  };
};
