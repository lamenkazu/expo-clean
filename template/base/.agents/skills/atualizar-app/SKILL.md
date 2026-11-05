---
name: atualizar-app
description: Gera e instala uma nova versão do __APP_NAME__ no aparelho, ou publica uma atualização pelo EAS Update. Use ao pedir para atualizar o app, gerar o APK ou o AAB, instalar no celular ou publicar uma atualização.
---

# Atualizar o app

O pacote é `__ANDROID_PACKAGE__`.

## 1. Verificar antes de gerar

Só continue se tudo passar:

```bash
pnpm check
```

## 2. Ver se precisa de build nativo

Mudanças nativas exigem um APK ou AAB novo, mesmo com EAS Update:

- dependência com código nativo
- permissões, ícones, splash e plugins em `app.json` ou `app.config.js`
- `google-services.json`
- versão do Expo ou do React Native

Se algo disso mudou, suba `version` em `app.json` (ela define o `runtimeVersion`) e rode:

```bash
pnpm app:prebuild
```

Não use `--clean` sem necessidade: ele apaga `android/local.properties`.

## 3. Gerar

```bash
pnpm apk:release      # APK para instalar direto
pnpm aab:release      # AAB para a Play Console
```

Os arquivos ficam em `android/app/build/outputs/apk/release/` e `android/app/build/outputs/bundle/release/`.
O primeiro build leva cerca de 10 minutos. Rode em segundo plano.

## 4. Instalar

```bash
adb devices
adb -s <serial> install -r android/app/build/outputs/apk/release/app-release.apk
```

A instalação reinicia o app. Se a pessoa estiver usando o aparelho, avise antes.

## 5. Conferir e relatar

Use a skill `testar-no-celular` para ver a mudança na tela. Só afirme que algo funciona se tiver visto
isso funcionar.

## EAS Update

Mudanças só em JavaScript, estilos e imagens não precisam de build. Peça a confirmação da pessoa antes,
porque a atualização chega aos aparelhos dela:

```bash
pnpm app:update --platform android --message "<o que mudou>"
```

Em Ajustes, a linha de versão mostra a atualização em uso, ou "do APK" quando ainda não recebeu nenhuma.

Se a permissão desta sessão bloquear a publicação, não procure outro caminho: peça para a pessoa rodar
o comando.
