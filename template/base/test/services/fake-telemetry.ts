import type { CrashReporter } from '@core/services/crash-reporter.service';
import { DefaultsRemoteConfigService } from '@infra/services/console/defaults-remote-config.service';

export class FakeCrashReporter implements CrashReporter {
  public errors: { error: unknown; context?: string }[] = [];

  recordError(error: unknown, context?: string): void {
    this.errors.push({ error, context });
  }

  log(): void {}

  setAttribute(): void {}
}

export { DefaultsRemoteConfigService as FakeRemoteConfigService };
