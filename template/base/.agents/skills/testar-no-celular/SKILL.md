---
name: testar-no-celular
description: Testa o __APP_NAME__ em um aparelho ou emulador conectado por adb, com capturas de tela e registros. Use para confirmar uma mudança na tela, investigar um problema, ou conferir notificação, vibração, teclado e gestos.
---

# Testar no celular

O aparelho pode ser o celular pessoal de alguém, que pode estar em uso ao mesmo tempo.

## Regras

- **Veja a tela antes de cada toque.** Não encadeie toques às cegas: o app pode reabrir em outra tela, e
  o botão de voltar pode só fechar o teclado.
- Não apague dados nem faça compras reais sem combinar antes.
- Se a tela mudar sem explicação, pare e conte o que aconteceu.

## Comandos

```bash
adb devices
adb shell input keyevent KEYCODE_WAKEUP
adb exec-out screencap -p > captura.png
adb shell input tap <x> <y>
adb shell monkey -p __ANDROID_PACKAGE__ -c android.intent.category.LAUNCHER 1
```

Salve as capturas no scratchpad e leia cada imagem. A imagem pode aparecer reduzida: converta as
coordenadas para o tamanho real da tela, informado por `adb shell wm size`. Uma captura preta significa
tela desligada.

## Registros úteis

```bash
adb logcat -d -b crash -t 30
adb logcat -d -t 500 | grep ReactNativeJS
adb shell dumpsys notification --noredact
adb shell dumpsys vibrator_manager
adb shell dumpsys input_method | grep mInputShown
```

- **Analytics:** em desenvolvimento sem Firebase, os eventos aparecem no log como `[analytics]`.
- **Canal de notificação:** procure `reminders-v1` em `dumpsys notification`. O Android não deixa mudar
  a vibração de um canal já criado: isso exige um id novo.

## Relatar

Diferencie o que viu na tela, o que só confirmou por registro e o que não testou.
