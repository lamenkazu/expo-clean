# ADR 003: Telemetria e monetização por contratos

## Contexto

Os produtos medem retenção, funil de monetização e qualidade (crashes e ANRs por modelo de aparelho),
sem coletar o conteúdo da pessoa. O modelo de receita é gratuito, com anúncio recompensado e Pro
vitalício, e a assinatura só entra quando houver um custo recorrente real.

## Decisão

- **Telemetria:** `AnalyticsService`, `CrashReporter` e `RemoteConfigService` ficam em
  `core/services`.
  - As implementações Firebase entram quando existe `google-services.json`, controlado pelo
    `app.config.js` e por `isFirebaseEnabled`.
  - Sem o arquivo, o app compila e usa as implementações de console.
- **Eventos:** são uma união tipada (`AnalyticsEvent`) com tipo e frequência. Nenhum evento leva texto
  digitado ou dado lido pela pessoa.
- **Monetização:** fica atrás de dois contratos, `PurchasesService` (Pro vitalício) e `AdsService`
  (recompensado). O template traz só implementações falsas. A escolha do SDK (Play Billing, RevenueCat,
  AdMob) é feita por app.
- **Entitlements:** o `EntitlementsProvider` junta o Pro e os desbloqueios temporários (24 horas ou a
  sessão). A regra de acesso está em `core/domain/entitlements.ts`, com testes.

## Consequências

- Trocar a implementação falsa pela real muda só a classe registrada no DI.
- O paywall e o fluxo de desbloqueio já podem ser testados de ponta a ponta com as falsas, pelo menu de
  desenvolvimento em Ajustes.
- O Remote Config sempre tem um valor padrão em `REMOTE_CONFIG_DEFAULTS`: o app nunca espera a rede para
  decidir o que mostrar.
