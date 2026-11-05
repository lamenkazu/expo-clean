import type { EntitlementsRepository } from '@core/repositories/entitlements.repository';
import type { AdsService } from '@core/services/ads.service';
import type { AnalyticsService } from '@core/services/analytics.service';
import type { CrashReporter } from '@core/services/crash-reporter.service';
import type { PurchasesService } from '@core/services/purchases.service';
import type { RemoteConfigService } from '@core/services/remote-config.service';
import { EntitlementsLocalRepository } from '@infra/data/local/repositories/entitlements-local.repository';
import { ConsoleAnalyticsService } from '@infra/services/console/console-analytics.service';
import { ConsoleCrashReporter } from '@infra/services/console/console-crash-reporter.service';
import { DefaultsRemoteConfigService } from '@infra/services/console/defaults-remote-config.service';
import { FakeAdsService } from '@infra/services/fake/fake-ads.service';
import { FakePurchasesService } from '@infra/services/fake/fake-purchases.service';
import { isFirebaseEnabled } from '@infra/shared/config/app-config';

// @inject:di-imports

// O Firebase so e carregado quando o build tem google-services.json. Sem ele, o modulo nativo
// existe mas nao ha app padrao, e qualquer chamada falharia.
const createTelemetry = () => {
  if (!isFirebaseEnabled()) {
    return {
      analytics: new ConsoleAnalyticsService(),
      crashReporter: new ConsoleCrashReporter(),
      remoteConfig: new DefaultsRemoteConfigService(),
    };
  }

  const { FirebaseAnalyticsService } =
    require('@infra/services/firebase/firebase-analytics.service') as typeof import('@infra/services/firebase/firebase-analytics.service');
  const { FirebaseCrashReporter } =
    require('@infra/services/firebase/firebase-crash-reporter.service') as typeof import('@infra/services/firebase/firebase-crash-reporter.service');
  const { FirebaseRemoteConfigService } =
    require('@infra/services/firebase/firebase-remote-config.service') as typeof import('@infra/services/firebase/firebase-remote-config.service');

  return {
    analytics: new FirebaseAnalyticsService(),
    crashReporter: new FirebaseCrashReporter(),
    remoteConfig: new FirebaseRemoteConfigService(),
  };
};

export class DependencyInjectionFactory {
  private static instance: DependencyInjectionFactory;

  private readonly analyticsService: AnalyticsService;
  private readonly crashReporter: CrashReporter;
  private readonly remoteConfigService: RemoteConfigService;
  private readonly entitlementsRepository: EntitlementsRepository;
  private readonly purchasesService: PurchasesService;
  private readonly adsService: AdsService;
  // @inject:di-fields

  private constructor() {
    const telemetry = createTelemetry();
    this.analyticsService = telemetry.analytics;
    this.crashReporter = telemetry.crashReporter;
    this.remoteConfigService = telemetry.remoteConfig;
    this.entitlementsRepository = new EntitlementsLocalRepository();
    this.purchasesService = new FakePurchasesService();
    this.adsService = new FakeAdsService();
    // @inject:di-constructor
  }

  static getInstance(): DependencyInjectionFactory {
    if (!DependencyInjectionFactory.instance) {
      DependencyInjectionFactory.instance = new DependencyInjectionFactory();
    }

    return DependencyInjectionFactory.instance;
  }

  getAnalyticsService(): AnalyticsService {
    return this.analyticsService;
  }

  getCrashReporter(): CrashReporter {
    return this.crashReporter;
  }

  getRemoteConfigService(): RemoteConfigService {
    return this.remoteConfigService;
  }

  getEntitlementsRepository(): EntitlementsRepository {
    return this.entitlementsRepository;
  }

  getPurchasesService(): PurchasesService {
    return this.purchasesService;
  }

  getAdsService(): AdsService {
    return this.adsService;
  }

  // @inject:di-getters
}
