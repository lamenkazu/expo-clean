# __APP_NAME__

App Expo (SDK 58, React Native 0.88, Android) com a arquitetura Core/Infra + MVVM. Os dados ficam no
aparelho (SQLite), e o app funciona sem conta e sem internet.

## Comandos

```bash
pnpm check            # typecheck + lint + testes: rode antes de dizer que terminou
pnpm typecheck        # TypeScript 7
pnpm lint:fix         # Biome: formatacao, imports e regras
pnpm test             # Jest (jest-expo + Testing Library)
pnpm db:generate      # migration nova depois de mudar src/infra/data/local/db/schema.ts
pnpm app:prebuild     # gera android/ depois de mudar dependencia nativa, plugin ou app.json
pnpm apk:debug        # APK de desenvolvimento
pnpm expo install <pacote>   # sempre use este para dependencias com codigo nativo
```

O Expo muda a API a cada SDK. Antes de usar uma API do Expo ou do React Native, confira a
documentacao da versao instalada em https://docs.expo.dev/versions/v58.0.0/.

## Arquitetura

```
app/                      rotas do Expo Router, so reexportam a view da tela
src/core/                 sem React e sem Expo: pode ir para um backend sem mudar
  domain/                 regras puras, com *.test.ts ao lado
  dto/                    tipos dos dados que circulam no app
  error/                  AppError e ERROR_CODES
  repositories/           contratos de dados (interfaces)
  services/               contratos de servicos (analytics, crash, anuncios, compras)
src/infra/                implementacoes
  app/di/                 DependencyInjectionFactory: escolhe a implementacao de cada contrato
  app/navigation/         layout raiz, pilha, abas
  app/providers/          estado global (tema, toast, tour, entitlements)
  data/local/             SQLite (Drizzle), AsyncStorage e repositorios locais
  services/               Firebase, implementacoes de console e falsas
  modules/<feature>/      telas e componentes de cada feature
  shared/                 ui/, theme/, i18n/, utils/, config/
test/                     repositorios em memoria, fakes, factories e utilitarios de teste
```

- `core` nunca importa de `infra`, de React ou de Expo.
- Telas e providers pegam repositorios e servicos do `DependencyInjectionFactory`, nunca criam a
  implementacao direto.
- Repositorios convertem qualquer falha em `AppError` com `toAppError(error, ERROR_CODES.X)`.
- A mensagem para a pessoa vem de `toUserMessage(error)`, que le `errors:<CODIGO>` do i18n.

## MVVM por tela

Cada tela fica em `src/infra/modules/<feature>/screens/<NomeDaTela>/`:

- `model.ts`: schema zod, tipo do formulario, `defaultValues`, conversores (`toDTO`, `toDraft`).
  Sem React. As mensagens do schema sao chaves do i18n (`'validation:required'`).
- `view-model.tsx`: hook `use<Tela>ViewModel()` com estado, chamadas aos repositorios, navegacao e
  tratamento de erro. Devolve `{ ...estado, actions }`.
- `view.tsx`: so JSX. Le o view-model e traduz os textos.

A rota em `app/` so reexporta a view: `export default NotesListView;`.

## Convencoes de codigo

- Arquivos em kebab-case. Componentes e hooks com export nomeado; so as rotas usam default.
- Componentes compartilhados tem prefixo `UI` e ficam em `src/infra/shared/ui` (veja o AGENTS.md de la).
- Imports entre pastas usam os aliases `@core`, `@infra` e `@test`; dentro da pasta da tela, `./model`.
- Comentarios em portugues sem acento, explicando o porque.
- Todo texto visivel passa pelo i18n (`src/infra/shared/i18n/locales/pt-BR`). As chaves sao conferidas
  pelo TypeScript.
- Cores, cantos e bordas vem do tema (`useAppColors`, `useAppShape`, `useAppSurfaces`). O Tailwind
  (`className`) cuida de layout e espacamento.
- `useEffect` assincrono usa a guarda `isMounted` antes de mudar estado.

## Dados

- SQLite com Drizzle em `src/infra/data/local/db`. As tabelas ficam em `schema.ts`. Depois de mudar,
  rode `pnpm db:generate`; a migration entra no bundle e roda na abertura (`DatabaseGate`).
- Nunca edite uma migration ja gerada: crie outra.
- Datas ficam em texto ISO, como nos DTOs. Ids sao UUID gerados no aparelho (`createId`).
- AsyncStorage so para preferencias pequenas, via `preferencesStorage`.

## Monetizacao e telemetria

- `EntitlementsProvider` (`useEntitlements`) diz se a pessoa tem o Pro (`isPro`) ou um desbloqueio
  temporario (`hasAccess(feature)`). Os recursos ficam em `PremiumFeatureId`.
- A loja e os anuncios usam implementacoes falsas (`FakePurchasesService`, `FakeAdsService`). Para
  ligar os reais, implemente `PurchasesService` e `AdsService` e troque no DI.
- Anuncio recompensado libera algo opcional, nunca o uso basico do app.
- Analytics, Crashlytics e Remote Config usam o Firebase quando existe `google-services.json`. Sem ele,
  o DI usa as implementacoes de console.
- Eventos de analytics seguem `AnalyticsEvent` e registram tipo e frequencia, nunca o conteudo da
  pessoa (texto de nota, dado lido, nome).
- Permissoes sao pedidas no momento do uso, com explicacao, e registradas como eventos.

## Testes

- Dominio (`src/core/domain`): funcoes puras, `*.test.ts` ao lado do arquivo.
- View-models e providers: `renderHook` da Testing Library, com o DI trocado por
  `mockDependencyInjection(createTestDependencies())`. Veja `NoteForm/view-model.test.tsx`.
- No Testing Library 14, `render`, `renderHook` e `act` sao assincronos: use `await`.
- Variaveis usadas dentro de `jest.mock` precisam comecar com `mock`.
- O objeto testado se chama `sut`. Os nomes dos testes ficam em portugues.

## Antes de entregar

1. `pnpm check` passa.
2. Mudanca nativa (dependencia, plugin, `app.json`): `pnpm app:prebuild` e um APK novo. Suba `version`
   em `app.json`, porque ela define o `runtimeVersion` do EAS Update.
3. Confira na tela do aparelho com a skill `testar-no-celular`.
