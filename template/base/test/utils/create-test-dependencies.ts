import { FakeAdsService } from '@infra/services/fake/fake-ads.service';
import { FakePurchasesService } from '@infra/services/fake/fake-purchases.service';
import { InMemoryEntitlementsRepository } from '@test/repositories/in-memory-entitlements.repository';
import { FakeAnalyticsService } from '@test/services/fake-analytics.service';
import { FakeCrashReporter, FakeRemoteConfigService } from '@test/services/fake-telemetry';
// @inject:test-di-imports

// Mesmos getters do DependencyInjectionFactory, com implementacoes em memoria. Use com:
//   jest.mock('@infra/app/di/dependency-injection.factory', () => mockDependencyInjection(deps))
export const createTestDependencies = () => ({
  analytics: new FakeAnalyticsService(),
  crashReporter: new FakeCrashReporter(),
  remoteConfig: new FakeRemoteConfigService(),
  entitlementsRepository: new InMemoryEntitlementsRepository(),
  purchases: new FakePurchasesService(),
  ads: new FakeAdsService(),
  // @inject:test-di-fields
});

export type TestDependencies = ReturnType<typeof createTestDependencies>;

export const mockDependencyInjection = (deps: TestDependencies) => ({
  DependencyInjectionFactory: {
    getInstance: () => ({
      getAnalyticsService: () => deps.analytics,
      getCrashReporter: () => deps.crashReporter,
      getRemoteConfigService: () => deps.remoteConfig,
      getEntitlementsRepository: () => deps.entitlementsRepository,
      getPurchasesService: () => deps.purchases,
      getAdsService: () => deps.ads,
      // @inject:test-di-getters
    }),
  },
});
