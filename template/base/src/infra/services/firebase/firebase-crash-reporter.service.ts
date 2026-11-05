import type { CrashReporter } from '@core/services/crash-reporter.service';
import { getCrashlytics, log, recordError, setAttribute } from '@react-native-firebase/crashlytics';

export class FirebaseCrashReporter implements CrashReporter {
  private readonly crashlytics = getCrashlytics();

  recordError(error: unknown, context?: string): void {
    const normalized = error instanceof Error ? error : new Error(String(error));
    recordError(this.crashlytics, normalized, context);
  }

  log(message: string): void {
    log(this.crashlytics, message);
  }

  setAttribute(name: string, value: string): void {
    setAttribute(this.crashlytics, name, value).catch(() => undefined);
  }
}
