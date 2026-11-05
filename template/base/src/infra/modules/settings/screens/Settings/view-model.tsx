import { TOURS, type TourId } from '@core/domain/tours';
import { useEntitlements } from '@infra/app/providers/entitlements-provider';
import { useAppTheme } from '@infra/app/providers/theme-provider';
import { useToast } from '@infra/app/providers/toast-provider';
import { useScreenTour, useTours } from '@infra/app/providers/tour-provider';
import { toUserMessage } from '@infra/shared/error/to-app-error';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import * as Updates from 'expo-updates';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TOUR_ROUTES, toVersionLabel } from './model';

export const useSettingsViewModel = () => {
  const { t } = useTranslation('settings');
  const router = useRouter();
  const { modePreference, setModePreference, themeName, setThemeName } = useAppTheme();
  const { isPro, restorePro, devSetPro, devResetUnlocks } = useEntitlements();
  const { replay } = useTours();
  const { showToast } = useToast();
  const [isRestoring, setIsRestoring] = useState(false);

  useScreenTour('settings');

  const replayTour = useCallback(
    (tourId: TourId) => {
      replay(tourId);
      router.navigate(TOUR_ROUTES[tourId]);
    },
    [replay, router]
  );

  const restore = useCallback(async () => {
    setIsRestoring(true);

    try {
      const restored = await restorePro();
      showToast(restored ? t('plan.restored') : t('plan.notFound'), restored ? 'success' : 'info');
    } catch (error) {
      showToast(toUserMessage(error), 'error');
    } finally {
      setIsRestoring(false);
    }
  }, [restorePro, showToast, t]);

  const actions = useMemo(
    () => ({
      setModePreference,
      setThemeName,
      replayTour,
      restore,
      openPaywall: () => router.push('/paywall'),
      devTogglePro: () => devSetPro(!isPro),
      devResetUnlocks,
    }),
    [
      devResetUnlocks,
      devSetPro,
      isPro,
      replayTour,
      restore,
      router,
      setModePreference,
      setThemeName,
    ]
  );

  const versionLabel = toVersionLabel({
    version: Constants.expoConfig?.version,
    updateId: Updates.updateId,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
  });

  return {
    modePreference,
    themeName,
    isPro,
    isRestoring,
    isDev: __DEV__,
    tours: TOURS,
    versionLabel,
    actions,
  };
};
