import { DependencyInjectionFactory } from '@infra/app/di/dependency-injection.factory';
import { AppNavigator } from '@infra/app/navigation/app-navigator';
import { EntitlementsProvider } from '@infra/app/providers/entitlements-provider';
import { AppThemeProvider, useAppTheme } from '@infra/app/providers/theme-provider';
import { ToastProvider } from '@infra/app/providers/toast-provider';
import { TourProvider } from '@infra/app/providers/tour-provider';
import { DatabaseGate } from '@infra/data/local/db/database-gate';
import { useAppColors } from '@infra/shared/theme/use-app-colors';
import { DarkTheme, DefaultTheme, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// @inject:root-imports

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const di = DependencyInjectionFactory.getInstance();
const analytics = di.getAnalyticsService();
const remoteConfig = di.getRemoteConfigService();

const useAppBootstrap = () => {
  const pathname = usePathname();

  useEffect(() => {
    analytics.track({ name: 'app_open' });
    remoteConfig.refresh();
  }, []);

  // So o caminho da rota: parametros podem carregar dados da pessoa.
  useEffect(() => {
    if (pathname) {
      analytics.screen(pathname);
    }
  }, [pathname]);
};

const RootNavigatorContent = () => {
  const { mode, isHydrated } = useAppTheme();
  const colors = useAppColors();

  useAppBootstrap();

  // A splash fica ate o tema salvo ser lido, para a primeira tela nao piscar no tema errado.
  useEffect(() => {
    if (isHydrated) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [isHydrated]);

  const navigationTheme = useMemo(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;

    return {
      ...base,
      colors: {
        ...base.colors,
        background: colors.background,
        card: colors.surface,
        border: colors.border,
        text: colors.text,
        primary: colors.primary,
        notification: colors.danger,
      },
    };
  }, [colors, mode]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={navigationTheme}>
        <ToastProvider>
          <DatabaseGate>
            <EntitlementsProvider>
              <TourProvider>
                {/* @inject:root-providers */}
                <AppNavigator />
              </TourProvider>
            </EntitlementsProvider>
          </DatabaseGate>
        </ToastProvider>
        <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export const RootNavigator = () => (
  <GestureHandlerRootView className="flex-1">
    <AppThemeProvider>
      <RootNavigatorContent />
    </AppThemeProvider>
  </GestureHandlerRootView>
);
