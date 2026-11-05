# __APP_NAME__

App Android feito com Expo SDK 58, a partir do template `@eppck/create-expo`.

## Começando

```bash
pnpm install
pnpm check            # typecheck, lint e testes
pnpm app:prebuild     # gera a pasta android/
pnpm android          # compila, instala no emulador ou no aparelho e abre o Metro
```

O Windows precisa aceitar caminhos longos para compilar o código nativo. `pnpm android`,
`pnpm apk:*` e `pnpm aab:release` conferem isso antes de chamar o Gradle (`pnpm check:native`
confere sozinho). Se faltar, rode uma vez, num PowerShell como administrador, e abra um terminal novo:

```powershell
New-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem -Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force
```

O `ninja` do Android SDK também precisa ser 1.12 ou mais novo (`cmake/<versão>/bin/ninja.exe`).

## Stack

| Área | Escolha |
|---|---|
| App | Expo 58, React Native 0.88, React 19.3, Expo Router (rotas tipadas) |
| Linguagem | TypeScript 7 |
| Estilo | NativeWind 5 + Tailwind 4 para layout, tema próprio para cores e formas |
| Dados | SQLite com Drizzle (migrations no bundle), AsyncStorage para preferências |
| Formulários | react-hook-form + zod |
| Textos | i18next (pt-BR), com chaves conferidas pelo TypeScript |
| Telemetria | Firebase Analytics, Crashlytics e Remote Config (desligados sem `google-services.json`) |
| Monetização | Contratos de Pro vitalício e anúncio recompensado, com implementações falsas |
| Qualidade | Biome, Jest (jest-expo) + Testing Library, GitHub Actions |

As convenções de código e a arquitetura estão em [AGENTS.md](AGENTS.md). As decisões ficam em
[src/core/docs](src/core/docs).

## Firebase

1. Crie o projeto no console do Firebase com um app Android de pacote `__ANDROID_PACKAGE__`.
2. Salve o `google-services.json` na raiz. Ele não vai para o git.
3. Rode `pnpm app:prebuild` e gere um APK novo.

O app passa a enviar os eventos e os erros. Para conferir, ative o DebugView:
`adb shell setprop debug.firebase.analytics.app __ANDROID_PACKAGE__`.

## Atualizações por EAS Update

1. `pnpm dlx eas-cli init` e coloque o `projectId` em `EXPO_PUBLIC_EAS_PROJECT_ID` no `.env`.
2. Gere um APK novo (o endereço de atualização entra no build).
3. Mudanças só de JavaScript: `pnpm app:update --platform android --message "<o que mudou>"`.

Mudança nativa exige subir `version` em `app.json` e um APK novo.

## Publicação no Play

```bash
pnpm aab:release
```

O arquivo fica em `android/app/build/outputs/bundle/release/`. Configure a assinatura em
`android/app/build.gradle` antes, ou use `pnpm dlx eas-cli build -p android --profile production`.
