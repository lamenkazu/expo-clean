// Roda uma tarefa do Gradle em android/ no Windows e no Linux. Os scripts do pnpm no Windows nao
// encontram "./gradlew" nem "gradlew", por isso a chamada passa por aqui.
// Uso: node scripts/gradle.js assembleDebug [outros argumentos]
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

// Para antes do Gradle se o ambiente nao compila codigo nativo (ver check-native-env.js).
require('./check-native-env');

const androidDir = path.join(__dirname, '..', 'android');
const isWindows = process.platform === 'win32';
const wrapper = path.join(androidDir, isWindows ? 'gradlew.bat' : 'gradlew');

if (!fs.existsSync(wrapper)) {
  console.error('[gradle] A pasta android/ nao existe. Rode "pnpm app:prebuild" antes.');
  process.exit(1);
}

const args = [...process.argv.slice(2), '--console=plain'];
const result = isWindows
  ? // Caminho explicito: com NoDefaultCurrentDirectoryInExePath, o cmd nao procura na pasta atual.
    spawnSync('cmd.exe', ['/d', '/s', '/c', '.\\gradlew.bat', ...args], {
      cwd: androidDir,
      stdio: 'inherit',
    })
  : spawnSync(wrapper, args, { cwd: androidDir, stdio: 'inherit' });

process.exit(result.status ?? 1);
