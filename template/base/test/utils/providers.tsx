import { AppThemeProvider } from '@infra/app/providers/theme-provider';
import { ToastProvider } from '@infra/app/providers/toast-provider';
import type { PropsWithChildren } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const SAFE_AREA_METRICS = {
  frame: { x: 0, y: 0, width: 390, height: 844 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

// Providers que quase toda tela usa. Acrescente os da feature no proprio teste.
export const TestProviders = ({ children }: PropsWithChildren) => (
  <SafeAreaProvider initialMetrics={SAFE_AREA_METRICS}>
    <AppThemeProvider>
      <ToastProvider>{children}</ToastProvider>
    </AppThemeProvider>
  </SafeAreaProvider>
);
