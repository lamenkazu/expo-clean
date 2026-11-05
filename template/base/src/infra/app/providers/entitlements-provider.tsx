import {
  EMPTY_ENTITLEMENTS,
  grantUnlock,
  hasAccess as hasAccessTo,
  pruneExpired,
  toPersisted,
} from '@core/domain/entitlements';
import type {
  EntitlementsStateDTO,
  PremiumFeatureId,
  PurchaseResult,
  UnlockDuration,
} from '@core/dto/entitlement.dto';
import type { RewardedResult } from '@core/services/ads.service';
import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

const di = DependencyInjectionFactory.getInstance();
const entitlementsRepository = di.getEntitlementsRepository();
const purchasesService = di.getPurchasesService();
const adsService = di.getAdsService();
const analytics = di.getAnalyticsService();

const PRO_PRODUCT = 'pro_lifetime';

type EntitlementsContextValue = {
  isHydrated: boolean;
  isPro: boolean;
  hasAccess: (featureId: PremiumFeatureId) => boolean;
  unlockWithRewarded: (
    featureId: PremiumFeatureId,
    duration?: UnlockDuration
  ) => Promise<RewardedResult>;
  purchasePro: () => Promise<PurchaseResult>;
  restorePro: () => Promise<boolean>;
  // Atalhos para testar o fluxo sem loja nem anuncios. A tela so os mostra em __DEV__.
  devSetPro: (isPro: boolean) => Promise<void>;
  devResetUnlocks: () => Promise<void>;
};

const EntitlementsContext = createContext<EntitlementsContextValue | null>(null);

export const EntitlementsProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<EntitlementsStateDTO>(EMPTY_ENTITLEMENTS);
  const [isHydrated, setIsHydrated] = useState(false);
  const stateRef = useRef(state);

  const commit = useCallback(async (next: EntitlementsStateDTO) => {
    stateRef.current = next;
    setState(next);
    await entitlementsRepository.save(toPersisted(next));
  }, []);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const stored = await entitlementsRepository.load();
      // A loja e a fonte da verdade do Pro: uma compra feita em outro aparelho tambem vale.
      const isProOwned = await purchasesService.isProOwned().catch(() => stored.isPro);

      if (isMounted) {
        const next = pruneExpired({ ...stored, isPro: stored.isPro || isProOwned }, new Date());
        stateRef.current = next;
        setState(next);
        setIsHydrated(true);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const hasAccess = useCallback(
    (featureId: PremiumFeatureId) => hasAccessTo(state, featureId, new Date()),
    [state]
  );

  const unlockWithRewarded = useCallback(
    async (featureId: PremiumFeatureId, duration: UnlockDuration = '24h') => {
      const placement = 'unlock-feature';
      analytics.track({ name: 'rewarded_started', placement });
      const result = await adsService.showRewarded(placement);

      if (result === 'rewarded') {
        analytics.track({ name: 'rewarded_completed', placement });
        await commit(
          grantUnlock(stateRef.current, {
            featureId,
            duration,
            source: 'rewarded',
            now: new Date(),
          })
        );
      }

      return result;
    },
    [commit]
  );

  const purchasePro = useCallback(async () => {
    analytics.track({ name: 'purchase_started', product: PRO_PRODUCT });
    const result = await purchasesService.purchasePro();

    if (result === 'purchased') {
      analytics.track({ name: 'purchase_completed', product: PRO_PRODUCT });
      await commit({ ...stateRef.current, isPro: true });
    } else if (result === 'cancelled') {
      analytics.track({ name: 'purchase_cancelled', product: PRO_PRODUCT });
    }

    return result;
  }, [commit]);

  const restorePro = useCallback(async () => {
    const isProOwned = await purchasesService.isProOwned();

    if (isProOwned) {
      await commit({ ...stateRef.current, isPro: true });
    }

    return isProOwned;
  }, [commit]);

  const devSetPro = useCallback(
    async (isPro: boolean) => commit({ ...stateRef.current, isPro }),
    [commit]
  );

  const devResetUnlocks = useCallback(
    async () => commit({ ...stateRef.current, unlocks: [] }),
    [commit]
  );

  const value = useMemo(
    () => ({
      isHydrated,
      isPro: state.isPro,
      hasAccess,
      unlockWithRewarded,
      purchasePro,
      restorePro,
      devSetPro,
      devResetUnlocks,
    }),
    [
      devResetUnlocks,
      devSetPro,
      hasAccess,
      isHydrated,
      purchasePro,
      restorePro,
      state.isPro,
      unlockWithRewarded,
    ]
  );

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>;
};

export const useEntitlements = () => {
  const context = useContext(EntitlementsContext);

  if (!context) {
    throw new Error('useEntitlements must be used within EntitlementsProvider.');
  }

  return context;
};
