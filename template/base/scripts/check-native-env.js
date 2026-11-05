// Confere o ambiente antes de um build nativo. No Windows, o codigo C++ do React Native gera
// caminhos com mais de 260 caracteres: sem LongPathsEnabled e um ninja recente, o Gradle falha com
// "Filename longer than 260 characters" no meio do build.
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const MIN_NINJA = [1, 12];

const problems = [];

const longPathsEnabled = () => {
  try {
    const output = execFileSync(
      'reg',
      ['query', 'HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem', '/v', 'LongPathsEnabled'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }
    );
    return /0x1\b/.test(output);
  } catch {
    return false;
  }
};

const ninjaVersions = () => {
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  const cmakeRoot = sdk ? path.join(sdk, 'cmake') : null;

  if (!cmakeRoot || !fs.existsSync(cmakeRoot)) {
    return [];
  }

  return fs.readdirSync(cmakeRoot).flatMap(version => {
    const ninja = path.join(cmakeRoot, version, 'bin', 'ninja.exe');

    if (!fs.existsSync(ninja)) {
      return [];
    }

    try {
      const raw = execFileSync(ninja, ['--version'], { encoding: 'utf8' }).trim();
      return [{ path: ninja, version: raw.split('.').map(Number) }];
    } catch {
      return [];
    }
  });
};

const isOlder = (version, min) =>
  version[0] < min[0] || (version[0] === min[0] && (version[1] ?? 0) < min[1]);

if (process.platform === 'win32') {
  if (!longPathsEnabled()) {
    problems.push(
      'O Windows nao aceita caminhos longos. Rode uma vez, num PowerShell como administrador:\n' +
        '  New-ItemProperty -Path HKLM:\\SYSTEM\\CurrentControlSet\\Control\\FileSystem ' +
        '-Name LongPathsEnabled -Value 1 -PropertyType DWORD -Force'
    );
  }

  for (const ninja of ninjaVersions().filter(item => isOlder(item.version, MIN_NINJA))) {
    problems.push(
      `O ninja do Android SDK e antigo (${ninja.version.join('.')}) e nao aceita caminhos longos.\n` +
        `  Troque ${ninja.path} pelo ninja 1.12 ou mais novo:\n` +
        '  https://github.com/ninja-build/ninja/releases (ninja-win.zip)'
    );
  }
}

if (problems.length > 0) {
  console.error(`\n[build nativo] Ajuste o ambiente antes de compilar:\n\n${problems.join('\n\n')}\n`);
  process.exit(1);
}
