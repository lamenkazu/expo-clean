import { useEntitlements } from '@infra/app/providers/entitlements-provider';
import { useScreenTour } from '@infra/app/providers/tour-provider';
import { useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { DEMO_FEATURE } from './model';

export const useHomeViewModel = () => {
  const router = useRouter();
  const { isPro, hasAccess, isHydrated } = useEntitlements();

  useScreenTour('start', isHydrated);

  const hasDemoAccess = hasAccess(DEMO_FEATURE);

  const openDemoFeature = useCallback(() => {
    if (!hasDemoAccess) {
      router.push({ pathname: '/paywall', params: { feature: DEMO_FEATURE } });
    }
  }, [hasDemoAccess, router]);

  const actions = useMemo(() => ({ openDemoFeature }), [openDemoFeature]);

  return { isPro, hasDemoAccess, actions };
};
