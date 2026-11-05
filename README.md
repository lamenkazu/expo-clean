# @eppck/create-expo

CLI que cria apps Android com Expo SDK 58, na arquitetura Core/Infra + MVVM do realtime-shopping.
É o par mobile do [`@eppck/create-ddd`](../ddd-clean): quando um app precisar de backend próprio, ele
segue aquele template.

```bash
pnpx @eppck/create-expo meu-app
# sem publicar no npm, a partir deste repositório:
pnpm build && node dist/cli.js ../meu-app
# a pasta pode já existir (com o briefing, por exemplo), desde que não tenha arquivos do template
```

## Opções

| Flag                            | Efeito                                                                              |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `--display-name <nome>`         | Nome exibido no aparelho (padrão: derivado da pasta)                                |
| `--package <id>`                | Pacote Android (padrão: `com.eppck.<nome>`)                                         |
| `--with-supabase`               | Inclui client, autenticação por e-mail, pasta `supabase/` e redirecionador de links |
| `--bare`                        | Gera sem a feature de exemplo (notas)                                               |
| `--skip-install` / `--skip-git` | Pula a instalação ou o `git init`                                                   |
| `-y, --yes`                     | Aceita os padrões sem perguntar                                                     |

## O que o app gerado traz

- Expo 58, React Native 0.88, React 19.3, Expo Router com rotas tipadas e TypeScript 7.
- NativeWind 5 + Tailwind 4 para layout, e o tema do realtime-shopping (cores e formas, claro/escuro).
- UI kit `UI*`, toasts, tours guiados, Ajustes e paywall.
- SQLite com Drizzle, com migrations no bundle.
- i18n pt-BR com chaves tipadas.
- Firebase Analytics, Crashlytics e Remote Config, ligados só quando existe `google-services.json`.
- Contratos de Pro vitalício e de anúncio recompensado, com implementações falsas.
- Jest + Testing Library (domínio e view-models), Biome e GitHub Actions.
- Skills `atualizar-app` e `testar-no-celular` para agentes.

Os detalhes ficam no [AGENTS.md do template](template/base/AGENTS.md).

## Como o template é montado

```
template/
  base/                  app completo sem exemplo e sem Supabase
  modules/<nome>/
    files/               arquivos copiados por cima da base
    module.json          dependências, variáveis de ambiente e trechos para os marcadores
```

A CLI faz quatro coisas:

1. Copia `base/` e aplica os módulos em ordem: `example`, a menos que venha `--bare`, e depois `supabase`.
2. Insere os trechos de cada `module.json` antes dos marcadores `// @inject:<nome>` da base. Mais de um
   módulo pode usar o mesmo marcador, por exemplo `di-getters`.
3. Remove os marcadores e troca os tokens `__APP_NAME__`, `__APP_SLUG__`, `__APP_SCHEME__` e
   `__ANDROID_PACKAGE__`.
4. Instala as dependências e roda `lint:fix`, para o Biome ordenar os imports inseridos.

O npm remove `.gitignore` dos pacotes publicados, por isso a base guarda `_gitignore`.

## Desenvolvimento

```bash
pnpm install
pnpm test          # gera as variantes num diretório temporário e confere o resultado
pnpm typecheck
pnpm lint
```

O CI gera as três variantes (padrão, `--bare` e `--with-supabase`) e roda `typecheck`, `lint`, `test` e
`pnpm audit --audit-level high` em cada uma.

### Versões

Os pisos das dependências do template são de versões com pelo menos duas semanas. O pnpm 11 recusa
versões com menos de um dia (`minimumReleaseAge`), então um piso recente quebra a instalação de um app
novo. Os `~` e `^` deixam entrar as correções que saírem depois.

Para conferir antes de subir versões:

```bash
pnpm dlx expo-doctor@latest   # dentro de um app gerado
```
