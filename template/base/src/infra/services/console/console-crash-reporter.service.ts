import type { CrashReporter } from '@core/services/crash-reporter.service';

export class ConsoleCrashReporter implements CrashReporter {
  recordError(error: unknown, context?: string): void {
    console.warn('[crash]', context ?? '', error);
  }

  log(message: string): void {
    if (__DEV__) {
      console.log('[crash] log', message);
    }
  }

  setAttribute(name: string, value: string): void {
    if (__DEV__) {
      console.log('[crash] attribute', name, value);
    }
  }
}
