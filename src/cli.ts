#!/usr/bin/env node
import path from 'node:path';
import { parseCliArgs, USAGE } from './lib/args.js';
import { detectPackageManager, runFormat, runGitInit, runInstall } from './lib/install.js';
import {
  isValidAndroidPackage,
  toAndroidPackage,
  toDisplayName,
  toScheme,
  toSlug,
} from './lib/names.js';
import { ask, canPrompt } from './lib/prompts.js';
import { type ModuleName, scaffold } from './lib/scaffold.js';

const TEMPLATE_DIR = path.resolve(import.meta.dirname, '..', 'template');

const main = async () => {
  const options = parseCliArgs(process.argv.slice(2));

  if (options.help || !options.projectName) {
    console.log(USAGE);
    process.exit(options.help ? 0 : 1);
  }

  const targetDir = path.resolve(process.cwd(), options.projectName);
  const slug = toSlug(path.basename(targetDir));

  if (!slug) {
    throw new Error(`Nome de app invalido: ${options.projectName}`);
  }

  const interactive = canPrompt() && !options.yes;
  const displayName =
    options.displayName ??
    (interactive
      ? await ask('Nome exibido no aparelho', toDisplayName(slug))
      : toDisplayName(slug));
  const androidPackage =
    options.androidPackage ??
    (interactive ? await ask('Pacote Android', toAndroidPackage(slug)) : toAndroidPackage(slug));

  if (!isValidAndroidPackage(androidPackage)) {
    throw new Error(`Pacote Android invalido: ${androidPackage}`);
  }

  const modules: ModuleName[] = [];
  if (!options.bare) modules.push('example');
  if (options.withSupabase) modules.push('supabase');

  await scaffold({
    templateDir: TEMPLATE_DIR,
    targetDir,
    displayName,
    slug,
    scheme: toScheme(slug),
    androidPackage,
    modules,
  });

  console.log(`[ok] Projeto criado em ${targetDir}`);
  console.log(`     modulos: ${modules.length ? modules.join(', ') : 'nenhum (--bare)'}`);

  if (!options.skipGit && !runGitInit(targetDir)) {
    console.warn('[aviso] git init falhou. Rode manualmente na pasta do projeto.');
  }

  if (!options.skipInstall) {
    const packageManager = detectPackageManager();

    if (!runInstall(packageManager, targetDir)) {
      console.warn(`[aviso] A instalacao falhou. Rode "${packageManager} install" na pasta.`);
    } else if (!runFormat(packageManager, targetDir)) {
      console.warn(`[aviso] Rode "${packageManager} run lint:fix" para ajustar a formatacao.`);
    }
  } else {
    console.log('     sem instalacao: rode "pnpm install && pnpm lint:fix" na pasta.');
  }

  console.log('\nProximos passos:');
  console.log(`  cd ${path.relative(process.cwd(), targetDir) || '.'}`);
  console.log('  pnpm typecheck && pnpm test');
  console.log('  pnpm app:prebuild && pnpm android');
};

main().catch(error => {
  console.error(`[erro] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
