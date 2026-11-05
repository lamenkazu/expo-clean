import type { AnalyticsEvent, AnalyticsService } from '@core/services/analytics.service';

// Usado enquanto o Firebase nao esta configurado. Em producao nao registra nada.
export class ConsoleAnalyticsService implements AnalyticsService {
  track(event: AnalyticsEvent): void {
    if (__DEV__) {
      console.log('[analytics]', event);
    }
  }

  screen(name: string): void {
    if (__DEV__) {
      console.log('[analytics] screen', name);
    }
  }

  setUserProperty(name: string, value: string | null): void {
    if (__DEV__) {
      console.log('[analytics] property', name, value);
    }
  }
}
