import { existsSync } from 'node:fs';
import { cp, readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type ModuleName = 'example' | 'supabase';

export interface ScaffoldOptions {
  templateDir: string;
  targetDir: string;
  displayName: string;
  slug: string;
  scheme: string;
  androidPackage: string;
  modules: ModuleName[];
}

interface ModuleInjection {
  file: string;
  marker: string;
  content: string;
}

interface ModuleManifest {
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  scripts?: Record<string, string>;
  remove?: string[];
  inject?: ModuleInjection[];
  env?: string[];
}

const SKIP_DIRS = new Set(['node_modules', '.git', '.expo', 'android', 'ios', 'dist', 'coverage']);
const SKIP_FILES = new Set(['pnpm-lock.yaml', 'package-lock.json', 'yarn.lock', 'bun.lock']);
const BINARY_EXTENSIONS = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.ttf',
  '.otf',
  '.ico',
]);

// Marcadores no codigo do template onde os modulos inserem trechos. Saem do app gerado.
const MARKER_PATTERN = /^[ \t]*(\/\/|#|\{\/\*) @inject:[\w-]+( \*\/\})?[ \t]*\r?\n/gm;
const MANIFEST_FILE = 'module.json';

const copyFilter = (source: string) => {
  const name = path.basename(source);
  return !SKIP_DIRS.has(name) && !SKIP_FILES.has(name);
};

export const ensureEmptyDir = async (dir: string): Promise<void> => {
  if (!existsSync(dir)) {
    return;
  }

  const entries = await readdir(dir);

  if (entries.length > 0) {
    throw new Error(`A pasta ${dir} ja existe e nao esta vazia.`);
  }
};

const readManifest = async (moduleDir: string): Promise<ModuleManifest> => {
  const file = path.join(moduleDir, MANIFEST_FILE);

  if (!existsSync(file)) {
    return {};
  }

  return JSON.parse(await readFile(file, 'utf8')) as ModuleManifest;
};

const injectSnippet = async (targetDir: string, injection: ModuleInjection) => {
  const file = path.join(targetDir, injection.file);
  const source = await readFile(file, 'utf8');
  const markerPattern = new RegExp(
    `^([ \\t]*)(\\/\\/|#|\\{\\/\\*) @inject:${injection.marker}( \\*\\/\\})?[ \\t]*$`,
    'm'
  );
  const match = source.match(markerPattern);

  if (!match || match.index === undefined) {
    throw new Error(`Marcador @inject:${injection.marker} nao encontrado em ${injection.file}.`);
  }

  const indent = match[1] ?? '';
  const snippet = injection.content
    .split('\n')
    .map(line => (line ? `${indent}${line}` : line))
    .join('\n');

  // O trecho entra antes do marcador, que continua disponivel para o proximo modulo.
  const updated = `${source.slice(0, match.index)}${snippet}\n${source.slice(match.index)}`;
  await writeFile(file, updated);
};

const applyModule = async (
  options: ScaffoldOptions,
  moduleName: ModuleName,
  packageJson: PackageJson
): Promise<void> => {
  const moduleDir = path.join(options.templateDir, 'modules', moduleName);
  const manifest = await readManifest(moduleDir);
  const filesDir = path.join(moduleDir, 'files');

  for (const relative of manifest.remove ?? []) {
    await rm(path.join(options.targetDir, relative), { recursive: true, force: true });
  }

  if (existsSync(filesDir)) {
    await cp(filesDir, options.targetDir, { recursive: true, force: true, filter: copyFilter });
  }

  for (const injection of manifest.inject ?? []) {
    await injectSnippet(options.targetDir, injection);
  }

  packageJson.dependencies = sortKeys({
    ...packageJson.dependencies,
    ...manifest.dependencies,
  });
  packageJson.devDependencies = sortKeys({
    ...packageJson.devDependencies,
    ...manifest.devDependencies,
  });
  packageJson.scripts = { ...packageJson.scripts, ...manifest.scripts };

  if (manifest.env?.length) {
    const envFile = path.join(options.targetDir, '.env.example');
    const current = existsSync(envFile) ? await readFile(envFile, 'utf8') : '';
    const separator = current && !current.endsWith('\n') ? '\n' : '';
    await writeFile(envFile, `${current}${separator}${manifest.env.join('\n')}\n`);
  }
};

interface PackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

const sortKeys = (record: Record<string, string>) =>
  Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

const walkFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async entry => {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return SKIP_DIRS.has(entry.name) ? [] : walkFiles(full);
      }

      return [full];
    })
  );

  return files.flat();
};

const replaceTokens = async (options: ScaffoldOptions) => {
  const tokens: Record<string, string> = {
    __APP_NAME__: options.displayName,
    __APP_SLUG__: options.slug,
    __APP_SCHEME__: options.scheme,
    __ANDROID_PACKAGE__: options.androidPackage,
  };
  const files = await walkFiles(options.targetDir);

  await Promise.all(
    files
      .filter(file => !BINARY_EXTENSIONS.has(path.extname(file).toLowerCase()))
      .map(async file => {
        const source = await readFile(file, 'utf8');
        const withoutMarkers = source.replace(MARKER_PATTERN, '');
        // Sem o marcador, a linha em branco que o separava pode ficar duplicada.
        let output =
          withoutMarkers === source ? source : withoutMarkers.replace(/(\r?\n){3,}/g, '$1$1');

        for (const [token, value] of Object.entries(tokens)) {
          output = output.replaceAll(token, value);
        }

        if (output !== source) {
          await writeFile(file, output);
        }
      })
  );
};

export const scaffold = async (options: ScaffoldOptions): Promise<void> => {
  const baseDir = path.join(options.templateDir, 'base');

  if (!(await stat(baseDir)).isDirectory()) {
    throw new Error(`Template base nao encontrado em ${baseDir}.`);
  }

  await ensureEmptyDir(options.targetDir);
  await cp(baseDir, options.targetDir, { recursive: true, filter: copyFilter });

  const packageJsonPath = path.join(options.targetDir, 'package.json');
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as PackageJson;

  for (const moduleName of options.modules) {
    await applyModule(options, moduleName, packageJson);
  }

  packageJson.name = options.slug;
  packageJson.version = '0.1.0';
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

  // O npm remove .gitignore dos pacotes publicados, por isso o template guarda _gitignore.
  const gitignore = path.join(options.targetDir, '_gitignore');
  if (existsSync(gitignore)) {
    await rename(gitignore, path.join(options.targetDir, '.gitignore'));
  }

  await replaceTokens(options);
};
