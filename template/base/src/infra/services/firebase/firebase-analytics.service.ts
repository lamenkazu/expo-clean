import type { AnalyticsEvent, AnalyticsService } from '@core/services/analytics.service';
import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserProperty,
} from '@react-native-firebase/analytics';

export class FirebaseAnalyticsService implements AnalyticsService {
  private readonly analytics = getAnalytics();

  track(event: AnalyticsEvent): void {
    const { name, ...params } = event;
    // Falhas de envio nao podem interromper a tela que disparou o evento.
    Promise.resolve(logEvent(this.analytics, name, params)).catch(() => undefined);
  }

  screen(name: string): void {
    logScreenView(this.analytics, { screen_name: name, screen_class: name }).catch(() => undefined);
  }

  setUserProperty(name: string, value: string | null): void {
    setUserProperty(this.analytics, name, value).catch(() => undefined);
  }
}
