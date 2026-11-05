import { spawnSync } from 'node:child_process';

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun';

export const detectPackageManager = (
  userAgent = process.env.npm_config_user_agent ?? ''
): PackageManager => {
  if (userAgent.startsWith('pnpm')) return 'pnpm';
  if (userAgent.startsWith('yarn')) return 'yarn';
  if (userAgent.startsWith('bun')) return 'bun';
  if (userAgent.startsWith('npm')) return 'npm';
  // O template usa recursos do pnpm (nodeLinker hoisted, allowBuilds), entao ele e o padrao.
  return 'pnpm';
};

const isWindows = process.platform === 'win32';

const run = (command: string, args: string[], cwd: string, quiet = false): boolean => {
  const stdio = quiet ? 'ignore' : 'inherit';
  // No Windows, pnpm e npm sao arquivos .cmd e so rodam pelo shell. Os argumentos sao fixos
  // (install, run lint:fix, init), entao a linha inteira vai pronta, sem o array de args.
  const result = isWindows
    ? spawnSync([command, ...args].join(' '), { cwd, stdio, shell: true })
    : spawnSync(command, args, { cwd, stdio });

  return result.status === 0;
};

export const runInstall = (packageManager: PackageManager, cwd: string): boolean =>
  run(packageManager, ['install'], cwd);

// Os trechos dos modulos entram onde estavam os marcadores. O Biome reordena imports e ajusta
// a formatacao para o projeto ja nascer passando no lint.
export const runFormat = (packageManager: PackageManager, cwd: string): boolean =>
  run(packageManager, ['run', 'lint:fix'], cwd, true);

export const runGitInit = (cwd: string): boolean => run('git', ['init', '-b', 'main'], cwd);
