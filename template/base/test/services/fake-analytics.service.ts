import type { AnalyticsEvent, AnalyticsService } from '@core/services/analytics.service';

export class FakeAnalyticsService implements AnalyticsService {
  public events: AnalyticsEvent[] = [];
  public screens: string[] = [];

  track(event: AnalyticsEvent): void {
    this.events.push(event);
  }

  screen(name: string): void {
    this.screens.push(name);
  }

  setUserProperty(): void {}
}
